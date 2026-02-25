---
title: Connect to AWS MSK
description: Step-by-step guide to connecting Kinkang to an AWS MSK cluster via PrivateLink and AWS_MSK_IAM.
---

# Connect to AWS MSK

This guide walks through connecting Kinkang to an **AWS MSK** cluster using:
- **Connectivity:** MSK multi-VPC private connectivity (PrivateLink)
- **Metrics:** Prometheus via open monitoring
- **Security:** SASL_SSL with `AWS_MSK_IAM`

## Prerequisites

- An MSK cluster running Kafka 2.8 or later
- AWS CLI configured with permissions to modify the MSK cluster
- The MSK cluster's ARN and current version (from the AWS console or `aws kafka describe-cluster`)

## Step 1 — Enable open monitoring (Prometheus metrics)

```bash
# Get current cluster version first
CLUSTER_VERSION=$(aws kafka describe-cluster \
  --cluster-arn <cluster-arn> \
  --query 'ClusterInfo.CurrentVersion' \
  --output text)

aws kafka update-monitoring \
  --cluster-arn <cluster-arn> \
  --current-version $CLUSTER_VERSION \
  --open-monitoring '{"Prometheus":{"JmxExporter":{"EnabledInBroker":true},"NodeExporter":{"EnabledInBroker":true}}}'
```

Wait for the cluster to reach `ACTIVE` state before proceeding.

## Step 2 — Enable multi-VPC private connectivity

```bash
CLUSTER_VERSION=$(aws kafka describe-cluster \
  --cluster-arn <cluster-arn> \
  --query 'ClusterInfo.CurrentVersion' \
  --output text)

aws kafka update-connectivity \
  --cluster-arn <cluster-arn> \
  --current-version $CLUSTER_VERSION \
  --connectivity-info '{
    "VpcConnectivity": {
      "ClientAuthentication": {
        "Sasl": {
          "Iam": { "Enabled": true }
        }
      }
    }
  }'
```

After the update completes, retrieve the PrivateLink bootstrap endpoint:

```bash
aws kafka get-bootstrap-brokers --cluster-arn <cluster-arn>
```

Note the `BootstrapBrokerStringSaslIam` value — you will provide this to Kinkang.

## Step 3 — Create an IAM policy and role for Kinkang

Create a policy file `kinkang-msk-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "kafka-cluster:*",
      "Resource": [
        "arn:aws:kafka:<region>:<account>:cluster/<cluster-name>/*",
        "arn:aws:kafka:<region>:<account>:topic/<cluster-name>/*/*",
        "arn:aws:kafka:<region>:<account>:group/<cluster-name>/*/*"
      ]
    }
  ]
}
```

```bash
aws iam create-policy \
  --policy-name KinkangMSKAccess \
  --policy-document file://kinkang-msk-policy.json
```

Create a trust policy file `kinkang-trust-policy.json`. Kinkang will provide its AWS account ID and external ID during onboarding:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::<kinkang-account-id>:root"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "sts:ExternalId": "<provided-by-kinkang>"
        }
      }
    }
  ]
}
```

```bash
aws iam create-role \
  --role-name KinkangRole \
  --assume-role-policy-document file://kinkang-trust-policy.json

aws iam attach-role-policy \
  --role-name KinkangRole \
  --policy-arn arn:aws:iam::<account>:policy/KinkangMSKAccess
```

## Step 4 — Provide connection details to Kinkang

Share the following with the Kinkang team:

| Field | Value |
|---|---|
| Bootstrap endpoint | `BootstrapBrokerStringSaslIam` from Step 2 |
| AWS Region | e.g. `us-east-1` |
| IAM Role ARN | ARN of the role created in Step 3 |
| Prometheus ports | `11001` (JMX), `11002` (node) — confirmed in Step 1 |

Kinkang will accept the PrivateLink connection request from the AWS console on your behalf once the VPC connection is initiated.
