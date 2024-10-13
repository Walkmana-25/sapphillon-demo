import pytest
from fastapi.testclient import TestClient
from src.app import app
from src.endpoints.v1.ai_search import AISearchRequest, AISearchResponse, infer_query_intent, translate_to_english, retrieve_summary_from_wikipedia, retrieve_summary_from_oxford, retrieve_summary_from_kotobank, agent_process, translate_to_user_language

client = TestClient(app)

def test_ai_search_success():
    response = client.post("/v1/ai_search", json={"query": "test query"})
    assert response.status_code == 200
    assert "result" in response.json()

def test_ai_search_internal_server_error(mocker):
    mocker.patch("src.endpoints.v1.ai_search.ddg", side_effect=Exception("Test exception"))
    response = client.post("/v1/ai_search", json={"query": "test query"})
    assert response.status_code == 500
    assert response.json() == {"detail": "Internal Server Error"}

def test_infer_query_intent():
    query = "What is the capital of France?"
    inferred_query = infer_query_intent(query)
    assert inferred_query == query

def test_translate_to_english():
    text = "Bonjour"
    translated_text = translate_to_english(text)
    assert translated_text == text

def test_retrieve_summary_from_wikipedia():
    query = "Python programming"
    summary = retrieve_summary_from_wikipedia(query)
    assert "Summary from Wikipedia" in summary

def test_retrieve_summary_from_oxford():
    query = "Python"
    summary = retrieve_summary_from_oxford(query)
    assert "Summary from Oxford Dictionary" in summary

def test_retrieve_summary_from_kotobank():
    query = "Python"
    summary = retrieve_summary_from_kotobank(query)
    assert "Summary from Kotobank" in summary

def test_agent_process():
    query = "Python programming"
    result = agent_process(query)
    assert "Agent processed result" in result

def test_translate_to_user_language():
    text = "Hello"
    translated_text = translate_to_user_language(text)
    assert translated_text == text
