provider "aws" {
  region = "us-east-1"
}

# EKS Cluster for AI Microservices
resource "aws_eks_cluster" "ai_cluster" {
  name     = "smart-video-prod"
  role_arn = aws_iam_role.eks_cluster_role.arn

  vpc_config {
    subnet_ids = [aws_subnet.private_1.id, aws_subnet.private_2.id]
  }
}

# GPU Node Group for BullMQ Workers
resource "aws_eks_node_group" "gpu_workers" {
  cluster_name    = aws_eks_cluster.ai_cluster.name
  node_group_name = "p4d-gpu-nodes"
  node_role_arn   = aws_iam_role.node_role.arn
  subnet_ids      = [aws_subnet.private_1.id]

  scaling_config {
    desired_size = 5
    max_size     = 20
    min_size     = 2
  }

  instance_types = ["p4d.24xlarge"] # 8x A100 GPUs per node
  ami_type       = "AL2_x86_64_GPU"
}

# ElastiCache Redis for Job Queue
resource "aws_elasticache_cluster" "redis_queue" {
  cluster_id           = "bullmq-redis"
  engine               = "redis"
  node_type            = "cache.m6g.large"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
}
