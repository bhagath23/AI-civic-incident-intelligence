import os
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification


# ============================================================
# Configuration
# ============================================================

MODEL_NAME = "distilbert-base-uncased"

NUM_CLASSES = 10

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "notebooks",
    "best_distilbert_model.pt"
)


# ============================================================
# Label mapping
# ============================================================

LABEL_NAMES = [
    "caution_and_advice",
    "displaced_people_and_evacuations",
    "infrastructure_and_utility_damage",
    "injured_or_dead_people",
    "missing_or_found_people",
    "not_humanitarian",
    "other_relevant_information",
    "requests_or_urgent_needs",
    "rescue_volunteering_or_donation_effort",
    "sympathy_and_support"
]


# ============================================================
# Device
# ============================================================

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print("Using device:", device)


# ============================================================
# Tokenizer
# ============================================================

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)


# ============================================================
# Model architecture
# ============================================================

model = AutoModelForSequenceClassification.from_pretrained(
    MODEL_NAME,
    num_labels=NUM_CLASSES
)


# ============================================================
# Load trained weights
# ============================================================

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        f"Trained model not found at: {MODEL_PATH}"
    )

print("Loading trained model...")


state_dict = torch.load(
    MODEL_PATH,
    map_location=device
)

model.load_state_dict(state_dict)

model.to(device)

model.eval()

print("Trained model loaded successfully!")


# ============================================================
# Prediction
# ============================================================

def predict(text: str):

    # Safety check
    if not isinstance(text, str):
        raise TypeError("Input text must be a string.")

    text = text.strip()

    if not text:
        raise ValueError("Input text cannot be empty.")

    # Tokenize
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=64
    )

    # Move tensors to CPU/GPU
    inputs = {
        key: value.to(device)
        for key, value in inputs.items()
    }

    # Model inference
    with torch.no_grad():

        outputs = model(**inputs)

        probabilities = torch.softmax(
            outputs.logits,
            dim=1
        )

        predicted_class = torch.argmax(
            probabilities,
            dim=1
        ).item()

        confidence = probabilities[
            0,
            predicted_class
        ].item()

    return {
        "label": LABEL_NAMES[predicted_class],
        "confidence": confidence
    }