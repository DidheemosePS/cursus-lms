resource "aws_iam_role" "ecs_app_task_role" {
  name = "${var.project_name}-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy" "s3_app_access" {
  name = "${var.project_name}-app-s3-policy"
  role = aws_iam_role.ecs_app_task_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.cursus_bucket.arn,
          "${aws_s3_bucket.cursus_bucket.arn}/*"
        ]
      }
    ]
  })
}

data "aws_elb_service_account" "main" {}

resource "aws_s3_bucket_policy" "alb_access_logs" {
  bucket = aws_s3_bucket.cursus_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = data.aws_elb_service_account.main.arn
        }
        Action   = "s3:PutObject"
        Resource = "${aws_s3_bucket.cursus_bucket.arn}/*"
      }
    ]
  })
}

resource "aws_iam_role" "cursus_ecs_service_iam_role" {
  name = "${var.project_name}-ecs-service-iam-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = { Service = "ecs-tasks.amazonaws.com" }
        Action    = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-ecs-execution-role"
  }
}

resource "aws_iam_role_policy_attachment" "cursus_ecs_service_iam_role" {
  role       = aws_iam_role.cursus_ecs_service_iam_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy" "cursus_ecs_secrets_policy" {
  name = "${var.project_name}-ecs-secrets-policy"
  role = aws_iam_role.cursus_ecs_service_iam_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "ssm:GetParameters"
        ]
        Resource = [
          aws_secretsmanager_secret.database_url.arn,
          aws_ssm_parameter.session_password.arn,
          aws_ssm_parameter.pusher_app_id.arn,
          aws_ssm_parameter.pusher_key.arn,
          aws_ssm_parameter.pusher_secret.arn
        ]
      }
    ]
  })
}

resource "aws_iam_role" "rds_proxy_role" {
  name = "${var.project_name}-rds-proxy-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "rds.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "rds_proxy_policy" {
  name = "${var.project_name}-rds-proxy-policy"
  role = aws_iam_role.rds_proxy_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = [aws_db_instance.cursus_db_instance.master_user_secret[0].secret_arn]
      },
      {
        Effect = "Allow"
        Action = [
          "kms:Decrypt"
        ]
        Resource = "*"
        Condition = {
          StringEquals = {
            "kms:ViaService" = "secretsmanager.${var.aws_region}"
          }
        }
      }
    ]
  })
}