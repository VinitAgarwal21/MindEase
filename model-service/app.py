from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import joblib
import json
import spacy
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

# --------------- CONFIG ----------------
MODEL_PATH = "model.joblib"
VECTORIZER_PATH = "vectorizer.joblib"
EMOTIONS_PATH = "emotion_cols.json"
SPACY_MODEL = "en_core_web_sm"
# ---------------------------------------

# load resources (once)
nlp = spacy.load(SPACY_MODEL)
model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)
with open(EMOTIONS_PATH, "r") as f:
    emotion_cols = json.load(f)

app = FastAPI(title="Emotion Predictor")

# allow your React dev server origin(s)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # update if needed / add production domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextIn(BaseModel):
    text: str

class PredictionOut(BaseModel):
    emotions: List[str]

def preprocess_text(text: str) -> str:
    doc = nlp(str(text).lower())
    tokens = [token.lemma_ for token in doc if token.is_alpha and not token.is_stop and not token.is_punct]
    return " ".join(tokens)

@app.post("/predict", response_model=PredictionOut)
def predict(payload: TextIn):
    cleaned = preprocess_text(payload.text)
    vec = vectorizer.transform([cleaned])
    preds = model.predict(vec)[0]  # multi-label array of 0/1
    active_emotions = [
        emotion_cols[i].replace("Answer.f1.", "").replace(".raw", "")
        for i, val in enumerate(preds) if int(val) == 1
    ]
    if not active_emotions:
        active_emotions = ["neutral"]
    return {"emotions": active_emotions}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
