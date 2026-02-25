---
title: Overview
description: What Kinkang is, what it manages, and the three pillars of configuration.
---

# Overview

Kinkang is a fully managed service that deploys and operates [Cruise Control](https://github.com/linkedin/cruise-control) for your Kafka clusters. You get automated partition rebalancing, live Cruise Control metrics, and a Grafana dashboard — without running any of that infrastructure yourself.

## What Kinkang manages

- **Cruise Control lifecycle** — deployment, configuration, upgrades, and restarts
- **Partition rebalancing** — scheduled or on-demand, with zero consumer disruption
- **Metrics pipeline** — Cruise Control metrics collected and surfaced via API and Grafana

## The three configuration pillars

Every Kinkang Engine is configured around three pillars:

### 1. Connectivity

How Kinkang reaches your Kafka brokers. Options depend on your environment:

| Environment | Method |
|---|---|
| AWS MSK | MSK multi-VPC private connectivity (PrivateLink) |
| Self-managed (cloud) | Direct SASL_SSL; VPN available on request |
| Self-managed (on-prem) | VPN (discussed per case — not offered out of the box) |

See [Connectivity](/docs/configuration/connectivity) for full details.

### 2. Metrics

How Kinkang collects Kafka and Cruise Control metrics:

| Environment | Method |
|---|---|
| AWS MSK | Prometheus (requires open monitoring enabled on MSK) |
| Self-managed (recommended) | Cruise Control metrics reporter → Kafka topic |
| Self-managed (alternative) | Prometheus endpoint |

See [Metrics](/docs/configuration/metrics) for full details.

### 3. Security

All connections use **SASL_SSL**. The SASL mechanism depends on your environment:

| Environment | Mechanism |
|---|---|
| AWS MSK | `AWS_MSK_IAM` |
| Self-managed | `EXTERNAL`, `PLAIN`, or `SCRAM-SHA-256/512` |

mTLS is optional but recommended where supported. See [Security](/docs/configuration/security) for full details.

## Next steps

- Review [Customer prerequisites](/docs/requirements/customer-prerequisites) before onboarding
- Follow the [Connect to AWS MSK](/docs/guides/connect-aws-msk) or [Connect to self-managed Kafka](/docs/guides/connect-self-managed) guide
