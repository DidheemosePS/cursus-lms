# CloudWatch Log Group
# Container logs go here — viewable in AWS console or CLI
# Retention set to 30 days to control costs

resource "aws_cloudwatch_log_group" "app" {
  name              = "/ecs/${var.app_name}"
  retention_in_days = 30

  tags = {
    Name = "${var.app_name}-logs"
  }
}

# ECS Cluster
# Logical grouping — Fargate manages the underlying infrastructure
# No EC2 instances to manage or patch

resource "aws_ecs_cluster" "main" {
  name = "${var.app_name}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"     # Enables CloudWatch metrics for the cluster
  }

  tags = {
    Name = "${var.app_name}-cluster"
  }
}

# Data source — existing ECR repository
# References the ECR repo you already created and pushed to
# Terraform reads it without managing it

data "aws_ecr_repository" "app" {
  name = var.ecr_repository_name    # cursus-app-repo
}

# ECS Task Definition
# Blueprint for the container — CPU, memory, image, env vars, logs, IAM roles

resource "aws_ecs_task_definition" "app" {
  family                   = "${var.app_name}-task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"       # Required for Fargate
  cpu                      = var.ecs_task_cpu       # 256
  memory                   = var.ecs_task_memory    # 512

  # Execution role — used by ECS agent to pull image and fetch secrets
  execution_role_arn = aws_iam_role.ecs_task_execution.arn

  # Task role — used by your app code at runtime for S3 access
  task_role_arn = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name  = "${var.app_name}-container"
      image = "${data.aws_ecr_repository.app.repository_url}:latest"

      portMappings = [
        {
          containerPort = var.container_port    # 3000
          protocol      = "tcp"
        }
      ]

      # Environment variables injected from SSM at container startup
      # valueFrom references the SSM parameter ARN — the actual value is never in the task definition
      secrets = [
        {
          name      = "DATABASE_URL"
          valueFrom = aws_ssm_parameter.database_url.arn
        },
        {
          name      = "SESSION_SECRET"
          valueFrom = aws_ssm_parameter.session_secret.arn
        },
        {
          name      = "PUSHER_APP_ID"
          valueFrom = aws_ssm_parameter.pusher_app_id.arn
        },
        {
          name      = "PUSHER_SECRET"
          valueFrom = aws_ssm_parameter.pusher_secret.arn
        }
      ]

      # Non-sensitive config — plain environment variables
      environment = [
        {
          name  = "NODE_ENV"
          value = "production"
        },
        {
          name  = "NEXT_TELEMETRY_DISABLED"
          value = "1"
        },
        {
          name  = "PORT"
          value = tostring(var.container_port)
        },
        {
          name  = "HOSTNAME"
          value = "0.0.0.0"
        },
        {
          name  = "NEXT_PUBLIC_PUSHER_KEY"
          value = var.pusher_key
        },
        {
          name  = "AWS_BUCKET_NAME"
          value = var.aws_bucket_name
        },
        {
          name  = "AWS_REGION"
          value = var.aws_region
        },
        {
          name  = "NEXT_PUBLIC_APP_URL"
          value = "https://${var.domain_name}"
        }
      ]

      # Send container logs to CloudWatch
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.app.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }

      # Health check at container level — separate from ALB health check
      # If the container fails this check ECS restarts it
      healthCheck = {
        command     = ["CMD-SHELL", "wget -qO- http://localhost:${var.container_port}/ || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60    # Give Next.js 60 seconds to start before checking
      }

      essential = true    # If this container stops the whole task stops
    }
  ])

  tags = {
    Name = "${var.app_name}-task"
  }
}

# ECS Service
# Keeps the desired number of tasks running
# Handles rolling deployments — starts new task before stopping old one
# Connected to the ALB target group so traffic routes to healthy tasks

resource "aws_ecs_service" "app" {
  name            = "${var.app_name}-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = var.ecs_desired_count    # 1
  launch_type     = "FARGATE"

  # Networking — tasks run in private subnets
  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.ecs.id]
    assign_public_ip = false    # Private subnet — no public IP needed
  }

  # Connect to ALB target group
  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "${var.app_name}-container"
    container_port   = var.container_port
  }

  # Rolling deployment settings
  deployment_minimum_healthy_percent = 50     # Keep at least 50% of tasks running during deploy
  deployment_maximum_percent         = 200    # Allow up to 200% during deployment (old + new)

  # Wait for the service to be stable before Terraform considers apply complete
  wait_for_steady_state = true

  # Ignore task definition changes made by CodePipeline
  # Without this Terraform would revert every CodePipeline deployment
  lifecycle {
    ignore_changes = [task_definition]
  }

  depends_on = [
    aws_lb_listener.https,
    aws_iam_role_policy_attachment.ecs_task_execution
  ]

  tags = {
    Name = "${var.app_name}-service"
  }
}