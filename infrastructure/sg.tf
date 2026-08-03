resource "aws_security_group" "cursus_vpce_sg" {
  name   = "${var.app_name}_vpce_sg"
  vpc_id = aws_vpc.cursus_vpc.id
  tags   = { Name = "${var.app_name}_vpce_sg" }
}

resource "aws_vpc_security_group_ingress_rule" "cursus_vpce_in" {
  description                  = "Allow HTTPS from app tasks"
  security_group_id            = aws_security_group.cursus_vpce_sg.id
  referenced_security_group_id = aws_security_group.cursus_web_sg.id
  from_port                    = 443
  to_port                      = 443
  ip_protocol                  = "tcp"
}

resource "aws_security_group" "cursus_alb_sg" {
  name        = "${var.app_name}_alb_sg"
  description = "Allow web requests from anyone on the global internet"
  vpc_id      = aws_vpc.cursus_vpc.id

  tags = {
    Name = "${var.app_name}_alb_sg"
  }
}

resource "aws_vpc_security_group_ingress_rule" "cursus_alb_sg_in_http" {
  description       = "Allow public HTTP traffic"
  security_group_id = aws_security_group.cursus_alb_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 80
  ip_protocol       = "tcp"
  to_port           = 80
}

resource "aws_vpc_security_group_ingress_rule" "cursus_alb_sg_in_https" {
  description       = "Allow public HTTPS traffic"
  security_group_id = aws_security_group.cursus_alb_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 443
  ip_protocol       = "tcp"
  to_port           = 443
}

resource "aws_vpc_security_group_egress_rule" "cursus_alb_sg_out" {
  description                  = "Forward traffic to App Containers"
  security_group_id            = aws_security_group.cursus_alb_sg.id
  referenced_security_group_id = aws_security_group.cursus_web_sg.id
  from_port                    = 3000
  to_port                      = 3000
  ip_protocol                  = "tcp"
}

resource "aws_security_group" "cursus_web_sg" {
  name        = "${var.app_name}_web_sg"
  description = "Allow only the trusted traffic that comes directly from ALBs security group"
  vpc_id      = aws_vpc.cursus_vpc.id

  tags = {
    Name = "${var.app_name}_web_sg"
  }
}

# Web

resource "aws_vpc_security_group_ingress_rule" "cursus_web_sg_in" {
  description                  = "Allow inbound traffic from ALB"
  security_group_id            = aws_security_group.cursus_web_sg.id
  referenced_security_group_id = aws_security_group.cursus_alb_sg.id
  from_port                    = 3000
  to_port                      = 3000
  ip_protocol                  = "tcp"
}

resource "aws_vpc_security_group_egress_rule" "cursus_web_sg_out" {
  description                  = "Allow DB outbound traffic to RDS Proxy"
  security_group_id            = aws_security_group.cursus_proxy_sg.id
  referenced_security_group_id = aws_security_group.cursus_proxy_sg.id
  from_port                    = 5432
  to_port                      = 5432
  ip_protocol                  = "tcp"
}

resource "aws_vpc_security_group_egress_rule" "cursus_web_sg_out_https" {
  description       = "Allow HTTPS egress (AWS APIs, endpoints, ECR, secrets)"
  security_group_id = aws_security_group.cursus_web_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 443
  to_port           = 443
  ip_protocol       = "tcp"
}

# RDS Proxy

resource "aws_security_group" "cursus_proxy_sg" {
  name        = "${var.app_name}-proxy-sg"
  description = "Security group for RDS Proxy"
  vpc_id      = aws_vpc.cursus_vpc.id
  tags = {
    Name = "${var.app_name}_proxy_sg"
  }
}

resource "aws_vpc_security_group_ingress_rule" "cursus_proxy_sg_in" {
  description                  = "Allow inbound traffic from Application SG"
  security_group_id            = aws_security_group.cursus_proxy_sg.id
  referenced_security_group_id = aws_security_group.cursus_web_sg.id
  from_port                    = 5432
  to_port                      = 5432
  ip_protocol                  = "tcp"
}

resource "aws_vpc_security_group_ingress_rule" "cursus_proxy_sg_out" {
  description                  = "Allow Proxy to forward traffic to RDS Database"
  security_group_id            = aws_security_group.cursus_proxy_sg.id
  referenced_security_group_id = aws_security_group.cursus_db_sg.id
  from_port                    = 5432
  to_port                      = 5432
  ip_protocol                  = "tcp"
}

# DB

resource "aws_security_group" "cursus_db_sg" {
  name        = "${var.app_name}_db_sg"
  description = "Allow only the trusted traffic that comes directly from Webs security group"
  vpc_id      = aws_vpc.cursus_vpc.id

  tags = {
    Name = "${var.app_name}_db_sg"
  }
}

resource "aws_vpc_security_group_ingress_rule" "cursus_db_sg_in" {
  description                  = "Allow inbound traffic ONLY from RDS Proxy"
  security_group_id            = aws_security_group.cursus_db_sg.id
  referenced_security_group_id = aws_security_group.cursus_proxy_sg.id
  from_port                    = 5432
  to_port                      = 5432
  ip_protocol                  = "tcp"
}