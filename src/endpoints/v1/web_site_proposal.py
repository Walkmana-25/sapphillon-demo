import logging
import os

from fastapi import APIRouter, HTTPException
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain.output_parsers import PydanticOutputParser
from langchain_community.tools import DuckDuckGoSearchResults
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, SecretStr

router = APIRouter()
logger = logging.getLogger("uvicorn.api.v1").getChild(__name__)


class AISearchWebRequest(BaseModel):
    query: str


class url_summary(BaseModel):  # noqa: N801
    url: str
    summary: str


class AISearchWebResponse(BaseModel):
    summary: str
    urls: list[url_summary]


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

        parser = PydanticOutputParser(pydantic_object=AISearchWebResponse)

        prompt = ChatPromptTemplate(
            [
                (
                    "system",
                    """
                    You are a web search agent.
                    Please search the web for the query and provide the summary and URLs.
                    You must return 5 URLs and their summaries.
                    Please think following steps.
                    1. Think what user want to know about user's query.
                    2. Search the web for the query. If you got nice website, please memorize the URL and its summary.
                    3. Reflection results to the user.
                    {format_instructions}
                    """,
                ),
                ("user", "{input}"),
                MessagesPlaceholder(variable_name="agent_scratchpad"),
            ],
            partial_variables={"format_instructions": parser.get_format_instructions()},
        )

        agent = create_tool_calling_agent(llm, tools, prompt)
        app = AgentExecutor(agent=agent, tools=tools, verbose=True)
        result = app.invoke({"input": request.query, "format_instructions": parser.get_format_instructions()})
        logger.info(result)

        return parser.invoke(result["output"])

    except Exception as e:
        logger.exception("ERR")
        raise HTTPException(status_code=500, detail="Internal Server Error") from e
