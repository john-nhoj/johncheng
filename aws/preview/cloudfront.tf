# Cloudfront
resource "aws_cloudfront_origin_access_identity" "this" {
  comment = "Origin Access Identity used to access S3 for ${var.site_domain}"
}

resource "aws_cloudfront_distribution" "this" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = var.default_root_object
  aliases             = [var.site_domain]
  price_class         = var.cf_price_class
  comment             = "${var.comment_prefix}${var.site_domain}"
  tags                = var.tags

  # Define the "upstream" for the CloudFront distribution
  origin {
    domain_name = local.url_hostname
    origin_id   = "default"
    origin_path = local.url_path == "" ? "" : "/${local.url_path}"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "${local.url_protocol}-only"
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }

    custom_header {
      name  = var.origin_custom_header_name
      value = var.origin_custom_header_value
    }
  }

  # Define how to serve the content to clients
  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "default"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    min_ttl     = var.min_ttl
    default_ttl = var.default_ttl
    max_ttl     = var.max_ttl

    forwarded_values {
      query_string = true

      cookies {
        forward = "all"
      }
    }

    # Note: This will make the Lambda undeletable, as long as this distribution/association exists
    # https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-edge-delete-replicas.html
    lambda_function_association {
      event_type = "viewer-request" # one of [ viewer-request, origin-request, viewer-response, origin-response ]
      lambda_arn = "${aws_lambda_function.viewer_request.arn}:${aws_lambda_function.viewer_request.version}"
    }

    # Note: This will make the Lambda undeletable, as long as this distribution/association exists
    # https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-edge-delete-replicas.html
    lambda_function_association {
      event_type = "viewer-response" # one of [ viewer-request, origin-request, viewer-response, origin-response ]
      lambda_arn = "${aws_lambda_function.viewer_response.arn}:${aws_lambda_function.viewer_response.version}"
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }


  viewer_certificate {
    acm_certificate_arn      = module.acm.this_acm_certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.1_2016"
  }

  # By default, cloudfront caches error for five minutes. There can be situation when a developer has accidentally broken the website and you would not want to wait for five minutes for the error response to be cached.
  # https://docs.aws.amazon.com/AmazonS3/latest/dev/CustomErrorDocSupport.html
  custom_error_response {
    error_code            = 400
    error_caching_min_ttl = var.error_ttl
  }

  custom_error_response {
    error_code            = 403
    error_caching_min_ttl = var.error_ttl
  }

  custom_error_response {
    error_code            = 404
    error_caching_min_ttl = var.error_ttl
  }

  custom_error_response {
    error_code            = 405
    error_caching_min_ttl = var.error_ttl
  }
}
