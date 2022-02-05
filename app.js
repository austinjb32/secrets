require('dotenv').config();
const express= require("express");
const ejs = require("ejs");
const bodyParser= require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});


userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields: ["password"]});

const User= new mongoose.model("User", userSchema);


app.route("/")

.get(function(req,res){
    res.render("home");
});

app.route("/login")

.get(function(req,res){
    res.render("login");
})

.post(function(req,res){
    const username = req.body.username;
    const password =  req.body.password;

    User.findOne({username: username},function(err,foundUser){
        if(foundUser){
            if (foundUser.password === password){
                res.render("secrets");
            }else{
                res.send("Wrong Password");
            }
        }else{
            res.send("No user found");
        }if(err){
            res.send(err);
        }
        
    });
});

app.route("/register")

.get(function(req,res){
    res.render("register");
})

.post(function(req,res){
    const newUser= new User({
        username: req.body.username,
        password: req.body.password
    });

    newUser.save(function(err){
        if(!err){
            res.render("secrets");
        }
        
    })
});

app.listen(3000,function(){
    console.log("Server started on Port 3000");
});