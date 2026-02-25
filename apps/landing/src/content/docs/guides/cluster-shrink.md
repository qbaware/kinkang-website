---
title: Shrinking a cluster (broker decommission)
description: How to safely remove brokers from your Kafka cluster using Kinkang's decommission API.
---

# Shrinking a cluster (broker decommission)

Removing brokers from a Kafka cluster requires moving all partition replicas off those brokers before they are terminated. Kinkang handles this automatically via its decommission API — but the order of operations matters to avoid under-replicated partitions.

## How it works

When you call Kinkang's decommission endpoint for a set of brokers, Kinkang instructs the underlying balancer to:

1. Mark the target brokers as excluded from future replica placement
2. Generate a partition reassignment plan that moves every replica off those brokers onto remaining brokers
3. Execute the reassignment as a single operation, respecting the configured replication throttle so network bandwidth is not saturated

The decommission is a one-shot operation — if it fails partway through (for example due to a transient error), call the endpoint again to re-run it. Once Kinkang confirms the operation completed, the broker has zero replicas and is safe to terminate.

## Recommended flow

```
1. Call POST /clusters/:id/brokers/decommission  (provide broker IDs to remove)
2. Poll GET  /clusters/:id/brokers/:id/status    until status = "ready_to_remove"
3. Terminate the broker in your infra tooling (MSK, Terraform, etc.)
```

Do not terminate a broker before it reaches `ready_to_remove` — if replicas still exist on the broker when it is killed, those replicas are lost and Kafka must rebuild them from other in-sync replicas, causing a period of under-replication.

## Avoid creating new topics during decommission

The decommission process excludes the target brokers from Kinkang's replica placement decisions, but Kafka's own partition assignment (used when creating topics directly via `kafka-topics.sh` or other admin clients outside Kinkang) does not respect this exclusion.

**During an active decommission, avoid:**
- Creating new topics via Kafka admin tools or clients that bypass Kinkang
- Triggering external partition reassignments

If new replicas land on a decommissioning broker via these paths, the balancer will not automatically detect and move them — the decommission operation is one-shot. You would need to call the decommission endpoint again after the original operation completes to move any stragglers. In the worst case — if the broker is terminated with replicas still on it — you will have under-replicated partitions until Kafka replicates them elsewhere.

## Replication factor considerations

With a replication factor of 3, losing a replica temporarily is safe — the other two replicas remain available and Kafka rebuilds the third. With replication factor 1, a broker termination before decommission completes would result in data loss for partitions on that broker. Ensure your topics have RF ≥ 2 before shrinking a cluster.
