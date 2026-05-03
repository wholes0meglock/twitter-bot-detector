// alert("CONTENT SCRIPT RUNNING");

//follower following , date of join, total num of posts

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function parsingCommasAndSymbols(StringPassed)
{
    if(typeof StringPassed != "string") return null;
    let StringToFloat = null;

    if(!StringPassed) return null;

    if(StringPassed.includes("K")) StringToFloat = parseFloat(StringPassed)*1000;

    else if(StringPassed.includes("M")) StringToFloat = parseFloat(StringPassed)*1000000;

    else
    {
    let clean = StringPassed.replace(/,/g,"");
    StringToFloat = parseFloat(clean);
    }
    return StringToFloat;
}
   
async function scrapeFollowers()
{
    const followersLink = document.querySelector('a[href*="followers"], a[href*="verified_followers"]');
    // console.log(followersLink);

    const followerCountString = followersLink?.querySelector('span span')?.innerText;
    // console.log(followerCountString);

    const followerCount = await parsingCommasAndSymbols(followerCountString);
    // console.log(followerCount);
    return followerCount;
}

async function scrapeFollowing()
{
    const followingLink = document.querySelector('a[href$="/following"]');
    const followingCountString = followingLink?.querySelector('span span')?.innerText;

    const followingCount = await parsingCommasAndSymbols(followingCountString);
    return followingCount;
}

async function scrapeTotalPosts()
{
    try
    {
    const divs = document.querySelectorAll('div[dir="ltr"]');

    for (let div of divs) {
        const text = div.innerText?.trim();

        if (!text) continue;

        const match = text.match(/^([\d,.]+)\s+posts$/i);
        if (match) {
            return await parsingCommasAndSymbols(match[1]);
        }
    }
    }
    catch(err)
    {
        return null;
    }
}


async function scrapeDateOfJoin()
{
    const dateOfJoinLink = document.querySelector('a[href$="/about"]');
    
    if(!dateOfJoinLink) return null;

    const dateOfJoinFullString = dateOfJoinLink?.querySelector('span')?.innerText;

    const splitFullString = dateOfJoinFullString?.split(" ") || [];

    const monthString = splitFullString[1];

    const yearStringCount = parseInt(splitFullString[2]);

    const monthMap = 
    {
        January : 0, 
        February : 1,
        March : 2, 
        April : 3,
        May : 4,
        June : 5, 
        July : 6,
        August : 7,
        September : 8, 
        October: 9, 
        November: 10,
        December: 11
    };
    const month = monthMap[monthString];

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();

    let years = currentYear - yearStringCount;
    let months = currentMonth - month;
    
    if(months < 0)
    {
        years--;
        months += 12;
    }
    const daysApprox = years*365 + months*30;
    return {daysApprox};
}

async function mainScrape()
{
    const path = window.location.pathname;

    const isProfile = /^\/[^/]+$/.test(path);

    if(!isProfile)
    {
      alert("not a profile twan, exiting..");
      return;
    }

    await sleep(5500);
    const followerCount = await scrapeFollowers();
    const followingCount = await scrapeFollowing();
    const TotalPosts = await scrapeTotalPosts();
    const DateOfJoin = await scrapeDateOfJoin();

    // console.log(DateOfJoin.needRecentPostCount)
    // alert(followerCount,followingCount,TotalPosts);
    console.log(followerCount,followingCount,TotalPosts);
    console.log(DateOfJoin);

    return {followerCount, followingCount, TotalPosts, DateOfJoin};
}
 
const scrapeLast90Days = async () =>
{
    await sleep(7500);
    //90 days for reference

    const cutoffTime = Date.now() - (90*24*60*60*1000);

    let done = false;

    const seenTweets = new Set();

    while(!done)
    {
        const articles = document.querySelectorAll('article');

        for(let tweet of articles)
        {
            const pinnedText = tweet?.querySelector('[data-testid="socialContext"]')?.innerText;;
            
            if(pinnedText?.includes("Pinned")) continue;

            const timeTweet = tweet?.querySelector('time');
            if(!timeTweet) continue;

            const dateTime = timeTweet.getAttribute('datetime');

            const link = tweet.querySelector('a[href*="/status/"]');
            const id = link?.href || dateTime;

            if(!id || seenTweets.has(id)) continue;

            const tweetTimeExact = new Date(dateTime).getTime();

            if(tweetTimeExact >= cutoffTime)
            {
                seenTweets.add(id);
            }
            else if(tweetTimeExact < cutoffTime)
            {
                done = true;
                break;
            }
        }
        if(done) break;

        window.scrollBy(0,1200);

        await sleep(2500);
    }


    let countTweets = seenTweets.size;
    console.log(countTweets);
    return {countTweets};
}


async function sendScrapedData()
{
    const token = crypto.randomUUID();
    chrome.storage.local.set({ token });
    
    const {followerCount, followingCount, TotalPosts, DateOfJoin} = await mainScrape();
    const countTweets = await scrapeLast90Days();

    const UserData = 
    {
        followerCount, followingCount, TotalPosts, DateOfJoin, countTweets
    }; 

    const response = await fetch("http://localhost:3000/everything",
        {
            method: "POST",
            headers = {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${token}`
            },
            body = stringify.json(UserData),
        });


    console.log(response);    
}