resource "aws_db_subnet_group" "cursus_db_subnet_group" {
  name       = "${var.project_name}-db-subnet-group"
  subnet_ids = [for subnet in aws_subnet.cursus_private : subnet.id]
}

resource "aws_db_parameter_group" "cursus_db_parameter_group" {
  name_prefix = "${var.project_name}-db-parameter-group"
  family      = "postgres18"

  parameter {
    name  = "log_connections"
    value = "all"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_db_instance" "cursus_db_instance" {
  identifier                  = "${var.project_name}-db-instance"
  instance_class              = "db.t3.micro"
  allocated_storage           = 5
  engine                      = "postgres"
  engine_version              = "18.4"
  username                    = var.db_username
  manage_master_user_password = true
  db_subnet_group_name        = aws_db_subnet_group.cursus_db_subnet_group.name
  vpc_security_group_ids      = [aws_security_group.cursus_db_sg.id]
  parameter_group_name        = aws_db_parameter_group.cursus_db_parameter_group.name
  apply_immediately           = true
  publicly_accessible         = false
  skip_final_snapshot         = true
}

resource "aws_db_proxy" "cursus_db_proxy" {
  name                   = "${var.project_name}-db-proxy"
  debug_logging          = false
  engine_family          = "POSTGRESQL"
  idle_client_timeout    = 1800
  require_tls            = true
  role_arn               = aws_iam_role.rds_proxy_role.arn
  vpc_security_group_ids = [aws_security_group.cursus_proxy_sg.id]
  vpc_subnet_ids         = [for s in aws_subnet.cursus_private : s.id]

  auth {
    auth_scheme = "SECRETS"
    description = "Master DB credentials from Secrets Manager"
    iam_auth    = "DISABLED"
    secret_arn  = aws_db_instance.cursus_db_instance.master_user_secret[0].secret_arn
  }
}