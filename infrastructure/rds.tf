# DB Subnet Group
# Tells RDS which subnets it can use
# Must span at least two AZs — AWS requirement even for single instance

resource "aws_db_subnet_group" "main" {
  name        = "${var.app_name}-db-subnet-group"
  description = "Subnet group for Cursus RDS instance"
  subnet_ids  = aws_subnet.private[*].id    # Both private subnets

  tags = {
    Name = "${var.app_name}-db-subnet-group"
  }
}

# DB Parameter Group
# PostgreSQL configuration settings
# Defining our own means we can tune settings later without recreating the instance

resource "aws_db_parameter_group" "main" {
  name        = "${var.app_name}-db-params"
  family      = "postgres16"
  description = "Parameter group for Cursus PostgreSQL 16"

  tags = {
    Name = "${var.app_name}-db-params"
  }
}

# RDS Instance

resource "aws_db_instance" "main" {
  identifier = "${var.app_name}-db"

  # Engine
  engine         = "postgres"
  engine_version = "16"
  instance_class = var.db_instance_class    # db.t3.micro

  # Storage — gp2 is the standard SSD storage type
  allocated_storage     = var.db_allocated_storage    # 20GB
  storage_type          = "gp2"
  storage_encrypted     = true                        # Encrypt data at rest

  # Database credentials
  db_name  = var.db_name        # cursus
  username = var.db_username    # cursus_admin
  password = var.db_password    # from terraform.tfvars — sensitive

  # Networking — place in private subnets, attach RDS security group
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  # Not publicly accessible — only reachable from within the VPC
  publicly_accessible = false

  # Configuration
  parameter_group_name = aws_db_parameter_group.main.name
  port                 = 5432

  # Backups — 7 days retention, taken during low-traffic window
  backup_retention_period = 7
  backup_window           = "03:00-04:00"    # UTC — 3-4am
  maintenance_window      = "Mon:04:00-Mon:05:00"

  # Protect against accidental deletion
  deletion_protection = true

  # Take a final snapshot before destroying — protects against data loss
  # Set to true only if you are sure you want to destroy all data
  skip_final_snapshot       = false
  final_snapshot_identifier = "${var.app_name}-db-final-snapshot"

  # Performance Insights — free tier, useful for query monitoring
  performance_insights_enabled = true

  # Minor version upgrades applied automatically during maintenance window
  auto_minor_version_upgrade = true

  tags = {
    Name = "${var.app_name}-db"
  }
}