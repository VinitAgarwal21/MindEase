import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
from sklearn.multiclass import OneVsRestClassifier
import joblib
import json
import spacy

# 1) Load spaCy model
print("Loading spaCy model...")
nlp = spacy.load("en_core_web_sm")

# 2) Load your dataset
print("Loading dataset...")
df = pd.read_csv(r"C:\Users\vinit\Downloads\data.csv")  # change path if needed

# 3) Identify emotion columns
emotion_cols = [col for col in df.columns if col.startswith("Answer.f1.")]
print("Emotion columns found:", emotion_cols)

# 4) Preprocess text
def preprocess_text(text):
    doc = nlp(str(text).lower())
    tokens = [
        token.lemma_
        for token in doc
        if token.is_alpha and not token.is_stop and not token.is_punct
    ]
    return " ".join(tokens)

print("Cleaning text...")
df["clean_text"] = df["Answer"].apply(preprocess_text)

# 5) Features & labels
X = df["clean_text"]
y = df[emotion_cols].astype(int)   # Convert True/False → 1/0

# 6) Train/test split
print("Splitting data...")
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 7) TF-IDF vectorizer
print("Vectorizing text...")
vectorizer = TfidfVectorizer(max_features=10000, ngram_range=(1, 2))
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# 8) Train model
print("Training model...")
model = OneVsRestClassifier(
    LogisticRegression(max_iter=500, class_weight='balanced')
)
model.fit(X_train_vec, y_train)

# 9) Evaluate (just to see it works)
print("Evaluating...")
y_pred = model.predict(X_test_vec)
print("Sample Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n")
print(classification_report(y_test, y_pred, target_names=emotion_cols))

# 10) SAVE ARTIFACTS HERE 🔥
print("Saving model, vectorizer, and emotion columns...")

joblib.dump(model, "model.joblib")
joblib.dump(vectorizer, "vectorizer.joblib")

with open("emotion_cols.json", "w") as f:
    json.dump(emotion_cols, f)

print("Done! Files saved as:")
print(" - model.joblib")
print(" - vectorizer.joblib")
print(" - emotion_cols.json")
