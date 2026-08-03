resource "aws_lb" "cursus_lb" {
  name               = "${var.app_name}-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.cursus_alb_sg.id]
  subnets            = [for subnet in aws_subnet.cursus_public : subnet.id]

  enable_deletion_protection = local.enable_deletion_protection

  access_logs {
    bucket  = aws_s3_bucket.cursus_bucket.id
    prefix  = "${var.app_name}-lb-logs"
    enabled = true
  }

  tags = {
    Environment = "production"
  }
}

resource "aws_lb_target_group" "cursus_lb_tg" {
  name        = "${var.app_name}-lb-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.cursus_vpc.id
  target_type = "ip"

  health_check {
    enabled             = true
    path                = "/api/health"
    protocol            = "HTTP"
    matcher             = "200"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
  }

  tags = {
    Name = "${var.app_name}-lb-traget-group"
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.cursus_lb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.cursus_lb.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = aws_acm_certificate_validation.cert_validation.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.cursus_lb_tg.arn
  }
}