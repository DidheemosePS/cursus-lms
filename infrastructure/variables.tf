variable "aws_region" {
  description = "Region where this resource will be managed"
  type        = string
  default     = "eu-west-1"
}

variable "app_name" {
  type    = string
  default = "cursus-lms"
}

variable "APP_URL" {
  type    = string
  default = "https://cursus-aws.didheemose.dev"
}

variable "AWS_S3_REGION" {
  type    = string
  default = "eu-west-1"
}

variable "PUSHER_APP_ID" {
  type    = string
  default = "2129092"
}

variable "NEXT_PUBLIC_PUSHER_KEY" {
  type    = string
  default = "0357dc0884034c2bf3bf"
}

variable "db_username" {
  type    = string
  default = "cursuslmsadmin"
}

variable "domain_name" {
  type    = string
  default = "cursus-aws.didheemose.dev"
}

variable "environment" {
  description = "The deployment environment (development or production)"
  type        = string
  default     = "production"
}

variable "cursus_public_subnets" {
  type = map(object({
    cidr_block        = string
    availability_zone = string
  }))
  default = {
    "subnet_a" = {
      cidr_block = "10.0.1.0/24", availability_zone = "eu-west-1a"
    }
    "subnet_b" = {
      cidr_block = "10.0.2.0/24", availability_zone = "eu-west-1b"
    }
  }
}

variable "cursus_private_subnets" {
  type = map(object({
    cidr_block        = string
    availability_zone = string
  }))
  default = {
    "subnet_a" = {
      cidr_block = "10.0.11.0/24", availability_zone = "eu-west-1a"
    }
    "subnet_b" = {
      cidr_block = "10.0.12.0/24", availability_zone = "eu-west-1b"
    }
  }
}