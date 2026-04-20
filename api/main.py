"""
Portfolio Brain API
FastAPI application providing REST access to brain functionality.
"""

import sys
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Add portfolio directory to path for imports
PORTFOLIO_DIR = "/var/www/zaylegend"
if PORTFOLIO_DIR not in sys.path:
    sys.path.insert(0, PORTFOLIO_DIR)

# Import routes
from routes import (
    status_router,
    skills_router,
    apps_router,
    tasks_router,
    memory_router,
    notes_router,
)

# Create FastAPI app
app = FastAPI(
    title="Portfolio Brain API",
    description="REST API for Portfolio Brain - Skills, Apps, Tasks, Memory",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(status_router, prefix="/api", tags=["Status"])
app.include_router(skills_router, prefix="/api/skills", tags=["Skills"])
app.include_router(apps_router, prefix="/api/apps", tags=["Apps"])
app.include_router(tasks_router, prefix="/api/tasks", tags=["Tasks"])
app.include_router(memory_router, prefix="/api/memory", tags=["Memory"])
app.include_router(notes_router, prefix="/api", tags=["Notes & Jobs"])


# Prometheus metrics endpoint
@app.get("/metrics", tags=["Metrics"])
async def get_metrics():
    """Prometheus metrics endpoint."""
    try:
        from observability.metrics import get_metrics_output, get_content_type
        from fastapi.responses import Response
        return Response(
            content=get_metrics_output(),
            media_type=get_content_type(),
        )
    except Exception:
        return {"error": "Metrics not available"}


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """API root - shows available endpoints."""
    return {
        "name": "Portfolio Brain API",
        "version": "1.0.0",
        "endpoints": {
            "status": "/api/status",
            "health": "/api/health",
            "skills": "/api/skills",
            "apps": "/api/apps",
            "tasks": "/api/tasks",
            "memory": "/api/memory/status",
            "jobs": "/api/jobs",
            "notes": "/api/notes",
            "docs": "/docs",
            "metrics": "/metrics",
        },
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
