// TODO: Replace all functions with real fetch calls pointing to
//       process.env.NEXT_PUBLIC_API_URL once the backend API is ready.

import type {
  Cluster,
  ClusterWithInstance,
  CreateClusterInput,
  Instance,
  UpdateClusterInput,
  UpdateInstanceInput,
} from './types';
import {
  MOCK_ORG_ID,
  mockClusters,
  mockInstances,
} from './mock-data';

// ---------------------------------------------------------------------------
// Mutable in-memory store — mutations persist across calls within a session.
// NOTE: Module-level state persists within a Next.js process but may reset inconsistently
// during Fast Refresh in development — mutations (like deletions) may reappear after hot reloads.
// ---------------------------------------------------------------------------

const clusterStore: Map<string, Cluster> = new Map(
  mockClusters.map((c) => [c.id, { ...c }]),
);

const instanceStore: Map<string, Instance> = new Map(
  mockInstances.map((i) => [i.id, { ...i }]),
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Simulate network latency. */
const delay = (ms = 150): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/** Generate a simple pseudo-UUID v4 (determinism not required for new items). */
function newUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function now(): string {
  return new Date().toISOString();
}

/** Return the single instance for a cluster (by cluster_id), or undefined. */
function findInstanceByCluster(clusterId: string): Instance | undefined {
  for (const instance of instanceStore.values()) {
    if (instance.cluster_id === clusterId) return instance;
  }
  return undefined;
}

/** Build a ClusterWithInstance from the stores. */
function buildClusterWithInstance(cluster: Cluster): ClusterWithInstance {
  const instance = findInstanceByCluster(cluster.id) ?? null;
  return { ...cluster, instance };
}

// ---------------------------------------------------------------------------
// Cluster API
// ---------------------------------------------------------------------------

export async function getClusters(): Promise<ClusterWithInstance[]> {
  await delay();
  return Array.from(clusterStore.values()).map(buildClusterWithInstance);
}

export async function getCluster(id: string): Promise<ClusterWithInstance> {
  await delay();
  const cluster = clusterStore.get(id);
  if (!cluster) throw new Error(`Cluster not found: ${id}`);
  return buildClusterWithInstance(cluster);
}

export async function createCluster(input: CreateClusterInput): Promise<Cluster> {
  await delay();
  const ts = now();
  const cluster: Cluster = {
    ...input,
    id: newUuid(),
    org_id: MOCK_ORG_ID,
    created_at: ts,
    updated_at: ts,
  };
  clusterStore.set(cluster.id, cluster);
  return { ...cluster };
}

export async function updateCluster(
  id: string,
  input: UpdateClusterInput,
): Promise<Cluster> {
  await delay();
  const existing = clusterStore.get(id);
  if (!existing) throw new Error(`Cluster not found: ${id}`);
  const updated: Cluster = { ...existing, ...input, updated_at: now() };
  clusterStore.set(id, updated);
  return { ...updated };
}

export async function deleteCluster(id: string): Promise<void> {
  await delay();
  if (!clusterStore.has(id)) throw new Error(`Cluster not found: ${id}`);
  clusterStore.delete(id);
  // Also remove any associated instance.
  const instance = findInstanceByCluster(id);
  if (instance) instanceStore.delete(instance.id);
}

// ---------------------------------------------------------------------------
// Instance API
// ---------------------------------------------------------------------------

export async function getInstance(clusterId: string): Promise<Instance | null> {
  await delay();
  return findInstanceByCluster(clusterId) ?? null;
}

/**
 * Provision a new Kinkang instance for the given cluster.
 * Throws if the cluster already has a non-deprovisioned instance.
 */
export async function provisionInstance(clusterId: string): Promise<Instance> {
  await delay();
  const cluster = clusterStore.get(clusterId);
  if (!cluster) throw new Error(`Cluster not found: ${clusterId}`);

  const existing = findInstanceByCluster(clusterId);
  if (existing && existing.status !== 'deprovisioned') {
    throw new Error(
      `Cluster ${clusterId} already has an active instance (status: ${existing.status}). Deprovision it first.`,
    );
  }

  const ts = now();
  const instance: Instance = {
    id: newUuid(),
    org_id: cluster.org_id,
    cluster_id: clusterId,
    status: 'pending_provision',
    health: 'unknown',
    aws_region: cluster.aws_region,
    ecs_cluster_arn: null,
    ecs_task_definition_arn: null,
    ecs_service_arn: null,
    iam_role_arn: null,
    msk_vpc_connection_arn: null,
    last_task_status: null,
    last_health_check_at: null,
    error_message: null,
    description: null,
    created_at: ts,
    updated_at: ts,
  };

  instanceStore.set(instance.id, instance);
  return { ...instance };
}

/**
 * Begin deprovisioning the instance associated with a cluster.
 * Sets status to 'pending_deprovision'.
 */
export async function deprovisionInstance(clusterId: string): Promise<Instance> {
  await delay();
  const instance = findInstanceByCluster(clusterId);
  if (!instance) throw new Error(`No instance found for cluster: ${clusterId}`);
  if (
    instance.status === 'pending_deprovision' ||
    instance.status === 'deprovisioning' ||
    instance.status === 'deprovisioned'
  ) {
    throw new Error(
      `Instance is already being deprovisioned (status: ${instance.status}).`,
    );
  }

  const updated: Instance = {
    ...instance,
    status: 'pending_deprovision',
    updated_at: now(),
  };
  instanceStore.set(updated.id, updated);
  return { ...updated };
}

/**
 * Update mutable fields on an instance (currently only the user-editable description).
 */
export async function updateInstance(
  clusterId: string,
  input: UpdateInstanceInput,
): Promise<Instance> {
  await delay();
  const instance = findInstanceByCluster(clusterId);
  if (!instance) throw new Error(`No instance found for cluster: ${clusterId}`);

  const updated: Instance = {
    ...instance,
    description: input.description,
    updated_at: now(),
  };
  instanceStore.set(updated.id, updated);
  return { ...updated };
}
