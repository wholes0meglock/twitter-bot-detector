import {mainScrape,sendScrapedData} from "./content";

async function getScrapedDataAndShow()
{
    const res = await fetch("http://localhost:3000/auth");
    const {token} = await res.json();
    chrome.storage.local.set({token});
    
    const {followerCount, followingCount, TotalPosts, DateOfJoin} = await mainScrape();
    const countTweets = await scrapeLast90Days();

    const UserData = 
    {
        followerCount, followingCount, TotalPosts, DateOfJoin, countTweets
    }; 
    const response = await fetch("http://localhost:3000/everything",
        {
            method: "POST",
            headers : {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${token}`
            },
            body : stringify.json(UserData),
        });

    return response;
}

export default getScrapedDataAndShow;


