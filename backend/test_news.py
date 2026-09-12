from news import fetch_india_news


print("\n🇮🇳 INDIA NEWS TEST")
print("=" * 70)


try:

    articles = fetch_india_news(
        search_query="disaster",
        limit=10
    )

    print(f"\nNumber of news articles: {len(articles)}")

    print("=" * 70)


    for index, article in enumerate(
        articles,
        start=1
    ):

        print(f"\nNEWS: {index}")

        print(
            f"Title: {article.get('title')}"
        )

        print(
            f"Description: "
            f"{article.get('description')}"
        )

        print(
            f"Published: "
            f"{article.get('published_at')}"
        )

        print(
            f"Source: "
            f"{article.get('source')}"
        )

        print(
            f"URL: "
            f"{article.get('url')}"
        )

        print("=" * 70)


except Exception as e:

    print("\n❌ ERROR")
    print(e)