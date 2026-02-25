---
title: Private connectivity with Tailscale
description: Keep Kinkang traffic off the public internet by connecting your self-managed Kafka cluster via a Tailscale private network.
---

# Private connectivity with Tailscale

By default, Kinkang's Engine connects to self-managed Kafka brokers over the public internet. If your brokers are in a private network and you want to keep all traffic private and secure, you can use **Tailscale** to create an encrypted **WireGuard** tunnel between Kinkang and your infrastructure — no public ports, no VPN gateway required.

## How it works

You deploy a single **subnet router** inside your network. It advertises your Kafka broker subnet to a private Tailscale network (tailnet). Kinkang joins that tailnet from inside its own infrastructure and connects to your brokers via their private IPs. Traffic is **WireGuard**-encrypted end-to-end and never touches the public internet.

## Prerequisites

- A [Tailscale](https://tailscale.com) account (free tier works)
- A machine inside your network that can reach the Kafka brokers (VM, server, or Docker host)
- Private IP addresses of your Kafka brokers

## Step 1 — Deploy a subnet router

Run a Tailscale subnet router on any always-on machine inside your network. It does not need to run on the Kafka brokers themselves.

**Docker:**

```bash
docker run -d \
  --name tailscale-subnet-router \
  --restart unless-stopped \
  --cap-add NET_ADMIN \
  --device /dev/net/tun \
  -v tailscale-state:/var/lib/tailscale \
  -e TS_AUTHKEY=<your-own-tailscale-auth-key> \
  -e TS_EXTRA_ARGS="--advertise-routes=<broker-subnet-cidr>" \
  tailscale/tailscale
```

Replace `<broker-subnet-cidr>` with the subnet your Kafka brokers are in, for example `10.0.1.0/24`.

**Systemd (Linux VM):**

```bash
# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# Start and advertise the broker subnet
tailscale up --authkey=<your-own-auth-key> --advertise-routes=<broker-subnet-cidr>
```

## Step 2 — Approve the subnet route

1. Open the [Tailscale admin console](https://login.tailscale.com/admin/machines)
2. Find the subnet router you just deployed
3. Click **Edit route settings** and enable the advertised route

## Step 3 — Restrict what Kinkang can access (recommended)

Configure a Tailscale ACL policy so Kinkang's device can only reach Kafka ports on the broker subnet. This limits the blast radius if the auth key were ever misused.

In the [Tailscale ACL editor](https://login.tailscale.com/admin/acls):

```json
{
  "tagOwners": {
    "tag:kinkang": []
  },
  "acls": [
    {
      "action": "accept",
      "src": ["tag:kinkang"],
      "dst": ["<broker-subnet-cidr>:9092,9093"]
    }
  ]
}
```

## Step 4 — Generate an auth key for Kinkang

1. Go to **Settings → Auth keys** in the Tailscale admin console
2. Click **Generate auth key** with these settings:
   - **Reusable**: enabled (Kinkang's Engine may restart or redeploy)
   - **Ephemeral**: enabled (the Kinkang device auto-expires when the Engine stops — no stale nodes)
   - **Tags**: `tag:kinkang`
3. Copy the generated key — you'll provide it to Kinkang in the next step

## Step 5 — Register your cluster with Kinkang

When adding your cluster in the Kinkang dashboard:

- **Bootstrap servers**: use private IPs, e.g. `10.0.1.10:9092,10.0.1.11:9092,10.0.1.12:9092`
- **Tailscale auth key**: paste the key from Step 4

Kinkang stores the key securely and uses it to join your tailnet when provisioning the Engine. You can rotate or revoke the key at any time from the Tailscale admin console to immediately cut access.

## Security notes

- Kinkang's device is tagged `tag:kinkang` and your ACL restricts it to Kafka ports only — it cannot access anything else on your network
- The auth key is ephemeral, so no persistent Tailscale node lingers if the Engine is deprovisioned
- You can verify which devices are on your tailnet at any time in the Tailscale admin console
- Revoking the auth key or removing the device from your tailnet immediately disconnects Kinkang
