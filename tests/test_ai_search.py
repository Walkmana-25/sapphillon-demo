import pytest
from fastapi.testclient import TestClient
from src.app import app
from src.endpoints.v1.ai_search import AISearchRequest, AISearchResponse

client = TestClient(app)

def test_ai_search_success():
    response = client.post("/v1/ai_search", json={"query": "test query"})
    assert response.status_code == 200
    assert "result" in response.json()

def test_ai_search_internal_server_error(mocker):
    mocker.patch("src.endpoints.v1.ai_search.LangChain.search", side_effect=Exception("Test exception"))
    response = client.post("/v1/ai_search", json={"query": "test query"})
    assert response.status_code == 500
    assert response.json() == {"detail": "Internal Server Error"}
