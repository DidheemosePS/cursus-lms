resource "aws_route53_zone" "primary" {
  name = var.domain_name

  tags = {
    Name = "${var.domain_name}-${var.environment}-hosted-zone"
  }
}

resource "aws_route53_record" "route53_record" {
  for_each = {
    for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = aws_route53_zone.primary.zone_id
}

resource "aws_route53_record" "alb_alias" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_lb.cursus_lb.dns_name
    zone_id                = aws_lb.cursus_lb.zone_id
    evaluate_target_health = true
  }
}