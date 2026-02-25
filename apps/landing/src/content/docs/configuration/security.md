---
title: Security
description: SASL_SSL, SASL mechanisms, mTLS, and certificate requirements.
---

# Security

All connections between Kinkang and your Kafka cluster use **SASL_SSL** — TLS encryption is mandatory. The specific SASL mechanism depends on your environment and preferences.

## SASL mechanisms

### `AWS_MSK_IAM` — AWS MSK only

Kinkang authenticates using an AWS IAM role. This is the standard mechanism for MSK and requires no certificates.

You provide:
- An IAM role ARN that Kinkang can assume
- The role must have `kafka-cluster:*` permissions on your MSK cluster

```json
{
  "Effect": "Allow",
  "Action": "kafka-cluster:*",
  "Resource": "arn:aws:kafka:us-east-1:<account>:cluster/<name>/*"
}
```

### `SASL EXTERNAL` — self-managed with mTLS (recommended)

Uses the client's TLS certificate as the authentication credential. The **CN (Common Name)** of the client certificate is used as the Kafka principal for ACL enforcement.

Example: a client certificate with CN `kinkang-client` must have a corresponding ACL entry:

```bash
kafka-acls.sh --bootstrap-server <bootstrap>:9093 \
  --add --allow-principal User:kinkang-client \
  --operation All --topic '*' --group '*'
```

Requires mTLS to be enabled on the broker listener.

### `PLAIN` — self-managed

Username/password authentication. Simple to configure, widely supported.

```properties
# broker listener config
listener.name.sasl_ssl.plain.sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required \
  username="admin" \
  password="admin-secret" \
  user_kinkang="kinkang-secret";
```

You provide: username and password for the Kinkang service account.

### `SCRAM-SHA-256` / `SCRAM-SHA-512` — self-managed

Salted challenge-response auth. More secure than PLAIN as credentials are never sent in plaintext.

```bash
# Create the Kinkang SCRAM credential
kafka-configs.sh --bootstrap-server <bootstrap>:9093 \
  --alter --add-config 'SCRAM-SHA-256=[password=kinkang-secret]' \
  --entity-type users --entity-name kinkang
```

You provide: username and password.

## mTLS (mutual TLS)

mTLS adds a second layer of authentication at the TLS level — both sides present certificates. It is **optional** but **recommended**, especially when using `SASL EXTERNAL`.

To enable mTLS:

1. Configure the broker to require client certificates on the `SASL_SSL` listener:

```properties
# server.properties
ssl.client.auth=required
ssl.truststore.location=/etc/kafka/ssl/ca-truststore.jks
ssl.truststore.password=<password>
```

2. Provide Kinkang with:
   - Client certificate (PEM, X.509 format)
   - Client private key (PEM, PKCS#8 format)
   - CA certificate (PEM)

## Certificate format requirements

All certificates must be in **PEM format**:

| File | Format | Header |
|---|---|---|
| Private key | PKCS#8 | `-----BEGIN PRIVATE KEY-----` |
| Certificate | X.509 | `-----BEGIN CERTIFICATE-----` |
| CA cert | X.509 | `-----BEGIN CERTIFICATE-----` |

To convert a PKCS#1 key to PKCS#8:

```bash
openssl pkcs8 -topk8 -nocrypt -in client.key -out client-pkcs8.key
```

To verify certificate details:

```bash
openssl x509 -in client.crt -noout -subject -issuer -dates
```
