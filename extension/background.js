chrome.runtime.onMessage.addListener((message, sender, sendResponse) =>
{
    if(message.type === "GET")
    {
        async function call()
        {
            try{
            const data = await getScrapedDataAndShow();
            sendResponse({data})
            }
            catch(err)
            {
                console.error(err);
                sendResponse({"error": err})
            }
        }
        call();
        return true;
    }
})


async function getScrapedDataAndShow()
{
    const res = await fetch("http://localhost:3000/auth");

    const data = await res.json();
    console.log(data);
    const token = data.token;


    await chrome.storage.local.set({token});

    const tabs = await chrome.tabs.query({
        active : true,
        lastFocusedWindow : true
    })
    const tab = tabs[0];

    if(!tab)
    {
        throw new Error("no active tab")
    }

    const UserData = await chrome.tabs.sendMessage(
    tab.id,
    {
        type: "SCRAPE"
    }
    );
    console.log(UserData);

    const response = await fetch("http://localhost:3000/everything",
        {
            method: "POST",
            headers : {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${token}`
            },
            body : JSON.stringify({
            dataProfile: UserData.dataProfile,
            Last90DaysActivity: UserData.Last90DaysActivity
            })
        });

    return response;
}



