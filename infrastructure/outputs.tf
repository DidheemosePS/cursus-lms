output "name_servers" {
  description = "Paste these 4 Name Servers into Namecheaps Custom DNS settings"
  value       = aws_route53_zone.primary.name_servers
}

output "rds_endpoint" {
  description = "RDS PostgreSQL Host Endpoint"
  value       = aws_db_instance.cursus_db_instance.endpoint
}

output "ecr_repository_url" {
  description = "URL of the Amazon ECR Repository"
  value       = aws_ecr_repository.cursus_ecr_repo.repository_url
}

output "alb_dns_name" {
  description = "The DNS Name of the Application Load Balancer"
  value       = aws_lb.cursus_lb.dns_name
}

output "github_actions_role_arn" {
  description = "ARN of the IAM Role for GitHub Actions OIDC (Save as AWS_ROLE_ARN secret in GitHub)"
  value       = aws_iam_role.github_actions.arn
}

output "private_subnet_ids" {
  description = "JSON formatted list of private subnet IDs for ECS tasks"
  value       = jsonencode([for s in aws_subnet.cursus_private : s.id])
}

output "ecs_security_group_id" {
  description = "Security group ID for ECS tasks"
  value       = aws_security_group.cursus_web_sg.id
}