resource "google_dns_managed_zone" "johncheng-prod-zone" {
  name        = "johncheng-prod-zone"
  dns_name    = "johncheng.me."
  description = "DNS zone for production website johncheng.me"
  labels = {
    app = "johncheng-prod"
  }
}

resource "google_dns_record_set" "a" {
  name         = "johncheng.me."
  managed_zone = google_dns_managed_zone.johncheng-prod-zone.name
  type         = "A"
  ttl          = 300

  rrdatas = ["34.120.181.153"]
}
