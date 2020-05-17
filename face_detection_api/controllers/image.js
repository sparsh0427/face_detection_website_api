const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: 'f6ac7de059104c21b4a5534b935ad951'
  })

  const handleApiCall = (req,res) => {
  app.models.predict(
    Clarifai.FACE_DETECT_MODEL,
    req.body.input     //if we had written = this.state.imageUrl because that is of the way setState works 
    )
    .then(data => {
            res.json(data);
    })
    .catch(err => res.status(400).json('Unable to work with api'))
  }

const handleImage = (req,res,db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1 )
    .returning('entries')
    .then(entries => {
        res.json(entries[0])
    })
    .catch(err => res.status(400).json("Unable to get entries"))

}

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
  };