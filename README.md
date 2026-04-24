<div align="center">

  <img src="<!-- YOUR LOGO SCREENSHOT -->" alt="Cursus Logo" width="60" />

  # Cursus

  **Multi-Organisation Learning Management System**

  A production-grade LMS built with Next.js, PostgreSQL, and deployed on AWS with a full CI/CD pipeline.

  [![Live Demo](https://img.shields.io/badge/Live-cursus.didheemose.dev-c9934a?style=for-the-badge&logo=vercel&logoColor=white)](https://cursus.didheemose.dev)
  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
  [![AWS](https://img.shields.io/badge/AWS-ECS%20%7C%20RDS%20%7C%20ECR-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)](https://aws.amazon.com)
  [![Terraform](https://img.shields.io/badge/Terraform-IaC-7B42BC?style=for-the-badge&logo=terraform&logoColor=white)](https://terraform.io)

  <br />

  [Live Demo](https://cursus.didheemose.dev) · [View Code](https://github.com/DidheemosePS/cursus-lms) · [Connect on LinkedIn](https://linkedin.com/in/didheemose)

</div>

---

## Overview

Cursus is a fully functional, multi-tenant Learning Management System built to demonstrate production-level full-stack engineering. Each organisation gets a completely isolated environment — courses, users, and data are scoped per tenant.

The project covers the full lifecycle from product design to cloud deployment — role-based auth, real-time messaging, file submissions, CI/CD pipelines, and infrastructure as code.

<!-- SCREENSHOT: Landing page -->
![Landing Page](<!-- YOUR SCREENSHOT -->)

---

## Features

### Three distinct role experiences

**Admin** — full platform control. Invite instructors and learners, create and publish courses, monitor system alerts, view enrollment analytics.

**Instructor** — course delivery. Manage assigned modules, review and give feedback on submissions, track learner progress, message learners in real time.

**Learner** — structured learning. Progress through course modules in order, submit assignments, view instructor feedback, chat with instructors.

### Platform capabilities

- **Multi-tenant architecture** — organisations are fully isolated at the database level
- **Course management** — drag-to-reorder modules, due dates, status publishing flow
- **Submission system** — file uploads per module, attempt history, instructor review and feedback
- **Real-time messaging** — direct and group chat powered by Pusher with unread badges
- **Progress tracking** — completion rates, late submission detection, module-level state machine
- **Intercepting routes** — modal login overlay using Next.js parallel routes

---

## Screenshots

<!-- SCREENSHOT: Admin dashboard -->
![Admin Dashboard](<!-- YOUR SCREENSHOT -->)

<!-- SCREENSHOT: Course detail page -->
![Course Detail](<!-- YOUR SCREENSHOT -->)

<!-- SCREENSHOT: Learner my courses -->
![My Courses](<!-- YOUR SCREENSHOT -->)

<!-- SCREENSHOT: Submission review -->
![Submission Review](<!-- YOUR SCREENSHOT -->)

<!-- SCREENSHOT: Real-time chat -->
![Chat](<!-- YOUR SCREENSHOT -->)

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 15 (App Router) | Framework — server components, parallel routes, intercepting routes |
| TypeScript | Type safety across the full stack |
| Tailwind CSS | Utility-first styling |
| Pusher JS | Real-time chat client |

### Backend
| Technology | Purpose |
|---|---|
| Next.js Server Actions | Mutations and form handling |
| Next.js API Routes | File uploads (bypasses server action size limit) |
| Prisma ORM | Type-safe database access |
| PostgreSQL 16 | Primary database |
| iron-session | Cookie-based session management |
| Pusher | Real-time WebSocket events |
| AWS S3 | File storage for submissions, avatars, course covers |

### Infrastructure & DevOps
| Technology | Purpose |
|---|---|
| Docker | Containerisation — multi-stage build, Alpine Linux |
| AWS ECS Fargate | Container orchestration — serverless, no EC2 to manage |
| AWS RDS PostgreSQL | Managed database — automated backups, encryption at rest |
| AWS ECR | Private Docker image registry |
| AWS ALB | Load balancer — SSL termination, HTTP→HTTPS redirect |
| AWS ACM | Free SSL certificates with auto-renewal |
| AWS Route 53 | DNS management |
| AWS SSM Parameter Store | Secrets management — injected at runtime, never in task definitions |
| AWS CodePipeline | CI/CD orchestration |
| AWS CodeBuild | Docker image build and push to ECR |
| Terraform | Infrastructure as Code — all AWS resources version controlled |

---

## Architecture

```
                        ┌─────────────────────────────────────┐
                        │            AWS eu-west-1             │
                        │                                      │
  User ──── HTTPS ───► ALB (Public Subnet)                    │
                        │          │                           │
                        │          ▼                           │
                        │   ECS Fargate Task (Private Subnet)  │
                        │   Next.js App — Port 3000            │
                        │          │                           │
                        │    ┌─────┴──────┐                   │
                        │    ▼            ▼                    │
                        │  RDS          S3 Bucket              │
                        │  PostgreSQL   (uploads)              │
                        │  (Private)                           │
                        └─────────────────────────────────────┘

CI/CD Pipeline
──────────────
GitHub (main) → CodePipeline → CodeBuild → ECR → ECS Rolling Deploy
```

### VPC Layout
- **Public subnets** — ALB only (eu-west-1a, eu-west-1b)
- **Private subnets** — ECS tasks + RDS (eu-west-1a, eu-west-1b)
- **NAT Gateway** — allows ECS outbound internet (Pusher, S3) without inbound exposure
- **Security groups** — ALB → ECS → RDS, least privilege per layer

### Secrets Management
All secrets stored in AWS SSM Parameter Store as `SecureString` (KMS encrypted). ECS task definition references parameter ARNs — actual values never appear in task definitions or Terraform state.

---

## CI/CD Pipeline

Every push to `main` triggers an automated deployment:

```
1. CodePipeline detects GitHub push
2. Source stage — downloads code, stores in S3 artifact bucket
3. Build stage — CodeBuild runs buildspec.yml:
     - Authenticates with ECR
     - docker build --platform linux/amd64
     - Tags image with Git commit SHA
     - Pushes to ECR
     - Generates imagedefinitions.json
4. Deploy stage — ECS rolling update
     - New task starts with new image
     - Health checks pass
     - Old task drains and stops
     - Zero downtime
```

---

## Database Schema

Core models and their relationships:

```
Organization
  ├── Users (admin | instructor | learner)
  ├── Courses
  │     ├── Modules
  │     │     └── Submissions ──── Feedback
  │     ├── Enrollments
  │     └── CourseInstructors
  └── Conversations
        ├── ConversationMembers
        └── Messages
```

---

## Local Development

### Prerequisites
- Node.js 20+
- pnpm
- Docker (for local PostgreSQL)
- AWS CLI (optional, for S3)

### Setup

```bash
# Clone the repository
git clone https://github.com/DidheemosePS/cursus-lms
cd cursus-lms

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
# Fill in your values

# Start local PostgreSQL
docker run -d \
  --name cursus-db \
  -e POSTGRES_USER=cursus \
  -e POSTGRES_PASSWORD=cursus \
  -e POSTGRES_DB=cursus \
  -p 5432:5432 \
  postgres:16-alpine

# Run migrations
pnpm exec prisma migrate dev

# Start development server
pnpm dev
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/cursus?schema=public"

# Session
SESSION_SECRET="your-secret-min-32-chars"

# Pusher
PUSHER_APP_ID="your-pusher-app-id"
NEXT_PUBLIC_PUSHER_KEY="your-pusher-key"
PUSHER_SECRET="your-pusher-secret"

# AWS S3
AWS_BUCKET_NAME="your-bucket-name"
AWS_REGION="eu-west-1"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## Infrastructure Setup

All AWS infrastructure is managed with Terraform.

```bash
cd infrastructure/terraform

# Initialise
terraform init

# Review changes
terraform plan -out=tfplan

# Apply
terraform apply tfplan
```

See [`infrastructure/terraform/`](./infrastructure/terraform/) for full configuration.

### Manual prerequisites before first apply
1. Create Route 53 hosted zone — copy nameservers to your DNS provider
2. Create AWS CodeStar connection to GitHub — copy ARN to `terraform.tfvars`
3. Fill in `terraform.tfvars` from the template

---

## Project Structure

```
cursus-lms/
├── app/
│   ├── admin/          # Admin dashboard — courses, learners, instructors
│   ├── instructor/     # Instructor portal — submissions, learners, chat
│   ├── learner/        # Learner portal — courses, modules, chat
│   ├── login/          # Auth pages
│   ├── @modal/         # Intercepting route — login modal
│   └── api/            # API routes — auth, file uploads
├── actions/            # Server actions — mutations
├── dal/                # Data Access Layer — all Prisma queries
├── components/         # Shared UI components
├── lib/                # Auth, S3, Pusher, validation
├── prisma/             # Schema and migrations
├── infrastructure/
│   └── terraform/      # All AWS infrastructure as code
├── Dockerfile          # Multi-stage production build
└── buildspec.yml       # CodeBuild CI/CD instructions
```

---

## Author

**Didheemose Sebastian**

Full-stack developer focused on building production-grade applications with modern tooling and proper cloud infrastructure.

[![Portfolio](https://img.shields.io/badge/Portfolio-didheemose.dev-c9934a?style=for-the-badge)](https://didheemose.dev)
[![GitHub](https://img.shields.io/badge/GitHub-DidheemosePS-181717?style=for-the-badge&logo=github)](https://github.com/DidheemosePS)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-didheemose-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/didheemose)

---

<div align="center">
  <sub>Built with care from Dublin, Ireland 🇮🇪</sub>
</div>
