import logging
import os

from fastapi import APIRouter, HTTPException
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_community.tools import DuckDuckGoSearchResults
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, SecretStr

router = APIRouter()
logger = logging.getLogger("uvicorn.api.v1").getChild(__name__)


class AISearchWebRequest(BaseModel):
    query: str


class AISearchWebResponse(BaseModel):
    summary: str
    url: list[(str, str)]


@router.post("/ai_web_search", response_model=AISearchWebResponse)
async def ai_web_search(request: AISearchWebRequest) -> AISearchWebResponse:
    """Search the web for the query with AI agent
    This endpoint will search the web for the query with simple AI agent.

    Args:
        request (AISearchWebRequest): Text what you want to search

    Raises:
        HTTPException: Error while processing

    Returns:
        AISearchWebResponse: Response with search result
    """
    try:
        llm = ChatOpenAI(
            base_url=os.environ.get("OPENAI_BASE_URL"),
            api_key=SecretStr(os.environ["OPENAI_API_KEY"]),
            model="gpt-4o-mini",
            temperature=0,
        )
        search = DuckDuckGoSearchResults()

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

        return AISearchWebResponse(result=str(result["output"]))
    except Exception as e:
        logger.exception("ERR")
        raise HTTPException(status_code=500, detail="Internal Server Error") from e
