const handleSignin = (req, res, bcrypt, db) => {
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
}

export default handleSignin;