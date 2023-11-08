import express from "express";
import { config } from "dotenv";
import cookiParser from "cookie-parser";
import errorMidleware from "./middlewares/error.js";
import path from "path"
import { User } from "./models/userModel.js";
import ErrorHandler from "./utils/ErrorHandler.js";



const app = express();

// configuring the template engine here
app.set("view engine","ejs");

config({path:"config/config.env"})

// using midleware here
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookiParser());

// setting the static file to get served without this css will not gonna work 
app.use(express.static(path.join(path.resolve(),"public")))


app.get('/',(req,res)=>{
    res.render("login");
})

app.get('/register',(req,res)=>{
    res.render("register");
})

app.post('/api/v1/register',async (req,res)=>{
    try {
        const { name, email, password,age } = req.body;
  
        if (!name || !email || !password ||  !age) {
            return next(new ErrorHandler("please enter all fields ", 400));
        }
    
       await User.create(req.body);

    
        res.status(200).json({
            success: true,
            message: "registered",
        });
        
    } catch (error) {
        res.status(403).json({
            success:false,
            message:"hell"
        })
    }
})

app.post('/api/v1/login',async (req,res,next)=>{
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");
        if (!password || !email)
            return next(new ErrorHandler("please enter all fields",403))
        if (!user) {
            return next(new ErrorHandler("user not found",403))
        }
        const isMatched = await user.comparePassword(password);
        if (!isMatched) {
            return next(new ErrorHandler("invalid credentials", 403));
        }

        res.status(201).json({
            success:true,
            message:`welcome ${user.name}`
        })
        
    } catch (error) {
        res.status(403).json({
            success:false,
            message:"hell"
        })
    }
})


export default app;
app.use(errorMidleware);// handling custom error if there will be any we will call our custom errorHandler to show error

