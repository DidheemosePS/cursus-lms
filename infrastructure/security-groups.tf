# ALB Security Group
# The load balancer is the only resource exposed to the internet
# Accepts HTTP and HTTPS from anywhere — redirects HTTP to HTTPS

resource "aws_security_group" "alb" {
  name        = "${var.app_name}-alb-sg"
  description = "Controls traffic to the Application Load Balancer"
  vpc_id      = aws_vpc.main.id

  # Allow HTTP from anywhere — ALB will redirect to HTTPS
  ingress {
    description = "HTTP from internet"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow HTTPS from anywhere
  ingress {
    description = "HTTPS from internet"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound — ALB needs to forward traffic to ECS
  egress {
    description = "All outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"            # -1 means all protocols
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.app_name}-alb-sg"
  }
}

# ECS Security Group
# ECS tasks are in private subnets — not reachable from the internet directly
# Only the ALB can send traffic to ECS tasks on port 3000

resource "aws_security_group" "ecs" {
  name        = "${var.app_name}-ecs-sg"
  description = "Controls traffic to ECS tasks"
  vpc_id      = aws_vpc.main.id

  # Only accept traffic from the ALB security group on the container port
  ingress {
    description     = "Traffic from ALB only"
    from_port       = var.container_port    # 3000
    to_port         = var.container_port
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]   # Reference to ALB SG — not an IP range
  }

  # Allow all outbound — ECS needs to reach S3, Pusher, ECR, RDS
  egress {
    description = "All outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.app_name}-ecs-sg"
  }
}

# RDS Security Group
# RDS is in a private subnet — only ECS tasks can connect to it
# Nothing else — not even you directly — can reach the database

resource "aws_security_group" "rds" {
  name        = "${var.app_name}-rds-sg"
  description = "Controls traffic to the RDS PostgreSQL instance"
  vpc_id      = aws_vpc.main.id

  # Only accept PostgreSQL connections from ECS tasks
  ingress {
    description     = "PostgreSQL from ECS only"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs.id]   # Reference to ECS SG
  }

  # RDS does not need outbound access
  egress {
    description = "All outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.app_name}-rds-sg"
  }
}