import fetch from "node-fetch";

const clarifaiEndpoint = "https://api.clarifai.com/v2/models/face-detection/versions/6dc7e46bc9124c5c8824be4822abe105/outputs";

//fetch image positions from clarifai api
const fetchImagePositions = async(req, res) => {
    const response = await fetch(clarifaiEndpoint, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Key c89051a9cd344243ba0522b9c85c855b`
    },
        body: JSON.stringify({
                "user_app_id": {
                  "user_id": "gaelxoaehons2k",
                  "app_id": "d7876ff90a064d7c85606f597b33f89c"
                },
                "inputs": [
                  {
                    "data": {
                      "image": {
                        "url": req.body.imgUrl
                      }
                    }
                  }
                ]
            })
    });
    const result = await response.text();
    const data = await JSON.parse(result, null, 2).outputs[0].data.regions;
    return res.json(data);
}

const handleImage = (req, res, db) => {
    const id = req.body.id;

    db('users')
    .where('id', '=', id)
    .increment( "entries", 1 )
    .returning("entries")
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json("unable to get entries"));
}

export { handleImage, fetchImagePositions};