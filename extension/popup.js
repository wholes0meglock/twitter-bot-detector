
async function show()
{
    try{
    const response = await chrome.runtime.sendMessage({
    type: "GET"
    });
    if(response && response.data)
    {
    document.getElementById("text").innerText = JSON.stringify(response.data, null, 2);
    }
    else
    {
    document.getElementById("text").innerText = "Error"
    }}
    catch(err)
    {
        console.error("Popup communication failed:", err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    show();
});