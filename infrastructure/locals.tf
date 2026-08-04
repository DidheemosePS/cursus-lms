locals {
  is_prod = var.environment == "prod"

  bucket_force_destroy = local.is_prod ? false : true

  enable_deletion_protection = local.is_prod ? true : false

  ecr_repo_force_delete = local.is_prod ? false : true
}