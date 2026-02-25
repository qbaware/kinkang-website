export interface Org {
  id: string;
  clerk_org_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Cluster {
  id: string;
  org_id: string;
  name: string;
  cluster_type: 'msk' | 'self_managed';
  bootstrap_servers: string;
  aws_region: string | null;
  msk_cluster_arn: string | null;
  sasl_mechanism: 'AWS_MSK_IAM' | 'PLAIN' | 'SCRAM-SHA-256' | 'SCRAM-SHA-512' | null;
  sasl_username: string | null;
  // NOTE: This field should never be populated in real API responses — secrets must not flow to the frontend.
  sasl_password: string | null;
  sampler: 'prometheus' | 'topic';
  prometheus_endpoint: string | null;
  broker_count: number;
  broker_disk_mb: number;
  broker_cpu_cores: number;
  broker_nw_in_kbps: number;
  broker_nw_out_kbps: number;
  created_at: string;
  updated_at: string;
}

export interface Instance {
  id: string;
  org_id: string;
  cluster_id: string;
  status:
    | 'pending_provision'
    | 'provisioning'
    | 'running'
    | 'pending_deprovision'
    | 'deprovisioning'
    | 'deprovisioned'
    | 'error';
  health: 'healthy' | 'degraded' | 'inactive' | 'unknown';
  aws_region: string | null;
  ecs_cluster_arn: string | null;
  ecs_task_definition_arn: string | null;
  ecs_service_arn: string | null;
  iam_role_arn: string | null;
  msk_vpc_connection_arn: string | null;
  last_task_status: string | null;
  last_health_check_at: string | null;
  error_message: string | null;
  // TODO: `description` is planned but does not yet exist in the DB schema.
  description: string | null;
  created_at: string;
  updated_at: string;
}

// TODO: Before connecting to the real API, sasl_password should be removed from this type
// and sent via a secure channel (e.g., a separate secrets endpoint or encrypted field),
// not as a plaintext JSON body field from the browser.
export type CreateClusterInput = Omit<Cluster, 'id' | 'org_id' | 'created_at' | 'updated_at'>;

export type UpdateClusterInput = Partial<CreateClusterInput>;

export type UpdateInstanceInput = {
  description: string | null
}

/** A cluster with its associated instance included (or null if none exists). */
export type ClusterWithInstance = Cluster & { instance: Instance | null };
