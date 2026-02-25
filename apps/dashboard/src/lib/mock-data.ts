import type { Cluster, Instance } from './types';

// ---------------------------------------------------------------------------
// Stable org / cluster / instance UUIDs
// ---------------------------------------------------------------------------

export const MOCK_ORG_ID = 'a1b2c3d4-0001-0000-0000-000000000000';

// Cluster IDs
export const CLUSTER_ID_MSK_RUNNING     = 'c0000001-cafe-babe-0000-000000000001';
export const CLUSTER_ID_SELF_MANAGED    = 'c0000002-cafe-babe-0000-000000000002';
export const CLUSTER_ID_MSK_ERROR       = 'c0000003-cafe-babe-0000-000000000003';
export const CLUSTER_ID_PROVISIONING    = 'c0000004-cafe-babe-0000-000000000004';
export const CLUSTER_ID_DEGRADED        = 'c0000005-cafe-babe-0000-000000000005';
export const CLUSTER_ID_DEPROVISIONING  = 'c0000006-cafe-babe-0000-000000000006';

// Instance IDs
export const INSTANCE_ID_RUNNING        = 'i0000001-dead-beef-0000-000000000001';
export const INSTANCE_ID_ERROR          = 'i0000003-dead-beef-0000-000000000003';
export const INSTANCE_ID_PROVISIONING   = 'i0000004-dead-beef-0000-000000000004';
export const INSTANCE_ID_DEGRADED       = 'i0000005-dead-beef-0000-000000000005';
export const INSTANCE_ID_DEPROVISIONING = 'i0000006-dead-beef-0000-000000000006';

// ---------------------------------------------------------------------------
// Clusters
// ---------------------------------------------------------------------------

export const mockClusters: Cluster[] = [
  {
    id: CLUSTER_ID_MSK_RUNNING,
    org_id: MOCK_ORG_ID,
    name: 'prod-us-east-1',
    cluster_type: 'msk',
    bootstrap_servers:
      'b-1.prod-us-east-1.abc123.c2.kafka.us-east-1.amazonaws.com:9098,b-2.prod-us-east-1.abc123.c2.kafka.us-east-1.amazonaws.com:9098',
    aws_region: 'us-east-1',
    msk_cluster_arn:
      'arn:aws:kafka:us-east-1:123456789012:cluster/prod-us-east-1/abc12345-1234-1234-1234-abc123456789-1',
    sasl_mechanism: 'AWS_MSK_IAM',
    sasl_username: null,
    sasl_password: null,
    sampler: 'prometheus',
    prometheus_endpoint: 'http://prometheus.internal:9090',
    broker_count: 3,
    broker_disk_mb: 102400,
    broker_cpu_cores: 4,
    broker_nw_in_kbps: 512000,
    broker_nw_out_kbps: 512000,
    created_at: '2024-11-01T09:00:00.000Z',
    updated_at: '2025-01-15T14:22:00.000Z',
  },
  {
    id: CLUSTER_ID_SELF_MANAGED,
    org_id: MOCK_ORG_ID,
    name: 'staging-on-prem',
    cluster_type: 'self_managed',
    bootstrap_servers:
      'kafka-1.staging.internal:9092,kafka-2.staging.internal:9092,kafka-3.staging.internal:9092',
    aws_region: null,
    msk_cluster_arn: null,
    sasl_mechanism: 'SCRAM-SHA-512',
    sasl_username: 'kinkang-staging',
    sasl_password: null,
    sampler: 'topic',
    prometheus_endpoint: null,
    broker_count: 3,
    broker_disk_mb: 51200,
    broker_cpu_cores: 2,
    broker_nw_in_kbps: 131072,
    broker_nw_out_kbps: 131072,
    created_at: '2024-12-10T11:30:00.000Z',
    updated_at: '2024-12-10T11:30:00.000Z',
  },
  {
    id: CLUSTER_ID_MSK_ERROR,
    org_id: MOCK_ORG_ID,
    name: 'dev-us-west-2',
    cluster_type: 'msk',
    bootstrap_servers:
      'b-1.dev-us-west-2.xyz789.c2.kafka.us-west-2.amazonaws.com:9098,b-2.dev-us-west-2.xyz789.c2.kafka.us-west-2.amazonaws.com:9098',
    aws_region: 'us-west-2',
    msk_cluster_arn:
      'arn:aws:kafka:us-west-2:123456789012:cluster/dev-us-west-2/xyz78901-5678-5678-5678-xyz789012345-2',
    sasl_mechanism: 'AWS_MSK_IAM',
    sasl_username: null,
    sasl_password: null,
    sampler: 'prometheus',
    prometheus_endpoint: 'http://prometheus-dev.internal:9090',
    broker_count: 2,
    broker_disk_mb: 20480,
    broker_cpu_cores: 2,
    broker_nw_in_kbps: 65536,
    broker_nw_out_kbps: 65536,
    created_at: '2025-01-20T08:00:00.000Z',
    updated_at: '2025-03-05T17:45:00.000Z',
  },
  {
    id: CLUSTER_ID_PROVISIONING,
    org_id: MOCK_ORG_ID,
    name: 'analytics-eu-west-1',
    cluster_type: 'msk',
    bootstrap_servers:
      'b-1.analytics-eu-west-1.def456.c2.kafka.eu-west-1.amazonaws.com:9098,b-2.analytics-eu-west-1.def456.c2.kafka.eu-west-1.amazonaws.com:9098',
    aws_region: 'eu-west-1',
    msk_cluster_arn:
      'arn:aws:kafka:eu-west-1:123456789012:cluster/analytics-eu-west-1/def45678-9012-9012-9012-def456789012-3',
    sasl_mechanism: 'AWS_MSK_IAM',
    sasl_username: null,
    sasl_password: null,
    sampler: 'prometheus',
    prometheus_endpoint: 'http://prometheus-eu.internal:9090',
    broker_count: 6,
    broker_disk_mb: 204800,
    broker_cpu_cores: 8,
    broker_nw_in_kbps: 1048576,
    broker_nw_out_kbps: 1048576,
    created_at: '2025-03-01T10:00:00.000Z',
    updated_at: '2025-03-01T10:00:00.000Z',
  },
  {
    id: CLUSTER_ID_DEGRADED,
    org_id: MOCK_ORG_ID,
    name: 'data-ap-southeast-1',
    cluster_type: 'self_managed',
    bootstrap_servers:
      'kafka-1.ap.internal:9092,kafka-2.ap.internal:9092,kafka-3.ap.internal:9092',
    aws_region: null,
    msk_cluster_arn: null,
    sasl_mechanism: 'PLAIN',
    sasl_username: 'kinkang-ap',
    sasl_password: null,
    sampler: 'topic',
    prometheus_endpoint: null,
    broker_count: 9,
    broker_disk_mb: 409600,
    broker_cpu_cores: 16,
    broker_nw_in_kbps: 2097152,
    broker_nw_out_kbps: 2097152,
    created_at: '2025-02-14T07:00:00.000Z',
    updated_at: '2025-04-01T09:30:00.000Z',
  },
  {
    id: CLUSTER_ID_DEPROVISIONING,
    org_id: MOCK_ORG_ID,
    name: 'legacy-eu-central-1',
    cluster_type: 'msk',
    bootstrap_servers:
      'b-1.legacy-eu-central-1.ghi789.c2.kafka.eu-central-1.amazonaws.com:9098',
    aws_region: 'eu-central-1',
    msk_cluster_arn:
      'arn:aws:kafka:eu-central-1:123456789012:cluster/legacy-eu-central-1/ghi78901-3456-3456-3456-ghi789012345-4',
    sasl_mechanism: 'AWS_MSK_IAM',
    sasl_username: null,
    sasl_password: null,
    sampler: 'prometheus',
    prometheus_endpoint: 'http://prometheus-legacy.internal:9090',
    broker_count: 3,
    broker_disk_mb: 51200,
    broker_cpu_cores: 4,
    broker_nw_in_kbps: 262144,
    broker_nw_out_kbps: 262144,
    created_at: '2024-08-10T12:00:00.000Z',
    updated_at: '2025-04-09T16:00:00.000Z',
  },
];

// ---------------------------------------------------------------------------
// Instances
// ---------------------------------------------------------------------------

export const mockInstances: Instance[] = [
  {
    id: INSTANCE_ID_RUNNING,
    org_id: MOCK_ORG_ID,
    cluster_id: CLUSTER_ID_MSK_RUNNING,
    status: 'running',
    health: 'healthy',
    aws_region: 'us-east-1',
    ecs_cluster_arn: 'arn:aws:ecs:us-east-1:123456789012:cluster/kinkang-prod',
    ecs_task_definition_arn:
      'arn:aws:ecs:us-east-1:123456789012:task-definition/kinkang-cruise-control:42',
    ecs_service_arn:
      'arn:aws:ecs:us-east-1:123456789012:service/kinkang-prod/kinkang-cc-prod-us-east-1',
    iam_role_arn: 'arn:aws:iam::123456789012:role/kinkang-cc-execution-role',
    msk_vpc_connection_arn:
      'arn:aws:kafka:us-east-1:123456789012:vpc-connection/prod-us-east-1/abc12345-1234-1234-1234-abc123456789-1/vpc-conn-0a1b2c3d4e5f',
    last_task_status: 'RUNNING',
    last_health_check_at: '2025-03-15T12:00:00.000Z',
    error_message: null,
    description: 'Production Kinkang Engine — handles ~50k msgs/s.',
    created_at: '2024-11-05T10:00:00.000Z',
    updated_at: '2025-03-15T12:00:00.000Z',
  },
  {
    id: INSTANCE_ID_ERROR,
    org_id: MOCK_ORG_ID,
    cluster_id: CLUSTER_ID_MSK_ERROR,
    status: 'error',
    health: 'unknown',
    aws_region: 'us-west-2',
    ecs_cluster_arn: 'arn:aws:ecs:us-west-2:123456789012:cluster/kinkang-dev',
    ecs_task_definition_arn:
      'arn:aws:ecs:us-west-2:123456789012:task-definition/kinkang-cruise-control:38',
    ecs_service_arn:
      'arn:aws:ecs:us-west-2:123456789012:service/kinkang-dev/kinkang-cc-dev-us-west-2',
    iam_role_arn: 'arn:aws:iam::123456789012:role/kinkang-cc-execution-role',
    msk_vpc_connection_arn:
      'arn:aws:kafka:us-west-2:123456789012:vpc-connection/dev-us-west-2/xyz78901-5678-5678-5678-xyz789012345-2/vpc-conn-9f8e7d6c5b4a',
    last_task_status: 'STOPPED',
    last_health_check_at: '2025-03-05T17:44:00.000Z',
    error_message: 'ECS task failed to start: out of memory',
    description: null,
    created_at: '2025-01-22T09:00:00.000Z',
    updated_at: '2025-03-05T17:44:00.000Z',
  },
  {
    id: INSTANCE_ID_PROVISIONING,
    org_id: MOCK_ORG_ID,
    cluster_id: CLUSTER_ID_PROVISIONING,
    status: 'provisioning',
    health: 'unknown',
    aws_region: 'eu-west-1',
    ecs_cluster_arn: null,
    ecs_task_definition_arn: null,
    ecs_service_arn: null,
    iam_role_arn: null,
    msk_vpc_connection_arn: null,
    last_task_status: 'PENDING',
    last_health_check_at: null,
    error_message: null,
    description: null,
    created_at: '2025-04-10T08:05:00.000Z',
    updated_at: '2025-04-10T08:05:00.000Z',
  },
  {
    id: INSTANCE_ID_DEGRADED,
    org_id: MOCK_ORG_ID,
    cluster_id: CLUSTER_ID_DEGRADED,
    status: 'running',
    health: 'degraded',
    aws_region: null,
    ecs_cluster_arn: 'arn:aws:ecs:ap-southeast-1:123456789012:cluster/kinkang-ap',
    ecs_task_definition_arn:
      'arn:aws:ecs:ap-southeast-1:123456789012:task-definition/kinkang-cruise-control:31',
    ecs_service_arn:
      'arn:aws:ecs:ap-southeast-1:123456789012:service/kinkang-ap/kinkang-cc-ap-southeast-1',
    iam_role_arn: 'arn:aws:iam::123456789012:role/kinkang-cc-execution-role',
    msk_vpc_connection_arn: null,
    last_task_status: 'RUNNING',
    last_health_check_at: '2025-04-10T07:55:00.000Z',
    error_message: null,
    description: 'AP analytics Kinkang Engine — reporting elevated rebalance latency.',
    created_at: '2025-02-18T11:00:00.000Z',
    updated_at: '2025-04-10T07:55:00.000Z',
  },
  {
    id: INSTANCE_ID_DEPROVISIONING,
    org_id: MOCK_ORG_ID,
    cluster_id: CLUSTER_ID_DEPROVISIONING,
    status: 'deprovisioning',
    health: 'unknown',
    aws_region: 'eu-central-1',
    ecs_cluster_arn: 'arn:aws:ecs:eu-central-1:123456789012:cluster/kinkang-legacy',
    ecs_task_definition_arn:
      'arn:aws:ecs:eu-central-1:123456789012:task-definition/kinkang-cruise-control:19',
    ecs_service_arn:
      'arn:aws:ecs:eu-central-1:123456789012:service/kinkang-legacy/kinkang-cc-eu-central-1',
    iam_role_arn: 'arn:aws:iam::123456789012:role/kinkang-cc-execution-role',
    msk_vpc_connection_arn:
      'arn:aws:kafka:eu-central-1:123456789012:vpc-connection/legacy-eu-central-1/ghi78901-3456-3456-3456-ghi789012345-4/vpc-conn-1a2b3c4d5e6f',
    last_task_status: 'STOPPING',
    last_health_check_at: '2025-04-09T15:58:00.000Z',
    error_message: null,
    description: 'Legacy EU Kinkang Engine being retired — migration to prod-us-east-1 complete.',
    created_at: '2024-08-15T09:00:00.000Z',
    updated_at: '2025-04-09T16:00:00.000Z',
  },
];
