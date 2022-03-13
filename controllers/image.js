const handleImage = (req, res, db) => {
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
}

export default handleImage;