import logging
import os

from fastapi import APIRouter, HTTPException
from langchain.agents import AgentType, initialize_agent, load_tools
from langchain_community.llms.openai import OpenAI
from langchain_community.tools import DuckDuckGoSearchRun
from pydantic import BaseModel

router = APIRouter()
logger = logging.getLogger("uvicorn.api.v1").getChild(__name__)


class AISearchRequest(BaseModel):
    query: str


class AISearchResponse(BaseModel):
    result: str


@router.post("/ai_search", response_model=AISearchResponse)
async def ai_search(request: AISearchRequest) -> AISearchResponse:
    try:
        llm = OpenAI(base_url=os.environ.get("OPENAI_BASE_URL"), api_key=os.environ.get("OPENAI_API_KEY"))

        tools = [
            DuckDuckGoSearchRun(),
        ]

        agent = initialize_agent(tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True)
        result = agent.run(request.query)

        return AISearchResponse(result=result)
    except Exception as e:
        logger.exception("ERR")
        raise HTTPException(status_code=500, detail="Internal Server Error") from e
