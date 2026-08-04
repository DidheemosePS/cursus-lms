resource "aws_ecr_repository" "cursus_ecr_repo" {
  name                 = "${var.project_name}-ecr-repo"
  image_tag_mutability = "MUTABLE"
  force_delete         = local.ecr_repo_force_delete

  image_scanning_configuration {
    scan_on_push = true
  }
}