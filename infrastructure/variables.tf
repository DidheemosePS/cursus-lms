# General

variable "aws_region" {
  description = "AWS region to deploy all resources"
  type        = string
  default     = "eu-west-1"
}

variable "environment" {
  description = "Deployment environment — used in resource names and tags"
  type        = string
  default     = "production"
}

variable "app_name" {
  description = "Application name — used as a prefix for all resource names"
  type        = string
  default     = "cursus"
}

# Networking

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets — one per availability zone"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets — one per availability zone"
  type        = list(string)
  default     = ["10.0.3.0/24", "10.0.4.0/24"]
}

variable "availability_zones" {
  description = "Availability zones to deploy subnets into"
  type        = list(string)
  default     = ["eu-west-1a", "eu-west-1b"]
}

# ECR

variable "ecr_repository_name" {
  description = "Name of the existing ECR repository"
  type        = string
  default     = "cursus-app-repo"
}

# ECS

variable "ecs_task_cpu" {
  description = "CPU units for the ECS task (1024 = 1 vCPU)"
  type        = number
  default     = 256
}

variable "ecs_task_memory" {
  description = "Memory in MB for the ECS task"
  type        = number
  default     = 512
}

variable "ecs_desired_count" {
  description = "Number of ECS task instances to run"
  type        = number
  default     = 1
}

variable "container_port" {
  description = "Port the Next.js container listens on"
  type        = number
  default     = 3000
}

# RDS

variable "db_instance_class" {
  description = "RDS instance type"
  type        = string
  default     = "db.t3.micro"
}

variable "db_name" {
  description = "Name of the PostgreSQL database"
  type        = string
  default     = "cursus"
}

variable "db_username" {
  description = "Master username for the RDS instance"
  type        = string
  default     = "cursus_admin"
}

variable "db_password" {
  description = "Master password for the RDS instance"
  type        = string
  sensitive   = true
}

variable "db_allocated_storage" {
  description = "Storage in GB for the RDS instance"
  type        = number
  default     = 20
}

# Domain

variable "domain_name" {
  description = "Your domain name — e.g. cursus.yourdomain.com"
  type        = string
}

variable "route53_zone_id" {
  description = "Route 53 hosted zone ID for the domain"
  type        = string
}

# App secrets
# AWS credentials are NOT needed here — the ECS task IAM role handles
# all AWS service authentication (S3, ECR, etc.) automatically

variable "session_secret" {
  description = "Secret used to sign iron-session cookies"
  type        = string
  sensitive   = true
}

variable "pusher_app_id" {
  description = "Pusher app ID"
  type        = string
  sensitive   = true
}

variable "pusher_key" {
  description = "Pusher public key (NEXT_PUBLIC_PUSHER_KEY)"
  type        = string
}

variable "pusher_secret" {
  description = "Pusher secret"
  type        = string
  sensitive   = true
}

variable "aws_bucket_name" {
  description = "S3 bucket name the app uploads files to — credentials provided by ECS task IAM role"
  type        = string
}

variable "github_connection_arn" {
  description = "AWS CodeStar connection ARN for GitHub"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository in format owner/repo-name"
  type        = string
}

variable "github_branch" {
  description = "Branch to trigger pipeline on"
  type        = string
  default     = "main"
}