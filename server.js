import express, { urlencoded } from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import "dotenv/config";
const saltRounds = 10;

// console.log(process.env.SECRET_KEY)

const app = express();

app.use(urlencoded({extended:false}));
app.use(express.json());
app.use(cors());

const database = {
    users: [
        {
            id: 2123154651,
            name: "John",
            email: "john44@gmail.com",
            password: "cookies@22",
            entries: 0,
            joined: new Date()
        },
        {
            id: 2123189662,
            name: "Mike",
            email: "mike44@gmail.com",
            password: "chocolate1",
            entries: 0,
            joined: new Date()
        }
    ]
}


//routes
app.get("/", (req, res) => {
    res.json(database.users);
});

app.post("/signin", (req, res) => {
    // console.log(req.body);
    const { email, password } = req.body; 
    // console.log(email, password)
    if (email === database.users[1].email && password === database.users[1].password) {
        res.json("success");
    } else {
        res.status(400).send("error");
    }
});

app.post("/register", (req, res) => {
    const { email, password } = req.body;
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            // Store hash in your password DB.
            console.log(hash);
            console.log(password);
        });
    });
    res.send("Save user information");
});

app.get("/profile/:id", (req, res) => {
    const id = req.params.id;
    res.send("Getting profile with id" + " " + id);
});

app.put("/image", (req, res) => {
    res.send("Update image");
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