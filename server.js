import express, { urlencoded } from "express";
import cors from "cors";
import bcrypt from "bcrypt";
const saltRounds = 10;
import knex from "knex";
import { response } from "express";


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

// const queryResult = db.select().from("users").then(data => console.log(data));

const app = express();

app.use(urlencoded({extended:false}));
app.use(express.json());
app.use(cors());

//routes
app.get("/", (req, res) => {
    res.send("Hi Mom!");
});

app.post("/signin", (req, res) => {
    const { email, password } = req.body; 

    db.select("email", "hash").from("login")
    .where("email", "=", email)
    .then( data => {
        const hash = data[0].hash;
        bcrypt.compare(password, hash, function(err, result) {
            if ( result ) {
                return db.select("*").from("users").where("email", "=", email)
                .then(user => {
                    res.json(user[0]);
                })
            } else {
                return res.status(400).json("authentication failed");
            }
        })
    })
    .catch(err => res.status(400).json("wrong credentials"));
});

app.post("/register", (req, res) => {
    const { email, password, name } = req.body;
    console.log(email, password, name);

    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            // Store hash in your password DB.
            db.transaction(trx => {
                trx.insert({
                    hash: hash, 
                    email: email
                })
                .into("login")
                .returning("email")
                .then (loginEmail => {
                    trx("users")
                    .returning("*")
                    .insert({
                        email: loginEmail[0].email,
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0]);
                    })                    
                })
                .then(trx.commit)
                .catch(trx.rollback)
            })
            .catch(err => {
                res.status(400).json("unable to register");
            });
        });
    });
});

app.get("/profile/:id", (req, res) => {
    const id = req.params.id;
    db.select("*").from("users").where({
        id: id
    })
    .then(user => {
        if (user.length) {
            res.json(user[0]);
        } else {
            res.json("Not found");
        }
    })
    .catch(err => res.status(400).json("error getting user"));
});

app.put("/image", (req, res) => {
    const id = req.body.id;

    db('users')
    .where('id', '=', id)
    .increment( "entries", 1 )
    .returning("entries")
    .then(entries => {
        res.json(entries[0]);
        // res.json(entries[0].entries); breaking to make
    })
    .catch(err => res.status(400).json("unable to get entries"));
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