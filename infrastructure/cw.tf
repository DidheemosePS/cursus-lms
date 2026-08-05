resource "aws_cloudwatch_log_group" "ecs_logs" {
  name              = var.project_name
  retention_in_days = 30

  tags = {
    Environment = "${var.project_name}-${var.environment}"
  }
}