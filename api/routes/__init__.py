# API Routes
from .status import router as status_router
from .skills import router as skills_router
from .apps import router as apps_router
from .tasks import router as tasks_router
from .memory import router as memory_router
from .notes import router as notes_router

__all__ = [
    'status_router',
    'skills_router',
    'apps_router',
    'tasks_router',
    'memory_router',
    'notes_router',
]
