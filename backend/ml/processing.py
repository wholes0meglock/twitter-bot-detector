import pandas as pd

df = pd.read_csv("twitter_human_bots_dataset.csv")

df = df.rename(columns={
    "friends_count" : "following",
    "statuses_count" : "posts"
})

df["follow_ratio"] = df["followers_count"] / (df["following"] + 1)
df["posts_per_day"] = df["posts"] / (df["account_age_days"] + 1)



def row_to_text(row):
    return (
        f"Followers: {row['followers_count']}, "
        f"Following: {row['following']}, "
        f"Posts: {row['posts']}, "
        f"Account age: {row['account_age_days']}, "
        f"Follow ratio: {row['follow_ratio']:.2f}, "
        f"Posts per day: {row['posts_per_day']:.2f}"
    )

df["text"] = df.apply(row_to_text,axis=1)

df["label"] = df["account_type"].map({
    "human":1,
    "bot":0
})

df = df[[
    "followers_count",
    "following",
    "posts",
    "account_age_days",
    "account_type",
    "follow_ratio",
    "posts_per_day",
    "text",
    "label"
]]


# df = df[["text","label"]]

# print(df.shape)

# print(df.head)


df.to_csv("processed.csv",index = False)