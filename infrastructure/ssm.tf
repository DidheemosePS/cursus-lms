data "aws_secretsmanager_secret_version" "rds_password" {
  secret_id = aws_db_instance.cursus_db_instance.master_user_secret[0].secret_arn
}

resource "aws_secretsmanager_secret" "database_url" {
  name        = "${var.app_name}/database_url"
  description = "Full connection string for DATABASE_URL"
}

resource "aws_secretsmanager_secret_version" "database_url_val" {
  secret_id     = aws_secretsmanager_secret.database_url.id
  secret_string = "postgresql://${jsondecode(data.aws_secretsmanager_secret_version.rds_password.secret_string)["username"]}:${jsondecode(data.aws_secretsmanager_secret_version.rds_password.secret_string)["password"]}@${aws_db_proxy.cursus_db_proxy.endpoint}:5432/${aws_db_instance.cursus_db_instance.db_name}?schema=public"
}

resource "aws_secretsmanager_secret" "pusher_secret" {
  name = "${var.app_name}/pusher_secret"
}

resource "aws_secretsmanager_secret_version" "pusher_secret_val" {
  secret_id     = aws_secretsmanager_secret.pusher_secret.id
  secret_string = "3efa2cb6914f4a296b5e"
}

resource "aws_secretsmanager_secret" "session_password" {
  name = "${var.app_name}/session_password"
}

resource "aws_secretsmanager_secret_version" "session_password_val" {
  secret_id     = aws_secretsmanager_secret.session_password.id
  secret_string = "627b8a9c824d9d6da8d41100805236d5ad77d84576d782d86a01c82997df4b84"
}