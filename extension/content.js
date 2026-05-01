alert("CONTENT SCRIPT RUNNING");


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
    // const totalPostsNeighborLink = document.querySelector('h2[role="heading"]');
    // if(!totalPostsNeighborLink) return null;

    // const parent = totalPostsNeighborLink.parentElement;
    // if(!parent) return null;

    // const parentDiv = parent.querySelector('div[dir="ltr"]')
    // if(!parentDiv) return null;

    // // const totalPostsLink = totalPostsNeighborLink?.nextElementSibling;

    // const totalPostsString = parentDiv?.innerText;

    // if (typeof totalPostsString !== "string") return null;

    // const splitString = totalPostsString.split(" ")[0];

    // const totalPosts = await parsingCommasAndSymbols(splitString);
    
    // return totalPosts;


    const allDivs = document.querySelectorAll('div[dir="ltr"]');

    for(let div of allDivs)
    {
        const text = div.innerText;

        if(text && text.toLowerCase().includes("posts"))
        {
            const matches  = text.match(/[\d,.]+[KM]?/gi);
            if(!matches) return null;
            // console.log(matches);   
            return parsingCommasAndSymbols(matches[2]); //console man, if dom changes its over
        }
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
    const currentDay = now.getDay();

    let years = currentYear - yearStringCount;
    let months = currentMonth - month;
    
    if(months < 0)
    {
        years--;
        months += 12;
    }

    let needRecentPostCount = false;

    if(years === 0 && months <= 6)
    {
        needRecentPostCount = true;
    }
    return {years,months,needRecentPostCount};
}

async function main()
{
    await sleep(5500);
    const followerCount = await scrapeFollowers();
    const followingCount = await scrapeFollowing();
    const TotalPosts = await scrapeTotalPosts();
    const DateOfJoin = await scrapeDateOfJoin(); 
    // alert(followerCount,followingCount,TotalPosts);
    console.log(followerCount,followingCount,TotalPosts);
    console.log(DateOfJoin);
}
 
const scrapeLast90Days = async () =>
{

}


main();
