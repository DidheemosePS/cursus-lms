# S3 Artifact Bucket
# Temporary storage between pipeline stages
# Stage 1 puts source code here, Stage 2 reads it and puts imagedefinitions.json

resource "aws_s3_bucket" "pipeline_artifacts" {
  bucket        = "${var.app_name}-pipeline-artifacts"
  force_destroy = true    # Allow bucket deletion even if it has objects

  tags = {
    Name = "${var.app_name}-pipeline-artifacts"
  }
}

# Block all public access — pipeline artifacts are internal only
resource "aws_s3_bucket_public_access_block" "pipeline_artifacts" {
  bucket = aws_s3_bucket.pipeline_artifacts.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Versioning — keeps a history of artifacts for debugging
resource "aws_s3_bucket_versioning" "pipeline_artifacts" {
  bucket = aws_s3_bucket.pipeline_artifacts.id

  versioning_configuration {
    status = "Enabled"
  }
}

# CodeBuild Project
# Builds the Docker image and pushes it to ECR
# Reads instructions from buildspec.yml in your repository

resource "aws_codebuild_project" "app" {
  name          = "${var.app_name}-build"
  description   = "Builds Docker image for Cursus LMS"
  service_role  = aws_iam_role.codebuild.arn
  build_timeout = 20    # Minutes — pnpm install + docker build takes ~10 mins

  artifacts {
    type = "CODEPIPELINE"    # Gets source from CodePipeline, outputs back to it
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"    # 3GB RAM, 2 vCPUs — enough for Docker build
    image                       = "aws/codebuild/standard:7.0"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"
    privileged_mode             = true    # Required to run Docker commands inside CodeBuild

    # Pass ECR repo URL to buildspec.yml as environment variable
    environment_variable {
      name  = "ECR_REPOSITORY_URL"
      value = data.aws_ecr_repository.app.repository_url
    }

    environment_variable {
      name  = "AWS_DEFAULT_REGION"
      value = var.aws_region
    }

    environment_variable {
      name  = "CONTAINER_NAME"
      value = "${var.app_name}-container"
    }
  }

  source {
    type      = "CODEPIPELINE"
    buildspec = "buildspec.yml"    # File in your repository root
  }

  logs_config {
    cloudwatch_logs {
      group_name  = "/codebuild/${var.app_name}"
      stream_name = "build-log"
    }
  }

  tags = {
    Name = "${var.app_name}-codebuild"
  }
}

# CodePipeline
# Orchestrates the three stages: Source → Build → Deploy

resource "aws_codepipeline" "app" {
  name     = "${var.app_name}-pipeline"
  role_arn = aws_iam_role.codepipeline.arn

  artifact_store {
    location = aws_s3_bucket.pipeline_artifacts.bucket
    type     = "S3"
  }

  # Stage 1: Source
  # Watches GitHub for pushes to the specified branch
  # Downloads source code and stores in S3 artifact bucket

  stage {
    name = "Source"

    action {
      name             = "Source"
      category         = "Source"
      owner            = "AWS"
      provider         = "CodeStarSourceConnection"
      version          = "1"
      output_artifacts = ["source_output"]

      configuration = {
        ConnectionArn    = var.github_connection_arn    # Created manually in AWS console
        FullRepositoryId = var.github_repo              # e.g. yourusername/cursus-lms
        BranchName       = var.github_branch            # main
        DetectChanges    = true                         # Auto-trigger on push
      }
    }
  }

  # Stage 2: Build
  # Runs buildspec.yml — builds Docker image, pushes to ECR
  # Outputs imagedefinitions.json for the deploy stage

  stage {
    name = "Build"

    action {
      name             = "Build"
      category         = "Build"
      owner            = "AWS"
      provider         = "CodeBuild"
      version          = "1"
      input_artifacts  = ["source_output"]
      output_artifacts = ["build_output"]

      configuration = {
        ProjectName = aws_codebuild_project.app.name
      }
    }
  }

  # Stage 3: Deploy
  # Reads imagedefinitions.json from build output
  # Updates ECS service with the new Docker image
  # ECS performs rolling replacement — zero downtime

  stage {
    name = "Deploy"

    action {
      name            = "Deploy"
      category        = "Deploy"
      owner           = "AWS"
      provider        = "ECS"
      version         = "1"
      input_artifacts = ["build_output"]

      configuration = {
        ClusterName = aws_ecs_cluster.main.name
        ServiceName = aws_ecs_service.app.name
        FileName    = "imagedefinitions.json"    # Produced by buildspec.yml
      }
    }
  }

  tags = {
    Name = "${var.app_name}-pipeline"
  }
}