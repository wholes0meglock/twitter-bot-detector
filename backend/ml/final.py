import pickle

model = pickle.load(open("model.pkl","rb"))

vectorizer = pickle.load(open("vectorizer.pkl","rb"))

sample = ["Followers: 10, Following: 5000, Posts: 20000, Account age: 5 days, Follow ratio: 0.00, Posts per day: 4000"]


sample_vector = vectorizer.transform(sample)
prediction = model.predict(sample_vector)