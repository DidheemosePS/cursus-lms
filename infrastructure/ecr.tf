resource "aws_ecr_repository" "cursus_ecr_repo" {
  name                 = "${var.app_name}-ecr-repo"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}