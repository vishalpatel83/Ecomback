const express=require("express");
const router=express.Router();
const {signout,signup,signin, isSignedIn}=require("../controllers/auth");
const {check,validationResult}=require('express-validator');
router.post("/signup",[
    check("name","name should be atleast 3 char").isLength({min:3}),
    check("email","email is required").isEmail(),
    check("password","password should be at least 3 charcter").isLength({min:3})
],
signup)
router.post("/signin",[
    check("email","email is required").isEmail(),
    check("password","password is rquired").isLength({min:3})
],
signin)
router.get("/signout",signout)
router.get("/testRoute",isSignedIn,(req,res)=>{
    res.json(req.auth)
})

module.exports=router;  