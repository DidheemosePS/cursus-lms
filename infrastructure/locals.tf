locals {
  is_production = var.environment == "production"

  bucket_force_destroy = local.is_production ? false : true

  enable_deletion_protection = local.is_production ? true : false
}