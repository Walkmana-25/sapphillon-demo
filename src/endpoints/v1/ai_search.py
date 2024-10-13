from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from langchain import LangChain
import logging

router = APIRouter()
logger = logging.getLogger("uvicorn.api.v1").getChild(__name__)

class AISearchRequest(BaseModel):
    query: str

class AISearchResponse(BaseModel):
    result: str

@router.post("/ai_search", response_model=AISearchResponse)
async def ai_search(request: AISearchRequest) -> AISearchResponse:
    try:
        # Initialize LangChain
        langchain = LangChain()

        # Perform AI search
        result = langchain.search(request.query)

        # Log the search query and result
        logger.info(f"AI Search performed for query: {request.query}, result: {result}")

        return AISearchResponse(result=result)
    except Exception as e:
        logger.error(f"Error occurred during AI search: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
