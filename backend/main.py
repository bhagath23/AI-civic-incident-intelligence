from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import requests
import xml.etree.ElementTree as ET

from model import predict


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="Civic Incident Intelligence API",
    description="AI-powered civic incident classification using GDACS",
    version="1.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# REQUEST FORMAT
# ============================================================

class PredictionRequest(BaseModel):
    text: str


# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():

    return {
        "message": "Civic Incident Intelligence API is running"
    }


# ============================================================
# SINGLE TEXT PREDICTION
# ============================================================

@app.post("/predict")
def prediction(request: PredictionRequest):

    result = predict(request.text)

    return {
        "text": request.text,
        "prediction": result["label"]
    }


# ============================================================
# GDACS RSS FEED
# ============================================================

GDACS_URL = "https://www.gdacs.org/xml/rss.xml"


# ============================================================
# CONVERT AI LABEL TO FRONTEND CATEGORY
# ============================================================

def get_category(label):

    label = label.lower().strip()

    category_map = {

        "caution & advice":
            "caution_advice",

        "caution and advice":
            "caution_advice",

        "displaced people & evacuations":
            "displaced_people_and_evacuations",

        "displaced people and evacuations":
            "displaced_people_and_evacuations",

        "infrastructure & utility damage":
            "infrastructure_and_utility_damage",

        "infrastructure and utility damage":
            "infrastructure_and_utility_damage",

        "injured or dead people":
            "injured_or_dead_people",

        "missing or found people":
            "missing_or_found_people",

        "not humanitarian":
            "not_humanitarian",

        "other relevant information":
            "other_relevant_information",

        "requests or urgent needs":
            "requests_or_urgent_needs",

        "rescue / volunteering / donation effort":
            "rescue_volunteering_or_donation_effort",

        "rescue volunteering donation effort":
            "rescue_volunteering_or_donation_effort",

        "sympathy & support":
            "sympathy_and_support",

        "sympathy and support":
            "sympathy_and_support",
    }

    return category_map.get(
        label,
        label.replace(" ", "_")
    )


# ============================================================
# FETCH GDACS INCIDENTS
# ============================================================

@app.get("/incidents")
def incidents():

    try:

        response = requests.get(
            GDACS_URL,
            timeout=20
        )

        response.raise_for_status()

        root = ET.fromstring(
            response.content
        )

        results = []


        # ====================================================
        # READ RSS ITEMS
        # ====================================================

        for item in root.findall(".//item"):

            title_element = item.find("title")
            description_element = item.find("description")
            published_element = item.find("pubDate")
            link_element = item.find("link")


            title = (
                title_element.text
                if title_element is not None
                else ""
            )


            description = (
                description_element.text
                if description_element is not None
                else ""
            )


            published = (
                published_element.text
                if published_element is not None
                else ""
            )


            link = (
                link_element.text
                if link_element is not None
                else ""
            )


            # =================================================
            # TEXT FOR AI
            # =================================================

            text = f"{title}. {description}"


            if not text.strip():
                continue


            # =================================================
            # AI CLASSIFICATION
            # =================================================

            prediction_result = predict(text)


            ai_label = prediction_result["label"]


            # =================================================
            # NORMALIZED CATEGORY
            # =================================================

            category = get_category(ai_label)


            # =================================================
            # ADD INCIDENT
            # =================================================

            results.append({

                "title": title,

                "description": description,

                "published": published,

                "link": link,

                # Human-readable AI label
                "prediction": ai_label,

                # Machine-readable category
                "category": category

            })


        # ====================================================
        # RETURN
        # ====================================================

        return {

            "count": len(results),

            "incidents": results

        }


    # ========================================================
    # REQUEST ERROR
    # ========================================================

    except requests.RequestException as e:

        print(
            "GDACS request error:",
            e
        )

        return {

            "count": 0,

            "incidents": [],

            "error":
                "Unable to fetch GDACS data"

        }


    # ========================================================
    # XML ERROR
    # ========================================================

    except ET.ParseError as e:

        print(
            "GDACS XML parsing error:",
            e
        )

        return {

            "count": 0,

            "incidents": [],

            "error":
                "Unable to parse GDACS data"

        }


    # ========================================================
    # OTHER ERROR
    # ========================================================

    except Exception as e:

        print(
            "Unexpected error:",
            e
        )

        return {

            "count": 0,

            "incidents": [],

            "error": str(e)

        }