from fastapi import APIRouter

from .version import router as version_router
from .ai_search import router as ai_search_router

router = APIRouter()

# Add your API routes here

router.include_router(version_router)
router.include_router(ai_search_router)
