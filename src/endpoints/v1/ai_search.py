import logging
import os

from fastapi import APIRouter, HTTPException
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_community.tools import DuckDuckGoSearchRun
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, SecretStr

router = APIRouter()
logger = logging.getLogger("uvicorn.api.v1").getChild(__name__)


class AISearchRequest(BaseModel):
    query: str


class AISearchResponse(BaseModel):
    result: str


@router.post("/ai_search", response_model=AISearchResponse)
async def ai_search(request: AISearchRequest) -> AISearchResponse:
    """Search the web for the query with AI agent
    This endpoint will search the web for the query with simple AI agent.

    Args:
        request (AISearchRequest): Text what you want to search

    Raises:
        HTTPException: Error while processing

    Returns:
        AISearchResponse: Response with search result
    """
    try:
        llm = ChatOpenAI(
            base_url=os.environ.get("OPENAI_BASE_URL"),
            api_key=SecretStr(os.environ["OPENAI_API_KEY"]),
            model="gpt-4o-mini",
            temperature=0,
        )
        search = DuckDuckGoSearchRun()

        tools = [search]

        prompt = ChatPromptTemplate.from_messages(
            [
                ("system", "You are search Agent"),
                ("user", "{input}"),
                MessagesPlaceholder(variable_name="agent_scratchpad"),
            ]
        )

        agent = create_tool_calling_agent(llm, tools, prompt)
        app = AgentExecutor(agent=agent, tools=tools, verbose=True)
        result = app.invoke({"input": request.query})
        logger.info(result)

        return AISearchResponse(result=str(result["output"]))
    except Exception as e:
        logger.exception("ERR")
        raise HTTPException(status_code=500, detail="Internal Server Error") from e
