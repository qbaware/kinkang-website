---
title: Customer prerequisites
description: What you need to prepare before connecting your Kafka cluster to Kinkang.
---

# Customer prerequisites

Before Kinkang can be provisioned for your cluster, the following must be in place.

## 1. Metrics endpoint

Cruise Control needs access to Kafka metrics. You must provide one of:

**Option A — Cruise Control metrics reporter topic (recommended for self-managed)**

Configure the [Cruise Control metrics reporter](https://github.com/linkedin/cruise-control#metrics-provider) on each Kafka broker. It publishes metrics to a dedicated Kafka topic (`__CruiseControlMetrics` by default) that Kinkang reads directly. No additional infrastructure required.

```properties
# Add to each broker's server.properties
metric.reporters=com.linkedin.kafka.cruisecontrol.metricsreporter.CruiseControlMetricsReporter
cruise.control.metrics.reporter.bootstrap.servers=<your-bootstrap>:9093
cruise.control.metrics.reporter.security.protocol=SASL_SSL
# ... additional SASL config as appropriate
```

**Option B — Prometheus endpoint (required for AWS MSK, optional for self-managed)**

For AWS MSK, enable [open monitoring](https://docs.aws.amazon.com/msk/latest/developerguide/open-monitoring.html) on your cluster. This exposes a Prometheus-compatible `/metrics` endpoint on each broker at port `11001` (JMX) and `11002` (Node exporter).

For self-managed, expose a Prometheus endpoint accessible from Kinkang's network.

## 2. Network reachability

Kinkang must be able to reach your Kafka brokers:

- **AWS MSK** — enable MSK multi-VPC private connectivity (PrivateLink). See [Connect to AWS MSK](/docs/guides/connect-aws-msk).
- **Self-managed (cloud VPC)** — brokers must be reachable over SASL_SSL. VPN can be arranged if direct connectivity is not possible — contact us.
- **Self-managed (on-prem)** — VPN is required; discuss with the Kinkang team before onboarding.

## 3. TLS certificates (if using mTLS or SASL EXTERNAL)

Certificates must be in **PEM format**:

- **Private key** — PKCS#8 format (begins with `-----BEGIN PRIVATE KEY-----`)
- **Certificate** — X.509 format (begins with `-----BEGIN CERTIFICATE-----`)
- **CA certificate** — the CA that signed the broker certificates

```bash
# Verify your key is PKCS#8
openssl pkey -in client.key -noout -text

# Verify your certificate
openssl x509 -in client.crt -noout -subject -issuer
```

If your key is in PKCS#1 format (`-----BEGIN RSA PRIVATE KEY-----`), convert it:

```bash
openssl pkcs8 -topk8 -nocrypt -in client-pkcs1.key -out client-pkcs8.key
```

> **SASL EXTERNAL and ACLs:** When using `SASL EXTERNAL`, the CN (Common Name) from your client certificate is used as the Kafka principal. Ensure the CN matches the principal you add to Kafka ACLs.

## Summary checklist

- [ ] Metrics: CC metrics reporter topic configured **or** Prometheus endpoint reachable
- [ ] Network: PrivateLink / direct SASL_SSL / VPN in place
- [ ] Certificates (if mTLS/EXTERNAL): PEM format, PKCS#8 key, X.509 cert, CA cert
- [ ] ACLs (if SASL EXTERNAL): CN from client cert added as Kafka principal
