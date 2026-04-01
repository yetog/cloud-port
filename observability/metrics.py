"""
Prometheus Metrics for Portfolio Brain.
Custom metrics for skills, apps, tasks, and memory.
"""

import time
import socket
from typing import Optional
from functools import wraps

# Try to import prometheus_client, gracefully degrade if not available
try:
    from prometheus_client import Counter, Histogram, Gauge, Info, generate_latest, CONTENT_TYPE_LATEST
    PROMETHEUS_AVAILABLE = True
except ImportError:
    PROMETHEUS_AVAILABLE = False
    # Create dummy classes for when prometheus_client isn't installed
    class DummyMetric:
        def labels(self, *args, **kwargs): return self
        def inc(self, *args, **kwargs): pass
        def dec(self, *args, **kwargs): pass
        def set(self, *args, **kwargs): pass
        def observe(self, *args, **kwargs): pass
        def info(self, *args, **kwargs): pass

    Counter = Histogram = Gauge = Info = lambda *args, **kwargs: DummyMetric()
    generate_latest = lambda: b""
    CONTENT_TYPE_LATEST = "text/plain"


# ============ SKILL METRICS ============

skill_executions = Counter(
    'brain_skill_executions_total',
    'Total number of skill executions',
    ['skill', 'status']  # status: success, error
)

skill_duration = Histogram(
    'brain_skill_duration_seconds',
    'Skill execution duration in seconds',
    ['skill'],
    buckets=[0.01, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0]
)


# ============ APP METRICS ============

apps_up = Gauge(
    'brain_apps_up',
    'Whether an app is responding (1=up, 0=down)',
    ['app', 'port', 'category']
)

apps_response_time = Histogram(
    'brain_apps_response_time_seconds',
    'App health check response time',
    ['app'],
    buckets=[0.01, 0.05, 0.1, 0.25, 0.5, 1.0, 2.0]
)


# ============ TASK METRICS ============

tasks_pending = Gauge(
    'brain_tasks_pending',
    'Number of pending tasks'
)

tasks_completed = Counter(
    'brain_tasks_completed_total',
    'Total number of completed tasks'
)

tasks_created = Counter(
    'brain_tasks_created_total',
    'Total number of tasks created'
)


# ============ MEMORY METRICS ============

memory_operations = Counter(
    'brain_memory_operations_total',
    'Memory system operations',
    ['tier', 'operation', 'status']  # tier: redis/qdrant, operation: read/write, status: success/error
)

memory_latency = Histogram(
    'brain_memory_latency_seconds',
    'Memory operation latency',
    ['tier', 'operation'],
    buckets=[0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25]
)


# ============ SYSTEM INFO ============

brain_info = Info(
    'brain',
    'Portfolio Brain information'
)


# ============ HELPER FUNCTIONS ============

def record_skill_execution(skill_name: str, duration_seconds: float, success: bool):
    """Record a skill execution in metrics."""
    status = "success" if success else "error"
    skill_executions.labels(skill=skill_name, status=status).inc()
    skill_duration.labels(skill=skill_name).observe(duration_seconds)


def update_app_status(app_name: str, port: int, category: str, is_up: bool, response_time: float = None):
    """Update app status metrics."""
    apps_up.labels(app=app_name, port=str(port), category=category).set(1 if is_up else 0)
    if response_time is not None:
        apps_response_time.labels(app=app_name).observe(response_time)


def record_memory_operation(tier: str, operation: str, success: bool, latency: float = None):
    """Record a memory operation."""
    status = "success" if success else "error"
    memory_operations.labels(tier=tier, operation=operation, status=status).inc()
    if latency is not None:
        memory_latency.labels(tier=tier, operation=operation).observe(latency)


def update_task_counts(pending: int):
    """Update task count gauges."""
    tasks_pending.set(pending)


def record_task_created():
    """Record a task creation."""
    tasks_created.inc()


def record_task_completed():
    """Record a task completion."""
    tasks_completed.inc()


def set_brain_info(version: str = "1.0.0", skills_count: int = 0, apps_count: int = 0):
    """Set brain info metric."""
    brain_info.info({
        'version': version,
        'skills_count': str(skills_count),
        'apps_count': str(apps_count),
    })


# ============ METRICS SUMMARY ============

def get_metrics_summary() -> dict:
    """Get a summary of current metrics for display."""
    # This is a simplified summary - full metrics available via /metrics endpoint
    return {
        "prometheus_available": PROMETHEUS_AVAILABLE,
        "metrics": [
            "brain_skill_executions_total",
            "brain_skill_duration_seconds",
            "brain_apps_up",
            "brain_tasks_pending",
            "brain_tasks_completed_total",
            "brain_memory_operations_total",
        ]
    }


def get_metrics_output() -> bytes:
    """Get Prometheus metrics output."""
    if not PROMETHEUS_AVAILABLE:
        return b"# Prometheus client not installed\n"
    return generate_latest()


def get_content_type() -> str:
    """Get Prometheus content type."""
    return CONTENT_TYPE_LATEST


# ============ DECORATOR FOR SKILL TIMING ============

def track_skill(skill_name: str):
    """Decorator to track skill execution metrics."""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            start = time.time()
            success = True
            try:
                result = await func(*args, **kwargs)
                if hasattr(result, 'success'):
                    success = result.success
                return result
            except Exception as e:
                success = False
                raise
            finally:
                duration = time.time() - start
                record_skill_execution(skill_name, duration, success)
        return wrapper
    return decorator
