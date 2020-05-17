const handleProfileGet = (req,res,db)=>{     //:id By typing this we can add anything eg = /profile/668 or /profile/848646
    const { id } = req.params;
    db.select('*').from('users').where({
        id: id
    })
        .then(user =>
        {
            if(user.length){
            res.json(user[0])
            }
            else{
                res.status(400).json("Not found") 
            }
        })
        .catch(err => res.status(400).json("Error fiding user"))
}

module.exports = {
    handleProfileGet: handleProfileGet
  };