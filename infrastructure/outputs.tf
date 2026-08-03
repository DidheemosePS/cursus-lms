output "github_actions_role_arn" {
  description = "ARN of the IAM Role for GitHub Actions OIDC (Save as AWS_ROLE_ARN secret in GitHub)"
  value       = aws_iam_role.github_actions.arn
}

output "ecr_repository_url" {
  description = "URL of the Amazon ECR Repository"
  value       = aws_ecr_repository.cursus_ecr_repo.repository_url
}

output "ecs_cluster_name" {
  description = "Name of the ECS Cluster"
  value       = aws_ecs_cluster.cursus_cluster.name
}

output "ecs_service_name" {
  description = "Name of the ECS Service"
  value       = aws_ecs_service.cursus_ecs_service.name
}

output "namecheap_nameservers" {
  description = "Paste these 4 Name Servers into Namecheaps Custom DNS settings"
  value       = aws_route53_zone.primary.name_servers
}

output "alb_dns_name" {
  description = "The DNS Name of the Application Load Balancer"
  value       = aws_lb.cursus_lb.dns_name
}