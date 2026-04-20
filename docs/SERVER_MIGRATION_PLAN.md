# Server Migration & Geo-Redundancy Plan

> Complete guide to replicate zaylegend.com infrastructure to a new server.

---

## Current Infrastructure Summary

| Component | Details |
|-----------|---------|
| **OS** | Ubuntu 22.04.5 LTS |
| **Kernel** | 5.15.0-151-generic |
| **Disk** | 388GB (94GB used / 25%) |
| **RAM** | 8GB |
| **Containers** | 27 Docker containers |
| **Domains** | zaylegend.com, greenempireland.com |

---

## Pre-Migration Checklist

### 1. New Server Requirements
- [ ] Ubuntu 22.04 LTS
- [ ] Minimum 8GB RAM (16GB recommended)
- [ ] Minimum 100GB SSD (200GB recommended)
- [ ] Docker + Docker Compose installed
- [ ] Node.js 18+ and npm
- [ ] Python 3.10+ with pip
- [ ] Nginx installed
- [ ] Certbot for SSL

### 2. DNS Preparation
- [ ] Note current DNS records for zaylegend.com
- [ ] Plan TTL reduction before migration (set to 300s/5min)
- [ ] Prepare to update A records post-migration

---

## Migration Steps

### Phase 1: Backup Current Server

```bash
# 1. Create full backup archive
cd /var/www
sudo tar -czvf /tmp/zaylegend-backup-$(date +%Y%m%d).tar.gz \
  --exclude='*/node_modules' \
  --exclude='*/.git' \
  --exclude='*/dist' \
  zaylegend/

# 2. Backup nginx configs
sudo tar -czvf /tmp/nginx-configs-$(date +%Y%m%d).tar.gz /etc/nginx/conf.d/

# 3. Backup Let's Encrypt certs
sudo tar -czvf /tmp/letsencrypt-$(date +%Y%m%d).tar.gz /etc/letsencrypt/

# 4. Export Docker images (optional, can rebuild)
docker save $(docker images -q) | gzip > /tmp/docker-images.tar.gz

# 5. Backup databases
# brain.db (SQLite)
cp /var/www/zaylegend/brain.db /tmp/brain.db.backup

# BH AI 79 PostgreSQL
docker exec bh-ai-postgres pg_dump -U postgres bhai > /tmp/bhai-postgres.sql
```

### Phase 2: New Server Setup

```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install dependencies
sudo apt install -y nginx docker.io docker-compose python3 python3-pip nodejs npm git curl

# 3. Enable services
sudo systemctl enable --now docker nginx

# 4. Add user to docker group
sudo usermod -aG docker $USER

# 5. Install Certbot
sudo apt install -y certbot python3-certbot-nginx
```

### Phase 3: Transfer Files

```bash
# From old server to new server
# Option A: Direct SCP
scp /tmp/zaylegend-backup-*.tar.gz user@new-server:/tmp/
scp /tmp/nginx-configs-*.tar.gz user@new-server:/tmp/

# Option B: rsync (preserves permissions)
rsync -avz --progress /var/www/zaylegend/ user@new-server:/var/www/zaylegend/
```

### Phase 4: Restore on New Server

```bash
# 1. Extract portfolio
cd /var/www
sudo tar -xzvf /tmp/zaylegend-backup-*.tar.gz

# 2. Set permissions
sudo chown -R $USER:www-data /var/www/zaylegend
chmod -R 755 /var/www/zaylegend

# 3. Restore nginx configs
sudo tar -xzvf /tmp/nginx-configs-*.tar.gz -C /

# 4. Install portfolio dependencies
cd /var/www/zaylegend
npm install
npm run build

# 5. Install API dependencies
cd /var/www/zaylegend/api
pip install -r requirements.txt
```

### Phase 5: Rebuild Docker Containers

```bash
# Rebuild each app from source

# BH AI 79 (has docker-compose)
cd /var/www/zaylegend/apps/testing/bh-ai-79
docker-compose up -d

# Other containerized apps
cd /var/www/zaylegend/apps/testing/<app-name>
docker build -t <app-name> .
docker run -d --name <app-name> -p <port>:80 <app-name>
```

### Phase 6: SSL Certificates

```bash
# Option A: Transfer existing certs (temporary)
sudo tar -xzvf /tmp/letsencrypt-*.tar.gz -C /

# Option B: Generate new certs (recommended)
sudo certbot --nginx -d zaylegend.com -d www.zaylegend.com
```

### Phase 7: Start Services

```bash
# Start FastAPI backend
cd /var/www/zaylegend/api
nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 &

# Or use systemd service (recommended)
# See systemd section below

# Test nginx config
sudo nginx -t
sudo systemctl reload nginx
```

### Phase 8: DNS Cutover

1. Update A record for zaylegend.com to new server IP
2. Update A record for www.zaylegend.com
3. Wait for DNS propagation (check with `dig zaylegend.com`)

---

## Docker Containers Reference

| Container | Port | Source Directory |
|-----------|------|------------------|
| green-empire | 3019 | apps/testing/green-empire |
| bh-ai-api | 8001 | apps/testing/bh-ai-79 |
| bh-ai-worker | - | apps/testing/bh-ai-79 |
| bh-ai-postgres | 5433 | apps/testing/bh-ai-79 |
| bh-ai-redis | 6380 | apps/testing/bh-ai-79 |
| dj-visualizer | 3005 | apps/dj-visualizer |
| fineline | 3003 | apps/fineline |
| forge-fit | 3018 | apps/forge-fit |
| losk | 3013 | apps/testing/losk |
| zen-tot | 3017 | apps/testing/zen-tot |
| bh-ai-79 | 3015 | apps/testing/bh-ai-79 |
| got-hired-ai | 3014 | apps/testing/got-hired-ai |
| darkflow-mind-mapper | 3010 | apps/testing/darkflow-mind-mapper |
| gmat-mastery-suite | 3012 | apps/testing/gmat-mastery-suite |
| portfolio-grafana | 3030 | monitoring stack |
| portfolio-prometheus | 9090 | monitoring stack |
| portfolio-qdrant | 6333-6334 | vector database |
| portfolio-redis | 6379 | caching |

---

## Systemd Services (Recommended)

Create `/etc/systemd/system/portfolio-api.service`:

```ini
[Unit]
Description=Portfolio FastAPI Backend
After=network.target

[Service]
User=langchain
WorkingDirectory=/var/www/zaylegend/api
ExecStart=/usr/bin/python3 -m uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable:
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now portfolio-api
```

---

## Geo-Redundancy Options

### Option 1: Active-Passive (Recommended)

Primary server handles all traffic. Secondary on standby.

```
                    ┌─────────────┐
        DNS A ──────│  Primary    │
                    │  Server     │
                    └─────────────┘
                           │
                    (manual failover)
                           │
                    ┌─────────────┐
                    │  Secondary  │
                    │  (Standby)  │
                    └─────────────┘
```

**Setup:**
1. Replicate primary to secondary nightly
2. Keep secondary warm (services running)
3. On failure: Update DNS to secondary IP

**Sync Script** (`/scripts/geo-sync.sh`):
```bash
#!/bin/bash
SECONDARY="user@secondary-server"
rsync -avz --delete \
  --exclude='node_modules' \
  --exclude='.git' \
  /var/www/zaylegend/ $SECONDARY:/var/www/zaylegend/
```

### Option 2: Load Balanced (Advanced)

Both servers active, traffic distributed.

```
                    ┌─────────────┐
        DNS ────────│ Cloudflare  │
                    │ Load Balancer│
                    └──────┬──────┘
                    ┌──────┴──────┐
              ┌─────┴─────┐ ┌─────┴─────┐
              │  Server 1 │ │  Server 2 │
              │  (US-East)│ │  (EU)     │
              └───────────┘ └───────────┘
```

**Requirements:**
- Shared database (managed PostgreSQL)
- Shared file storage (S3/IONOS Object Storage)
- Session affinity or shared session store

### Option 3: Containerized (Kubernetes)

Full Kubernetes deployment for auto-scaling.

**Not recommended** unless traffic justifies complexity.

---

## Validation Checklist

After migration, verify:

- [ ] https://zaylegend.com loads correctly
- [ ] https://zaylegend.com/admin works (password: brain2026)
- [ ] https://zaylegend.com/api/apps returns JSON
- [ ] All app proxies work (/zen-reset, /chord-genesis, etc.)
- [ ] SSL certificate valid (check expiry)
- [ ] Docker containers running (`docker ps`)
- [ ] Monitoring working (Grafana at :3030)

---

## Quick Recovery Commands

```bash
# Check all services
brain status

# Check app health
brain apps health

# View nginx errors
sudo tail -f /var/log/nginx/error.log

# Restart nginx
sudo systemctl restart nginx

# Restart all docker containers
docker restart $(docker ps -q)
```

---

## Emergency Rollback

If migration fails:

1. Revert DNS to old server IP
2. Ensure old server is still running
3. Debug new server issues
4. Attempt migration again during low-traffic window

---

## Estimated Effort

| Task | Effort |
|------|--------|
| Server provisioning | Setup dependent |
| Data transfer | ~30 min (depends on bandwidth) |
| Docker rebuilds | ~1 hour |
| SSL + DNS | ~30 min |
| Testing | ~1 hour |
| **Total** | ~3-4 hours |

---

## Notes

- Consider using Ansible or Terraform for reproducible infrastructure
- Current setup uses no external databases (all containerized)
- IONOS S3 for static assets (already geo-distributed)
- brain.db is SQLite - consider PostgreSQL for HA setups
