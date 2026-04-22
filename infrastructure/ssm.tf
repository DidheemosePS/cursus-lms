# SSM Parameter Store
# Secrets are stored here and injected into ECS containers at runtime
# ECS task definition references the parameter PATH — not the value
# The actual secret value never appears in Terraform state or task definitions

# Database URL
# Constructed from the RDS instance endpoint + credentials
# SecureString = encrypted with AWS KMS

resource "aws_ssm_parameter" "database_url" {
  name  = "/${var.app_name}/${var.environment}/DATABASE_URL"
  type  = "SecureString"
  value = "postgresql://${var.db_username}:${var.db_password}@${aws_db_instance.main.endpoint}/${var.db_name}?schema=public"

  tags = {
    Name = "${var.app_name}-database-url"
  }
}

# Session Secret

resource "aws_ssm_parameter" "session_secret" {
  name  = "/${var.app_name}/${var.environment}/SESSION_SECRET"
  type  = "SecureString"
  value = var.session_secret

  tags = {
    Name = "${var.app_name}-session-secret"
  }
}

# Pusher secrets

resource "aws_ssm_parameter" "pusher_app_id" {
  name  = "/${var.app_name}/${var.environment}/PUSHER_APP_ID"
  type  = "SecureString"
  value = var.pusher_app_id

  tags = {
    Name = "${var.app_name}-pusher-app-id"
  }
}

resource "aws_ssm_parameter" "pusher_secret" {
  name  = "/${var.app_name}/${var.environment}/PUSHER_SECRET"
  type  = "SecureString"
  value = var.pusher_secret

  tags = {
    Name = "${var.app_name}-pusher-secret"
  }
}

# Non-sensitive config
# Plain String type — these are not secrets but stored in SSM
# for consistency so all config comes from one place

resource "aws_ssm_parameter" "pusher_key" {
  name  = "/${var.app_name}/${var.environment}/NEXT_PUBLIC_PUSHER_KEY"
  type  = "String"
  value = var.pusher_key

  tags = {
    Name = "${var.app_name}-pusher-key"
  }
}

resource "aws_ssm_parameter" "aws_bucket_name" {
  name  = "/${var.app_name}/${var.environment}/AWS_BUCKET_NAME"
  type  = "String"
  value = var.aws_bucket_name

  tags = {
    Name = "${var.app_name}-bucket-name"
  }
}

resource "aws_ssm_parameter" "app_url" {
  name  = "/${var.app_name}/${var.environment}/NEXT_PUBLIC_APP_URL"
  type  = "String"
  value = "https://${var.domain_name}"

  tags = {
    Name = "${var.app_name}-app-url"
  }
}

resource "aws_ssm_parameter" "aws_region" {
  name  = "/${var.app_name}/${var.environment}/AWS_REGION"
  type  = "String"
  value = var.aws_region

  tags = {
    Name = "${var.app_name}-aws-region"
  }
}