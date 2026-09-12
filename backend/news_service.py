import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("NEWSDATA_API_KEY")

NEWS_URL = "https://newsdata.io/api/1/latest"


def get_india_news(category: str):
    """
    Get India news related to a specific humanitarian category.
    """

    if not API_KEY:
        raise Exception("NEWSDATA_API_KEY is missing")

    queries = {
        "injured_or_dead_people":
            "India accident OR deaths OR injured OR casualties OR disaster",

        "displaced_people_and_evacuations":
            "India evacuation OR evacuated OR displaced OR flood evacuation",

        "requests_or_urgent_needs":
            "India emergency OR urgent help OR relief OR rescue OR aid",
    }

    query = queries.get(
        category,
        "India disaster OR flood OR earthquake OR fire"
    )

    params = {
        "apikey": API_KEY,
        "q": query,
        "country": "in",
        "language": "en",
    }

    response = requests.get(
        NEWS_URL,
        params=params,
        timeout=15
    )

    response.raise_for_status()

    data = response.json()

    if data.get("status") != "success":
        return []

    articles = data.get("results", [])

    news = []

    for article in articles:

        news.append({
            "title": article.get("title"),
            "description": article.get("description"),
            "published": article.get("pubDate"),
            "source": article.get("source_name"),
            "url": article.get("link"),
        })

    return news