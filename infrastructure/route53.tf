# Route 53
# The hosted zone is created manually in the AWS console — not managed here
# Reason: you need the nameservers from Route 53 before you can update Namecheap
# Once Namecheap points to Route 53, Terraform manages all records inside the zone

# Data source — existing hosted zone
# Reads the hosted zone you created manually
# This is how Terraform references existing AWS resources it didn't create

data "aws_route53_zone" "main" {
  zone_id = var.route53_zone_id
}

# A Record — domain → ALB
# Maps your domain to the ALB
# Alias record is used instead of a regular A record because:
# - ALB IPs can change — Alias always resolves to the current IPs
# - Alias records are free — regular A records cost per query
# - AWS automatically handles health checking of the ALB

resource "aws_route53_record" "app" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = var.domain_name     # e.g. cursus.yourdomain.com
  type    = "A"

  alias {
    name                   = aws_lb.main.dns_name        # ALB DNS name
    zone_id                = aws_lb.main.zone_id         # ALB hosted zone ID — not your zone
    evaluate_target_health = true                        # Route 53 checks ALB health
  }
}