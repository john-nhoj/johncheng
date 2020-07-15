variable "region" {
  description = "The primary AWS region where all the resources will be created. See https://docs.aws.amazon.com/general/latest/gr/rande.html"
}

variable "site_domain" {
  description = "The primary domain name of the website"
}

variable "origin_url" {
  description = "Base URL for proxy upstream site (e.g. `\"https://example.com/\"`)"
}

variable "bucket_name" {
  description = "The name of the S3 bucket wich would host the static files"
}

# Variables with default

variable "tags" {
  description = "AWS Tags to add to all resources created (where possible); see https://aws.amazon.com/answers/account-management/aws-tagging-strategies/"
  type        = map
  default     = {}
}

variable "cf_price_class" {
  description = "TThe price class for this distribution. One of PriceClass_All, PriceClass_200, PriceClass_100"
  default     = "PriceClass_100"
}

variable "default_root_object" {
  description = "The object to return when the root URL is requested"
  default     = "index.html"
}

variable "default_ttl" {
  description = "The default amount of time (in secs) that an object is cached in cloudfront in the absence of Cache-Control max-age or Expires header."
  default     = "86400"
}

variable "max_ttl" {
  description = "The maximum amount of time (in secs) that an object is cached in cloudfront before cloudfront forwards another request ot origin to determine if the object has been updated."
  default     = "31536000" # 365 days
}

variable "min_ttl" {
  description = "The minimum amount of time (in secs) that an object is cached in cloudfront before cloudfront forwards another request ot origin to determine if the object has been updated."
  default     = "0"
}

variable "error_ttl" {
  description = "The minimum amount of time (in secs) that cloudfront caches an HTTP error code."
  default     = "30"
}

variable "override_response_status" {
  description = "When this and the other `override_response_*` variables are non-empty, skip sending the request to the origin altogether, and instead respond as instructed here"
  default     = ""
}

variable "override_response_status_description" {
  description = "Same as `override_response_status`"
  default     = ""
}

variable "override_response_body" {
  description = "Same as `override_response_status`"
  default     = ""
}

variable "basic_auth_username" {
  description = "When non-empty, require this username with HTTP Basic Auth"
  default     = "admin"
}

variable "basic_auth_password" {
  description = "When non-empty, require this password with HTTP Basic Auth"
  default     = "secret"
}

variable "basic_auth_realm" {
  description = "When using HTTP Basic Auth, this will be displayed by the browser in the auth prompt"
  default     = "Authentication Required"
}

variable "basic_auth_body" {
  description = "When using HTTP Basic Auth, and authentication has failed, this will be displayed by the browser as the page content"
  default     = "Unauthorized"
}

variable "add_response_headers" {
  description = "Map of HTTP headers (if any) to add to outgoing responses before sending them to clients"
  type        = map

  default = {
    "Strict-Transport-Security" = "max-age=31557600; preload" # i.e. 1 year (in seconds)
  }
}

variable "lambda_logging_enabled" {
  description = "When true, writes information about incoming requests to the Lambda function's CloudWatch group"
  default     = true
}

variable "name_prefix" {
  description = "Name prefix to use for objects that need to be created (only lowercase alphanumeric characters and hyphens allowed, for S3 bucket name compatibility)"
  default     = "aws-reverse-proxy---"
}

variable "comment_prefix" {
  description = "This will be included in comments for resources that are created"
  default     = "Reverse proxy: "
}

variable "origin_custom_header_name" {
  description = "Name of a custom header to send to the origin; this can be used to convey an authentication header to the origin, for example"

  # Unfortunately, since Terraform doesn't allow conditional inline blocks (yet), we need to ALWAYS have SOME header here.
  # This default one will be sent if a custom one isn't defined, but it's assumed to be harmless.
  default = "X-Custom-Origin-Header"
}

variable "origin_custom_header_value" {
  description = "Value of a custom header to send to the origin; see `origin_custom_header_name`"
  default     = ""
}

locals {
  prefix_with_domain = "${var.name_prefix}${replace("${var.site_domain}", "/[^a-z0-9-]+/", "-")}" # only lowercase alphanumeric characters and hyphens are allowed in S3 bucket names
}

# Because CloudFront origins expect the URL to be provided as components, we need to do a bit of URL "parsing"
locals {
  url_protocol = "${replace("${var.origin_url}", "/^(?:(\\w+):\\/\\/).*/", "$1")}"
  url_hostname = "${replace("${var.origin_url}", "/^(?:\\w+:\\/\\/)?([^/]+).*/", "$1")}"
  url_path     = "${replace("${var.origin_url}", "/^(?:\\w+:\\/\\/)?[^/]+(?:\\/(.*)|$)/", "$1")}"
}
