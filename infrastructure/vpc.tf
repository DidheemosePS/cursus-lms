provider "aws" {
  region = var.aws_region
}

resource "aws_vpc" "cursus_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "${var.app_name}_vpc"
  }
}

resource "aws_vpc_endpoint" "s3" {
  vpc_id            = aws_vpc.cursus_vpc.id
  service_name      = "com.amazonaws.${var.aws_region}.s3"
  vpc_endpoint_type = "Gateway"
  route_table_ids   = [for rt in aws_route_table.cursus_private_rt : rt.id]

  tags = {
    Name = "${var.app_name}-s3-endpoint"
  }
}

resource "aws_vpc_endpoint" "secretsmanager" {
  vpc_id              = aws_vpc.cursus_vpc.id
  service_name        = "com.amazonaws.${var.aws_region}.secretsmanager"
  vpc_endpoint_type   = "Interface"
  subnet_ids          = [for s in aws_subnet.cursus_private : s.id]
  security_group_ids  = [aws_security_group.cursus_vpce_sg.id]
  private_dns_enabled = true

  tags = {
    Name = "${var.app_name}-secretsmanager-endpoint"
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.cursus_vpc.id

  tags = {
    Name = "${var.app_name}_igw"
  }
}

resource "aws_subnet" "cursus_public" {
  for_each = var.cursus_public_subnets

  vpc_id            = aws_vpc.cursus_vpc.id
  cidr_block        = each.value.cidr_block
  availability_zone = each.value.availability_zone

  tags = {
    Name = "${var.app_name}_public_${each.key}"
  }
}

resource "aws_subnet" "cursus_private" {
  for_each = var.cursus_private_subnets

  vpc_id            = aws_vpc.cursus_vpc.id
  cidr_block        = each.value.cidr_block
  availability_zone = each.value.availability_zone

  tags = {
    Name = "${var.app_name}_private_${each.key}"
  }
}

resource "aws_route_table" "cursus_public_rt" {
  vpc_id = aws_vpc.cursus_vpc.id

  tags = {
    Name = "${var.app_name}_public_rt"
  }
}

resource "aws_route" "cursus_public_r" {
  route_table_id         = aws_route_table.cursus_public_rt.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.igw.id
}

resource "aws_route_table_association" "cursus_public_rta" {
  for_each = var.cursus_public_subnets

  subnet_id      = aws_subnet.cursus_public[each.key].id
  route_table_id = aws_route_table.cursus_public_rt.id
}

resource "aws_route_table" "cursus_private_rt" {
  for_each = var.cursus_private_subnets

  vpc_id = aws_vpc.cursus_vpc.id

  tags = {
    Name = "${var.app_name}_private_rt"
  }
}

resource "aws_route" "cursus_private_r" {
  for_each = var.cursus_private_subnets

  route_table_id         = aws_route_table.cursus_private_rt[each.key].id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.cursus_nat_gw[each.key].id
}

resource "aws_route_table_association" "cursus_private_rta" {
  for_each = var.cursus_private_subnets

  subnet_id      = aws_subnet.cursus_private[each.key].id
  route_table_id = aws_route_table.cursus_private_rt[each.key].id
}

resource "aws_eip" "cursus_nat_eip" {
  for_each = var.cursus_public_subnets

  domain = "vpc"

  tags = {
    Name = "${var.app_name}_nat_eip_${each.key}"
  }
}

resource "aws_nat_gateway" "cursus_nat_gw" {
  for_each = var.cursus_public_subnets

  allocation_id = aws_eip.cursus_nat_eip[each.key].id
  subnet_id     = aws_subnet.cursus_public[each.key].id

  tags = {
    Name = "${var.app_name}_nat_gw_${each.key}"
  }

  depends_on = [aws_internet_gateway.igw]
}