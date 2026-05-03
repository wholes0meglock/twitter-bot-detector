import pandas as pd

df = pd.read_csv("twitter_human_bots_dataset.csv")

df = df[[
    "followers_count",
    "friends_count",
    "statuses_count",
    "account_age_days",
    "account_type"
]]

df.rename(columns={
    "friends_count" : "following",
    "statuses_count" : "posts"
})

