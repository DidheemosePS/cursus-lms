provider "aws" {
    region = "eu-west-1"
    profile = "TerraformUser"

    # This makes it easy to find all Cursus resources in the AWS console
    default_tags {
        tags = {
            Project     = "cursus-lms"
            Environment = var.environment
            ManagedBy   = "terraform"
        }
    }
}

terraform {
  backend "s3" {
    bucket         = "cursus-terraform-state"
    key            = "cursus-lms/terraform.tfstate"
    region         = "eu-west-1"
    use_lockfile = true
    profile = "TerraformUser"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
