from fastapi import FastAPI

from pydantic import BaseModel
from transformers import pipeline

import pickle

app = FastAPI()

# model = pickle.load(open("model.pkl","rb"))
# vectorizer = pickle.load(open("vectorizer.pkl","rb"))

classifier = pipeline(
    "text-classification",
    model = "bot_detector_model"
)

class InputData(BaseModel):
    followers: int
    following: int
    posts: int
    age: int

def to_text(data):
    follow_ratio = data.followers / (data.following + 1)
    posts_per_day = data.posts / (data.age + 1)

    return (
        f"Followers: {data.followers}, "
        f"Following: {data.following}, "
        f"Posts: {data.posts}, "
        f"Account age: {data.age} days, "
        f"Follow ratio: {follow_ratio:.2f}, "
        f"Posts per day: {posts_per_day:.2f}"
    )

@app.post("/predict")
def predict(data: InputData):
    text = to_text(data)

    result = classifier(text)[0]
    return {
        "label" : result["label"],
        "score" : float(result["score"])
    }