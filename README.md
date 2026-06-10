# Kubernetes Feedback Platform 🚀

A cloud-native microservices application built to demonstrate modern DevOps and Kubernetes practices.

The platform allows users to submit feedback through a web interface, temporarily stores requests in Redis, processes them through a .NET worker service, and persists data in PostgreSQL. Analytics are then displayed through a dashboard application.

---


## Architecture

```text
                +------------------+
                |      User        |
                +--------+---------+
                         |
                         v
                +------------------+
                | NGINX Ingress    |
                +--------+---------+
                         |
          +--------------+--------------+
          |                             |
          v                             v

 +----------------+          +----------------+
 |   Vote App     |          |  Result App    |
 |   (Node.js)    |          |   (Node.js)    |
 +--------+-------+          +--------+-------+
          |                           |
          v                           |
 +----------------+                   |
 |     Redis      |                   |
 +--------+-------+                   |
          |                           |
          v                           |
 +----------------+                   |
 |  Worker (.NET) |-------------------+
 +--------+-------+
          |
          v
 +----------------+
 |   PostgreSQL   |
 +----------------+


# what i built on gh actions workflow

Developer Push
      ↓
GitHub Actions
      ↓
Build Docker Images
      ↓
Push Images to Docker Hub
      ↓
Trivy Security Scan
      ↓
Update kustomization.yaml
      ↓
Commit Manifest Changes
      ↓
Push to GitHub
      ↓
ArgoCD Detects Change
      ↓
Sync Kubernetes
      ↓
Rolling Update



GitHub
   │
   ▼
GitHub Actions
   │
   ├── Docker Build
   ├── Trivy Scan
   └── Update Kustomize
            │
            ▼
         Git Repo
            │
            ▼
         ArgoCD
            │
            ▼
      Kubernetes
            │
            ▼
Prometheus + Grafana