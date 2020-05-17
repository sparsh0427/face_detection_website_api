const express = require('express')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'root',
      database : 'Smart-Brain'
    }
  });

db.select('*').from('users').then(data => {
    console.log(data)
})  

const app = express()

app.use(express.json())
app.use(cors())

app.get('/',(req,res) => {
    res.send(database.users)
})

//sign in
app.post('/signin',(req,res) =>{
    db.select('email','hash').from('login')
    .where('email','=', req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync( req.body.password, data[0].hash)
        if(isValid){
            return db.select('*').from('users')
            .where('email','=', req.body.email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => res.status(400).json('unable to get user'))
        }
        else{
        res.status(400).json('wrong credentials')
        }

    })
    .catch(err => res.status(400).json('Wrong credentials'))
})

//register
app.post('/register',(req,res)=> {
    const {email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
        .returning('*') //This is the retuned value if response is successful
        .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
        })
            .then(user => { 
                res.json(user[0])
            })

        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
        .catch(err => res.status(400).json('unable to register'))
})

//profile/userId
app.get('/profile/:id',(req,res)=>{     //:id By typing this we can add anything eg = /profile/668 or /profile/848646
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
})

//entries
app.put('/image',(req,res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1 )
    .returning('entries')
    .then(entries => {
        res.json(entries[0])
    })
    .catch(err => res.status(400).json("Unable to get entries"))

})



// Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

app.listen(3000, () => {
    console.log("app is running on port 3000")
})

//PLANNING -->
/*
/--> res = this is working
/signin --> POST = success/fail
/-register --> POST = user
/profile/:userId --> GET = user
/image --> PUT  --> user

*/