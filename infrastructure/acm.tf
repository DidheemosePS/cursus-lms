# ACM Certificate
# Free SSL certificate for your domain
# AWS handles renewal automatically — no manual intervention needed

resource "aws_acm_certificate" "main" {
  domain_name       = var.domain_name             # e.g. cursus.yourdomain.com
  validation_method = "DNS"                        # Automated DNS validation

  # Allow certificate to be replaced without destroying the old one first
  # This prevents downtime when renewing or updating certificates
  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name = "${var.app_name}-certificate"
  }
}

# DNS Validation Record
# ACM requires a CNAME record to prove you own the domain
# Terraform adds this to Route 53 automatically
# for_each handles the case where ACM returns multiple validation records

resource "aws_route53_record" "acm_validation" {
  for_each = {
    for dvo in aws_acm_certificate.main.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  }

  zone_id = var.route53_zone_id
  name    = each.value.name
  type    = each.value.type
  records = [each.value.record]
  ttl     = 60
}

# Certificate Validation
# Waits until ACM confirms the certificate is issued
# Terraform will block here until validation completes — can take 2-5 minutes
# The ALB listener references this resource so it won't be created
# until the certificate is fully validated and ready

resource "aws_acm_certificate_validation" "main" {
  certificate_arn         = aws_acm_certificate.main.arn
  validation_record_fqdns = [for record in aws_route53_record.acm_validation : record.fqdn]
}