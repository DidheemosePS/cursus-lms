# Outputs
# Printed after terraform apply completes
# Use these values to configure Namecheap, test deployment, connect to DB

# Networking

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "alb_dns_name" {
  description = "ALB DNS name — use this to test before DNS propagates"
  value       = aws_lb.main.dns_name
}

output "alb_zone_id" {
  description = "ALB hosted zone ID — used for Route 53 alias record"
  value       = aws_lb.main.zone_id
}

# Route 53

output "nameservers" {
  description = "Route 53 nameservers — add these to Namecheap custom DNS"
  value       = data.aws_route53_zone.main.name_servers
}

output "app_url" {
  description = "Your application URL"
  value       = "https://${var.domain_name}"
}

# RDS

output "rds_endpoint" {
  description = "RDS endpoint — used in DATABASE_URL"
  value       = aws_db_instance.main.endpoint
}

output "rds_port" {
  description = "RDS port"
  value       = aws_db_instance.main.port
}

# ECS

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  description = "ECS service name"
  value       = aws_ecs_service.app.name
}

# ECR

output "ecr_repository_url" {
  description = "ECR repository URL — used in buildspec.yml"
  value       = data.aws_ecr_repository.app.repository_url
}

# CodePipeline

output "codepipeline_name" {
  description = "CodePipeline name — view in AWS console"
  value       = aws_codepipeline.app.name
}

output "pipeline_artifacts_bucket" {
  description = "S3 bucket storing pipeline artifacts"
  value       = aws_s3_bucket.pipeline_artifacts.bucket
}