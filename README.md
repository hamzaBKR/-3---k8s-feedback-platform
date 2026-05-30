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
