---
title: Metrics
description: How Kinkang collects Kafka and Cruise Control metrics from your cluster.
---

# Metrics

Cruise Control requires access to Kafka metrics to generate accurate rebalancing proposals. Kinkang supports two collection methods.

## Option A — Cruise Control metrics reporter topic (self-managed, recommended)

The **CC metrics reporter** is a Kafka plugin that runs on each broker and publishes metrics to a dedicated internal topic (`__CruiseControlMetrics` by default). Kinkang reads from this topic.

This is the recommended method for self-managed clusters because it requires no additional infrastructure — the metrics flow through Kafka itself.

### Broker configuration

Add to each broker's `server.properties`:

```properties
metric.reporters=com.linkedin.kafka.cruisecontrol.metricsreporter.CruiseControlMetricsReporter
cruise.control.metrics.reporter.bootstrap.servers=<bootstrap>:9093
cruise.control.metrics.reporter.security.protocol=SASL_SSL
cruise.control.metrics.reporter.ssl.truststore.location=/etc/kafka/ssl/truststore.jks
cruise.control.metrics.reporter.ssl.truststore.password=<password>
# Add SASL config matching your chosen mechanism (PLAIN, SCRAM, EXTERNAL)
```

After a rolling restart, verify the topic exists:

```bash
kafka-topics.sh --bootstrap-server <bootstrap>:9093 --list | grep CruiseControl
```

## Option B — Prometheus (required for AWS MSK, optional for self-managed)

Kinkang scrapes a Prometheus-compatible metrics endpoint on each broker.

### AWS MSK

Enable [open monitoring](https://docs.aws.amazon.com/msk/latest/developerguide/open-monitoring.html) on your MSK cluster:

```bash
aws kafka update-monitoring \
  --cluster-arn <cluster-arn> \
  --current-version <cluster-version> \
  --open-monitoring '{"Prometheus":{"JmxExporter":{"EnabledInBroker":true},"NodeExporter":{"EnabledInBroker":true}}}'
```

This exposes metrics on each broker at:
- Port `11001` — JMX metrics
- Port `11002` — Node exporter metrics

Kinkang must be able to reach these ports from its network. With PrivateLink in place, this is handled automatically.

### Self-managed

Expose a Prometheus endpoint (e.g. via [JMX exporter](https://github.com/prometheus/jmx_exporter)) reachable from Kinkang's IP range. Provide Kinkang with the scrape endpoint URL and any required authentication.
