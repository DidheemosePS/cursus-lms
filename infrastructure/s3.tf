resource "random_id" "suffix" {
  byte_length = 4
}

resource "aws_s3_bucket" "cursus_bucket" {
  bucket = "${var.project_name}-${random_id.suffix.hex}-bucket"

  force_destroy = local.bucket_force_destroy

  tags = {
    Name        = "${var.project_name}-${random_id.suffix.hex}-bucket"
    Environment = "production"
  }
}