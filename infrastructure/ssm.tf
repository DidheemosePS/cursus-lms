# DB URL
data "aws_secretsmanager_secret_version" "rds_password" {
  secret_id = aws_db_instance.cursus_db_instance.master_user_secret[0].secret_arn
}

resource "aws_secretsmanager_secret" "database_url" {
  description = "Full connection string for DATABASE_URL"
  name        = "${var.project_name}/database-url"
}

resource "aws_secretsmanager_secret_version" "database_url_val" {
  secret_id     = aws_secretsmanager_secret.database_url.id
  secret_string = "postgresql://${jsondecode(data.aws_secretsmanager_secret_version.rds_password.secret_string)["username"]}:${jsondecode(data.aws_secretsmanager_secret_version.rds_password.secret_string)["password"]}@${aws_db_proxy.cursus_db_proxy.endpoint}:5432/${aws_db_instance.cursus_db_instance.db_name}?schema=public"
}

# API Keys
resource "aws_ssm_parameter" "pusher_app_id" {
  name  = "/${var.project_name}/pusher/app-id"
  type  = "String"
  value = "SECRET_VALUE"

  lifecycle { ignore_changes = [value] }
}

resource "aws_ssm_parameter" "pusher_key" {
  name  = "/${var.project_name}/pusher/key"
  type  = "String"
  value = "SECRET_VALUE"

  lifecycle { ignore_changes = [value] }
}

resource "aws_ssm_parameter" "pusher_secret" {
  name  = "/${var.project_name}/pusher/secret"
  type  = "String"
  value = "SECRET_VALUE"

  lifecycle { ignore_changes = [value] }
}

resource "aws_ssm_parameter" "session_password" {
  name  = "/${var.project_name}/session/password"
  type  = "String"
  value = "SECRET_VALUE"

  lifecycle { ignore_changes = [value] }
}