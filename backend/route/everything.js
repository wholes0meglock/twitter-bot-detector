import express from "express"
import { Router } from "express"
// import modelDB from "../modelDB/UserToken"
import auth from "../middleware/auth"

const router = Router();

router.post("/", auth, async(req,res) =>
{
    const {followerCount, followingCount, TotalPosts, DateOfJoin, countTweets} = req.body;

    if(!followerCount || !followerCount || !TotalPosts || !DateOfJoin || !countTweets)
    {
        return res.json("invalid data fetched");
    }


    
})



module.exports(router);