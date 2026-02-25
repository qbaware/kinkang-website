---
title: Configuration overview
description: The three pillars of a Kinkang Engine — connectivity, metrics, and security.
---

# Configuration overview

A Kinkang Engine is configured around three independent pillars. Each pillar has different options depending on whether you are running **AWS MSK** or **self-managed Kafka**.

## Decision matrix

| Pillar | AWS MSK | Self-managed Kafka |
|---|---|---|
| **Connectivity** | MSK PrivateLink (multi-VPC) | Direct SASL_SSL; VPN on request |
| **Metrics** | Prometheus (open monitoring) | CC metrics topic (recommended) or Prometheus |
| **Security / SASL** | `AWS_MSK_IAM` | `EXTERNAL`, `PLAIN`, or `SCRAM` |
| **mTLS** | Optional | Optional (recommended with `EXTERNAL`) |

## Configuration inputs

When onboarding, you provide Kinkang with:

1. **Connectivity details** — bootstrap endpoints, PrivateLink endpoint or IP ranges
2. **Metrics configuration** — Prometheus endpoint or metrics topic name + credentials
3. **Security credentials** — IAM role ARN (MSK) or SASL credentials + certificates (self-managed)

See each pillar's page for the full details:

- [Connectivity](/docs/configuration/connectivity)
- [Metrics](/docs/configuration/metrics)
- [Security](/docs/configuration/security)
