resource "aws_ecr_repository" "cursus_app_repo" {
  name                 = "cursus-app-repo"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

output "repository_url" {
  value = aws_ecr_repository.cursus_app_repo.repository_url
}