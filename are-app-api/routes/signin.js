const express = require("express");
const jwt = require("jsonwebtoken");
const md5 = require("md5");

const router = express.Router();
const User = require("../models/users");

const jwt_secret = "we_are_family";



// singin user
router.post("/user", (req, resp) => {
  const { username, password } = req.body;

  if (!username || !password)
    return resp.status(422).json({ error: "missing fields" });

  User.findOne({ username: username }).then((existingUser) => {
    if (existingUser) {
      const hashedPassword = md5(password);
      if (hashedPassword === existingUser.password) {
        token = jwt.sign({ id: existingUser._id }, jwt_secret);
        existingUser.password = undefined
        return resp.json({ token: token,id:existingUser._id });
      } else return resp.status(422).json({ error: "Invalid Credentials" });
    } else return resp.status(422).json({ error: "Invalid Credentials" });
  });
});


// sigin admin

router.post("/admin",(req,resp)=>{
    const {username, password} = req.body
    if(!username || !password) return resp.status(422).json({error:"missing fields"})
    if(username === "admin" && password==="admin"){
        return resp.json({admin:true,username:username})
    }
    else return resp.status(422).json({error:"Invalid Credentials"})
})
module.exports = router