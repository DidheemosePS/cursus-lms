resource "aws_sns_topic" "ops_alerts" {
  name = "${var.project_name}-${var.environment}-ops-alerts"
}

resource "aws_sns_topic_subscription" "email_subscription" {
  topic_arn = aws_sns_topic.ops_alerts.arn
  protocol  = "email"
  endpoint  = var.email
}

resource "aws_cloudwatch_metric_alarm" "cpu_high" {
  alarm_name          = "${var.project_name}-${var.environment}-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = 300
  statistic           = "Average"
  threshold           = 85
  alarm_description   = "Alarm when ECS service CPU exceeds 85%"
  alarm_actions       = [aws_sns_topic.ops_alerts.arn]

  dimensions = {
    ClusterName = aws_ecs_cluster.cursus_cluster.name
    ServiceName = aws_ecs_service.cursus_ecs_service.name
  }
}

resource "aws_cloudwatch_metric_alarm" "memory_high" {
  alarm_name          = "${var.project_name}-${var.environment}-high-memory"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "MemoryUtilization"
  namespace           = "AWS/ECS"
  period              = 300
  statistic           = "Average"
  threshold           = 90
  alarm_description   = "Alarm when ECS service Memory exceeds 90%"
  alarm_actions       = [aws_sns_topic.ops_alerts.arn]

  dimensions = {
    ClusterName = aws_ecs_cluster.cursus_cluster.name
    ServiceName = aws_ecs_service.cursus_ecs_service.name
  }
}