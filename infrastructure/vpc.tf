# VPC

resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr        # 10.0.0.0/16 — 65,536 IP addresses
  enable_dns_support   = true                # Required for RDS and ECS service discovery
  enable_dns_hostnames = true                # Required for RDS endpoint resolution

  tags = {
    Name = "${var.app_name}-vpc"
  }
}

# Internet Gateway
# The door between the VPC and the public internet
# Without this, nothing in the VPC can reach or be reached from the internet

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.app_name}-igw"
  }
}

# Public Subnets
# The ALB lives here — it needs to be reachable from the internet
# count = 2 creates one subnet per availability zone

resource "aws_subnet" "public" {
  count             = length(var.public_subnet_cidrs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.public_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]

  # Instances launched in public subnets get a public IP automatically
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.app_name}-public-subnet-${count.index + 1}"
  }
}

# Private Subnets
# ECS tasks and RDS live here — never directly reachable from the internet

resource "aws_subnet" "private" {
  count             = length(var.private_subnet_cidrs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = var.availability_zones[count.index]

  # No public IPs — private subnet resources are not directly reachable
  map_public_ip_on_launch = false

  tags = {
    Name = "${var.app_name}-private-subnet-${count.index + 1}"
  }
}

# Elastic IP for NAT Gateway
# NAT Gateway needs a fixed public IP address

resource "aws_eip" "nat" {
  domain = "vpc"

  tags = {
    Name = "${var.app_name}-nat-eip"
  }
}

# NAT Gateway
# Sits in the first public subnet
# Allows ECS tasks in private subnets to make outbound internet requests
# (S3 uploads, Pusher connections) without being reachable inbound

resource "aws_nat_gateway" "main" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public[0].id   # Always in a public subnet

  tags = {
    Name = "${var.app_name}-nat"
  }

  # IGW must exist before NAT gateway can be created
  depends_on = [aws_internet_gateway.main]
}

# Public Route Table
# Routes all internet-bound traffic (0.0.0.0/0) through the IGW

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "${var.app_name}-public-rt"
  }
}

# Associate public route table with each public subnet
resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# Private Route Table
# Routes outbound internet traffic through the NAT Gateway
# Inbound traffic from the internet cannot reach private subnets

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main.id
  }

  tags = {
    Name = "${var.app_name}-private-rt"
  }
}

# Associate private route table with each private subnet
resource "aws_route_table_association" "private" {
  count          = length(aws_subnet.private)
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}