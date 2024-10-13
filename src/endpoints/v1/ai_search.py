import logging
import os

from fastapi import APIRouter, HTTPException
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_community.tools import DuckDuckGoSearchRun
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_openai import ChatOpenAI
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
        llm = ChatOpenAI(
            base_url=os.environ.get("OPENAI_BASE_URL"),
            api_key=os.environ.get("OPENAI_API_KEY"),
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
