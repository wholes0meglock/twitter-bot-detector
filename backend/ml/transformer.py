import pandas as pd
from datasets import Dataset
from transformers import AutoTokenizer, AutoModelForSequenceClassification, TrainingArguments, Trainer
import numpy as np
from sklearn.metrics import accuracy_score


df = pd.read_csv("processed.csv")

dataset = Dataset.from_pandas(df)


dataset = dataset.train_test_split(test_size=0.2)

tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")

def tokenize(example):
    return tokenizer(example["text"],truncation = True, padding = "max_length")

dataset = dataset.map(tokenize,batched = True)

