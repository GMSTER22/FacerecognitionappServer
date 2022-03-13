import express from "express";

const handleRegister = (req, res, db, bcrypt, saltRounds) => {
    const { email, password, name } = req.body;

    if (!email || !name || !password ) {
        return res.status(400).json("incorect form submission");
    }

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
}

export default handleRegister;