# Application Load Balancer
# Sits in public subnets — the only resource directly reachable from the internet
# Forwards traffic to ECS tasks in private subnets

resource "aws_lb" "main" {
  name               = "${var.app_name}-alb"
  internal           = false                          # Public-facing
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id        # Both public subnets

  # Access logs disabled for minimal setup — enable for production debugging
  enable_deletion_protection = false

  tags = {
    Name = "${var.app_name}-alb"
  }
}

# Target Group
# The group of ECS tasks the ALB forwards traffic to
# Health checks ensure only healthy tasks receive traffic

resource "aws_lb_target_group" "app" {
  name        = "${var.app_name}-tg"
  port        = var.container_port    # 3000
  protocol    = "HTTP"                # ALB to ECS is HTTP — SSL terminates at ALB
  vpc_id      = aws_vpc.main.id
  target_type = "ip"                  # Required for Fargate — uses task IP not EC2 instance

  health_check {
    enabled             = true
    path                = "/"          # Next.js landing page
    port                = "traffic-port"
    protocol            = "HTTP"
    healthy_threshold   = 2            # 2 consecutive successes = healthy
    unhealthy_threshold = 3            # 3 consecutive failures = unhealthy
    timeout             = 5            # Seconds to wait for response
    interval            = 30           # Seconds between health checks
    matcher             = "200-399"    # Any 2xx or 3xx = healthy
  }

  tags = {
    Name = "${var.app_name}-tg"
  }
}

# HTTP Listener — redirect to HTTPS
# Any request on port 80 gets a permanent redirect to HTTPS
# Users who type http:// get automatically upgraded

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"    # Permanent redirect
    }
  }
}

# HTTPS Listener — forward to ECS
# Accepts HTTPS traffic, terminates SSL, forwards plain HTTP to ECS tasks
# SSL certificate comes from ACM — created in acm.tf

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.main.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"  # Modern TLS policy
  certificate_arn   = aws_acm_certificate_validation.main.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}