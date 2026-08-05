resource "aws_ecs_cluster" "cursus_cluster" {
  name = "${var.project_name}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/${var.project_name}-${var.environment}"
  retention_in_days = 30
}

resource "aws_ecs_task_definition" "cursus_task_definition" {
  family                   = "${var.project_name}-task-definition"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.cursus_ecs_service_iam_role.arn
  task_role_arn            = aws_iam_role.ecs_app_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "${var.project_name}-app"
      image     = "${aws_ecr_repository.cursus_ecr_repo.repository_url}:initial"
      essential = true
      portMappings = [
        {
          containerPort = var.container_port
          hostPort      = var.container_port
        }
      ]
      environment = [
        {
          name  = "APP_URL"
          value = "${var.app_url}"
        },
        {
          name  = "AWS_S3_REGION"
          value = "${var.aws_region}"
        },
        {
          name  = "AWS_S3_BUCKET_NAME"
          value = aws_s3_bucket.cursus_bucket.bucket
        },
      ]

      secrets = [
        {
          name      = "DATABASE_URL"
          valueFrom = aws_secretsmanager_secret.database_url.arn
        },
        {
          name      = "SESSION_PASSWORD"
          valueFrom = aws_ssm_parameter.session_password.arn
        },
        {
          name      = "PUSHER_APP_ID"
          valueFrom = aws_ssm_parameter.pusher_app_id.arn
        },
        {
          name      = "PUSHER_KEY"
          valueFrom = aws_ssm_parameter.pusher_key.arn
        },
        {
          name      = "PUSHER_SECRET"
          valueFrom = aws_ssm_parameter.pusher_secret.arn
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.ecs_logs.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "cursus_ecs_service" {
  name            = "${var.project_name}-service"
  cluster         = aws_ecs_cluster.cursus_cluster.id
  task_definition = aws_ecs_task_definition.cursus_task_definition.arn
  desired_count   = 2
  launch_type     = "FARGATE"

  depends_on = [
    aws_iam_role_policy_attachment.cursus_ecs_service_iam_role,
    aws_lb_listener.http,
    aws_lb_listener.https
  ]

  network_configuration {
    subnets          = [for subnet in aws_subnet.cursus_private : subnet.id]
    security_groups  = [aws_security_group.cursus_web_sg.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.cursus_lb_tg.arn
    container_name   = "${var.project_name}-app"
    container_port   = var.container_port
  }

  lifecycle {
    ignore_changes = [
      task_definition,
      desired_count
    ]
  }
}