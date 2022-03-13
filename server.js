import express, { urlencoded } from "express";
import cors from "cors";
import bcrypt from "bcrypt";
const saltRounds = 10;
import knex from "knex";
import handleRegister from "./controllers/register.js";
import handleSignin from "./controllers/signin.js";
import handleProfileGet from "./controllers/profile.js";
import { handleImage, fetchImagePositions } from "./controllers/image.js";


const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'test',
      database : 'facerecognitionapp'
    }
});

const app = express();

app.use(urlencoded({extended:false}));
app.use(express.json());
app.use(cors());

//routes
app.get("/", (req, res) => {
    res.send("Hi Mom!");
});

app.post("/signin", (req, res) => handleSignin(req, res, bcrypt, db));

app.post("/register", (req, res) => { handleRegister(req, res, db, bcrypt, saltRounds) });

app.get("/profile/:id", (req, res) => handleProfileGet(req, res, db));

app.put("/image", (req, res) => handleImage(req, res, db));
app.post("/image", (req, res) => {
    fetchImagePositions(req, res)
});

//app listening
app.listen(3000, ()=> {
    console.log("server is up and running");
});

/*
/signin           --->  POST = success/fail
/register         --->  POST = user
/profile/:userId  --->  GET = user
/image            --->  PUT = user
*/