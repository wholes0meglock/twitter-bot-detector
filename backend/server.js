import express from "express"
import cors from "cors"

const app = express();

const allowedOrigins = [
  "chrome://extensions/bkjnobdjfelpdikpabfbcjfnodgopoob",
  "brave://extensions/bkjnobdjfelpdikpabfbcjfnodgopoob"
];

app.use(cors
  ({
    origin: function(origin,callback)
    {
      if(!origin || allowedOrigins.includes(origin))
      {
        callback(null,true);
      }
      else
      {
        callback(new Error("Not allowed from another origin."));
      }
    }
  })
);



import userRoute from "./route/everything";

import cookieParser from "cookie-parser";

import auth from "./route/auth";

app.get("/", (req,res) =>
{
    res.send("working");   
})

app.use((req, res, next) => {
    let date = new Date();
    console.log(`${req.method} ${req.url} ${date}`);
    next();
});

app.use("/everything", everything);
app.use("/auth",auth)

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
