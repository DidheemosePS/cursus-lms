# ECS Task Execution Role
# Used by the ECS AGENT (AWS infrastructure) — not your app code
# Needs: pull image from ECR, fetch SSM secrets, write logs to CloudWatch

resource "aws_iam_role" "ecs_task_execution" {
  name = "${var.app_name}-ecs-execution-role"

  # Trust policy — only ECS tasks can assume this role
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = { Service = "ecs-tasks.amazonaws.com" }
        Action    = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Name = "${var.app_name}-ecs-execution-role"
  }
}

# AWS managed policy — grants ECR pull and CloudWatch Logs write permissions
# This is the standard policy AWS provides for ECS task execution
resource "aws_iam_role_policy_attachment" "ecs_task_execution" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Additional policy — allows fetching SecureString parameters from SSM
# The managed policy above only covers basic SSM — we need KMS decrypt for SecureString
resource "aws_iam_role_policy" "ecs_execution_ssm" {
  name = "${var.app_name}-ecs-execution-ssm"
  role = aws_iam_role.ecs_task_execution.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssm:GetParameters",
          "ssm:GetParameter",
          "kms:Decrypt"             # Required to decrypt SecureString parameters
        ]
        Resource = [
          "arn:aws:ssm:${var.aws_region}:*:parameter/${var.app_name}/${var.environment}/*",
          "arn:aws:kms:${var.aws_region}:*:key/*"
        ]
      }
    ]
  })
}

# ECS Task Role
# Used by YOUR APPLICATION CODE running inside the container
# Needs: read and write files to S3

resource "aws_iam_role" "ecs_task" {
  name = "${var.app_name}-ecs-task-role"

  # Trust policy — only ECS tasks can assume this role
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = { Service = "ecs-tasks.amazonaws.com" }
        Action    = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Name = "${var.app_name}-ecs-task-role"
  }
}

# S3 policy — allows the app to upload and retrieve files from the uploads bucket
resource "aws_iam_role_policy" "ecs_task_s3" {
  name = "${var.app_name}-ecs-task-s3"
  role = aws_iam_role.ecs_task.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",       # Upload files
          "s3:GetObject",       # Download files
          "s3:DeleteObject",    # Delete files (used when updating submissions)
          "s3:GetObjectUrl"     # Generate presigned URLs
        ]
        # Scoped to only the uploads bucket — not all S3 buckets
        Resource = "arn:aws:s3:::${var.aws_bucket_name}/*"
      }
    ]
  })
}

# CodePipeline Role
# Used by CodePipeline to orchestrate the CI/CD pipeline
# Needs: access to S3 artifacts, CodeBuild, ECS

resource "aws_iam_role" "codepipeline" {
  name = "${var.app_name}-codepipeline-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = { Service = "codepipeline.amazonaws.com" }
        Action    = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Name = "${var.app_name}-codepipeline-role"
  }
}

resource "aws_iam_role_policy" "codepipeline" {
  name = "${var.app_name}-codepipeline-policy"
  role = aws_iam_role.codepipeline.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:GetObjectVersion",
          "s3:GetBucketVersioning",
          "s3:PutObjectAcl",
          "s3:PutObject"
        ]
        Resource = [
          aws_s3_bucket.pipeline_artifacts.arn,
          "${aws_s3_bucket.pipeline_artifacts.arn}/*"
        ]
      },
      {
        Effect   = "Allow"
        Action   = ["codebuild:BatchGetBuilds", "codebuild:StartBuild"]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "ecs:DescribeServices",
          "ecs:DescribeTaskDefinition",
          "ecs:DescribeTasks",
          "ecs:ListTasks",
          "ecs:RegisterTaskDefinition",
          "ecs:UpdateService"
        ]
        Resource = "*"
      },
      {
        # CodePipeline needs to pass roles to ECS during deployment
        Effect   = "Allow"
        Action   = "iam:PassRole"
        Resource = [
          aws_iam_role.ecs_task_execution.arn,
          aws_iam_role.ecs_task.arn
        ]
      }
    ]
  })
}

# CodeBuild Role
# Used by CodeBuild to build the Docker image and push to ECR

resource "aws_iam_role" "codebuild" {
  name = "${var.app_name}-codebuild-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = { Service = "codebuild.amazonaws.com" }
        Action    = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Name = "${var.app_name}-codebuild-role"
  }
}

resource "aws_iam_role_policy" "codebuild" {
  name = "${var.app_name}-codebuild-policy"
  role = aws_iam_role.codebuild.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        # Write build logs to CloudWatch
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "*"
      },
      {
        # Read and write pipeline artifacts from S3
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:GetObjectVersion",
          "s3:PutObject"
        ]
        Resource = [
          aws_s3_bucket.pipeline_artifacts.arn,
          "${aws_s3_bucket.pipeline_artifacts.arn}/*"
        ]
      },
      {
        # Push Docker image to ECR
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "ecr:PutImage"
        ]
        Resource = "*"
      }
    ]
  })
}