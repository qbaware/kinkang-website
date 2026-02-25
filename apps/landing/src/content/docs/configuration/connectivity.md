---
title: Connectivity
description: How Kinkang connects to your Kafka brokers — PrivateLink, direct, or VPN.
---

# Connectivity

Kinkang connects to your Kafka cluster's broker endpoints over an encrypted channel. The method depends on your infrastructure.

## AWS MSK — PrivateLink (recommended)

For AWS MSK clusters, Kinkang uses **MSK multi-VPC private connectivity** (powered by AWS PrivateLink). This keeps traffic entirely within the AWS network and does not require opening any inbound ports on your VPC.

### Setup steps

1. Enable multi-VPC private connectivity on your MSK cluster in the AWS console or via the API:

```bash
aws kafka update-connectivity \
  --cluster-arn <your-cluster-arn> \
  --connectivity-info '{"VpcConnectivity":{"ClientAuthentication":{"Sasl":{"Iam":{"Enabled":true}}}}}'
```

2. Share the **VPC connection endpoint** with Kinkang. Kinkang will accept the PrivateLink connection from its AWS account.
3. Provide the broker bootstrap endpoint (format: `b-1.xxx.kafka.us-east-1.amazonaws.com:9098`).

> MSK PrivateLink endpoints use port **9098** for SASL_SSL (IAM auth).

## Self-managed Kafka — Direct SASL_SSL

If your Kafka brokers are reachable over the internet or via a shared cloud network, Kinkang connects directly using SASL_SSL. Ensure:

- Broker listeners are configured for `SASL_SSL`
- The Kinkang IP range is allowed through your security groups / firewall
- TLS certificates are valid (self-signed CA is fine — provide the CA cert to Kinkang)

Provide Kinkang with:
- Bootstrap servers: `<host1>:9093,<host2>:9093,...`
- CA certificate (PEM)

## Self-managed Kafka — VPN

For on-prem clusters or clusters in private networks with no public connectivity, a VPN tunnel can be established between your environment and Kinkang's infrastructure.

> **Note:** VPN connectivity is not offered out of the box. If your cluster requires a VPN, contact the Kinkang team before onboarding to discuss feasibility and setup requirements.
