import express from "express"
import cors from "cors"
import userRoute from "./route/everything.js";
import dotenv from "dotenv";
dotenv.config();
// import cookieParser from "cookie-parser";
import auth from "./route/auth.js";


const app = express();
app.use(express.json())

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

app.get("/", (req,res) =>
{
    res.send("working");   
})

app.use((req, res, next) => {
    let date = new Date();
    console.log(`${req.method} ${req.url} ${date}`);
    next();
});

app.use("/everything", userRoute);
app.use("/auth",auth)

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
