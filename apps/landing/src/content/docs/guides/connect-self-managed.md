---
title: Connect to self-managed Kafka
description: Step-by-step guide for SASL_SSL with SASL EXTERNAL, mTLS, and Cruise Control metrics topic.
---

# Connect to self-managed Kafka

This guide uses the recommended configuration for self-managed Kafka:
- **Connectivity:** Direct SASL_SSL
- **Metrics:** Cruise Control metrics reporter topic
- **Security:** SASL_SSL + `SASL EXTERNAL` + mTLS

If you prefer `PLAIN` or `SCRAM`, the connectivity and metrics steps are the same — only the SASL configuration differs. See [Security](/docs/configuration/security) for those variants.

## Prerequisites

- Kafka cluster with brokers reachable over the network from Kinkang (or VPN arranged in advance)
- Ability to perform a rolling broker restart to apply configuration changes
- A CA certificate and the ability to issue client certificates from it

## Step 1 — Configure the SASL_SSL listener

Add or update a `SASL_SSL` listener on each broker. Example `server.properties` snippet:

```properties
listeners=SASL_SSL://:9093
advertised.listeners=SASL_SSL://<broker-hostname>:9093
listener.security.protocol.map=SASL_SSL:SASL_SSL

# TLS
ssl.keystore.location=/etc/kafka/ssl/broker.keystore.jks
ssl.keystore.password=<keystore-password>
ssl.key.password=<key-password>
ssl.truststore.location=/etc/kafka/ssl/ca.truststore.jks
ssl.truststore.password=<truststore-password>
ssl.client.auth=required

# SASL
sasl.enabled.mechanisms=EXTERNAL
sasl.mechanism.inter.broker.protocol=EXTERNAL
```

> Setting `ssl.client.auth=required` enables mTLS — brokers will require a client certificate from Kinkang.

## Step 2 — Issue a client certificate for Kinkang

Generate a private key and CSR:

```bash
# Generate PKCS#8 private key
openssl genpkey -algorithm RSA -out kinkang-client.key

# Create CSR — set CN to the Kafka principal Kinkang will use
openssl req -new -key kinkang-client.key \
  -subj "/CN=kinkang-client/O=Kinkang" \
  -out kinkang-client.csr
```

Sign with your CA:

```bash
openssl x509 -req -in kinkang-client.csr \
  -CA ca.crt -CAkey ca.key -CAcreateserial \
  -days 365 -out kinkang-client.crt
```

Verify:

```bash
openssl x509 -in kinkang-client.crt -noout -subject -issuer
# Expected: subject=CN=kinkang-client, O=Kinkang
```

## Step 3 — Add Kafka ACLs for the Kinkang principal

The CN from Step 2 (`kinkang-client`) becomes the Kafka principal:

```bash
# Allow Kinkang to describe and read all topics (for CC metrics)
kafka-acls.sh --bootstrap-server <bootstrap>:9093 \
  --add --allow-principal User:kinkang-client \
  --operation Describe --operation Read \
  --topic '*' --group '*'

# Allow Kinkang to read the CC metrics topic
kafka-acls.sh --bootstrap-server <bootstrap>:9093 \
  --add --allow-principal User:kinkang-client \
  --operation Read \
  --topic __CruiseControlMetrics
```

## Step 4 — Enable the Cruise Control metrics reporter

Add to each broker's `server.properties`:

```properties
metric.reporters=com.linkedin.kafka.cruisecontrol.metricsreporter.CruiseControlMetricsReporter
cruise.control.metrics.reporter.bootstrap.servers=<bootstrap>:9093
cruise.control.metrics.reporter.security.protocol=SASL_SSL
cruise.control.metrics.reporter.sasl.mechanism=EXTERNAL
cruise.control.metrics.reporter.ssl.keystore.location=/etc/kafka/ssl/reporter.keystore.jks
cruise.control.metrics.reporter.ssl.keystore.password=<password>
cruise.control.metrics.reporter.ssl.truststore.location=/etc/kafka/ssl/ca.truststore.jks
cruise.control.metrics.reporter.ssl.truststore.password=<password>
```

Perform a rolling restart. After restart, verify the metrics topic was created:

```bash
kafka-topics.sh --bootstrap-server <bootstrap>:9093 \
  --command-config client.properties --list | grep CruiseControl
# Expected: __CruiseControlMetrics
```

## Step 5 — Provide connection details to Kinkang

Share the following with the Kinkang team:

| Field | Value |
|---|---|
| Bootstrap servers | `<host1>:9093,<host2>:9093,...` |
| CA certificate | PEM file (the CA that signed broker certs) |
| Client certificate | `kinkang-client.crt` (PEM, X.509) |
| Client private key | `kinkang-client.key` (PEM, PKCS#8) |
| Metrics topic | `__CruiseControlMetrics` (or custom name if changed) |
| SASL mechanism | `EXTERNAL` |

## Private network

If your brokers are not reachable over the public internet, see [Private connectivity with Tailscale](/docs/guides/private-connectivity-tailscale) for a zero-config private tunnel setup before proceeding with this guide.
