// Express framework
const express = require('express')
// Database library
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
// GUID generation
const uuid = require('uuid')
// JSON Web Token 
const jwt = require('jsonwebtoken')
// ID hash - not secure
const hasher = require('object-hash')
// Hashing and salting passwords
const crypto = require('crypto');
// Allow cross origin
var cors = require('cors')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// The JWT secret (this is not secure - just for demonstration purposes)
const secret = 'quiet'

const adapter = new FileAsync('../data/users.json')
low(adapter)
.then(db => {   
    app.options('*', cors())
    /*
        User Login
        -------------------
        Request-Type: POST
        Description:
            Locates user by their username (email in this case)
            and then compares the password they sent to the hashed
            password in the database. If successful, it will send 
            a JWT to the user and set them as active, otherwise it will send an error.
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        Body: 
            username - the user's email
            password - the user's plaintext password
        Parameters: not used
        Query: not used

    */
    app.post('/api/login', cors(), function(req, res){
        // get user
        const response = db.get('users').filter({'email' : req.body.email}).take(1).value()
        
        // if user not found
        if(response[0] == null){
            res.status(400).send('login failed')
        }
        else{
            //password compare
            var hash = crypto.createHmac('sha1', response[0].salt)
            hash.update(req.body.password)
            var password = hash.digest('hex')

            // correct password
            if(password === response[0].password){
                db.get('users').find({'guid' : response[0].guid}).assign({'isActive' : true}).write()
                var token = jwt.sign({'guid' : response[0].guid}, secret, {expiresIn : '1hr'})
                res.send(token)
            }
            // password not right
            else{
                res.status(400).send('login failed')
            }
        }
        
    })

    /*
        User Registration
        -------------------
        Request-Type: POST
        Description:
            Add new user to the database and stores their hashed and
            salted password. Also stores the rest of the data.

        Note: Passwords hashed with SHA-1 are not safe, SHA-512 is recommended
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        Body: 
            email - user's email/username
            password - user's plaintext password
            fname - user's first name
            lname - user's last name
            companyName - user's company name
            phone - user's phone number
            address - user's address
        Parameters: not used
        Query: not used 
    
    */
    app.post('/api/register', cors(), function(req, res){
        const usr = db.get('users').filter({'email' : req.body.email}).value()
        if(usr[0] != undefined){
            res.status(409).send('duplicate account')
        }
        else{   
            // Generating salt
            const salty = crypto.randomBytes(Math.ceil(10/2)).toString('hex').slice(0,10)
            
            // hash with salt
            var hash = crypto.createHmac('sha1', salty)
            hash.update(req.body.password)
            var password = hash.digest('hex')
            
            //add to db
            db.get('users').push({
                //internal db identifier
                '_id' : hasher(req.body.email).slice(0,24),
                //unique id user can see
                'guid' : uuid.v4(), 
                //is the user online right now
                'isActive' : false,
                //Account balance
                'balance' : '$0.00',
                //User's picture
                'picture' : 'http://placehold.it/32x32',
                'age' : 'Not given',
                'eyeColor' : 'Not given',
                'name' : {
                    'first' : req.body.fname,
                    'last' : req.body.lname
                },
                'company' : req.body.companyName, 
                // the user's "username"
                'email' : req.body.email,
                //The password's salt
                'salt' : salty, 
                // Password - hashed in sha-1 w/salt - it's not safe for production
                'password' : password,
                // The user's phone number
                'phone' : req.body.phone,
                // The user's address
                'address' : req.body.address
            }).write()
            res.status(201).end()
        }
    })

    /*
        JWT Verification Middleware
        ------------------------------
        Request-Type: GET
        Description:
            Catches get request for user info / edits and
            blocks if not authorized to get in.

            The routes below this are called in next()
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        Body: not used
        Parameters: userID - the user's guid
        Query: token - the active JWT 
    */
    app.all('/api/user/:userId', cors(), function(req, res, next){
        try{
            var verif = jwt.verify(req.query.token.toString(), secret)
            if(verif.guid == req.params.userId){
                next()
            }
            else{
                res.status(401).send('Not authorized')
            }
        } catch(err){
            res.status(400).send(err)
        }
        
    })

    /*
        User Data
        -------------------
        Request-Type: GET
        Description:
            Locates user by their user ID and sends the data to
            the front-end to be displayed to the user.  
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        Body: not used
        Parameters: userID - the user's guid
        Query: not used
    */
    app.get('/api/user/:userId', cors(), function(req, res){
        var userData = db.get('users').filter({'guid' : req.params.userId}).value()
        const info = userData[0]
        res.json({
            "guid": info.guid,
            "isActive": info.isActive,
            "balance": info.balance,
            "picture": info.picture,
            "age": info.age,
            "eyeColor": info.eyeColor,
            "name": {
              "first": info.name.first,
              "last": info.name.last
            },
            "company": info.company,
            "email": info.email,
            "phone": info.phone,
            "address": info.address
          })
    })

    /*
        User Logout
        ------------------------------
        Request-Type: POST
        Description:
            Sets the user's active status to false
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        Body: not used
        Parameters: userID - the user's guid
        Query: not used 
    */
    app.post('/api/user/:userId/logout', cors(), function(req,res){
        db.get('users').find({'guid' : req.params.userId}).assign({'isActive' : false}).write()
        res.send('logged out')
    })
    
    /*
        Data Editing Routes
        ------------------------------
        Request-Type: PUT
        Description:
            Edits user data
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        Body: newData - the new data to replace the old data in the database
        Parameters: not used at this step
        Query: not used 
    */
    app.put('/api/user/:userId/edit/age', cors(), function(req, res){
        if(req.body.newData == 'null'){
            res.status(400).send('missing data')
        }
        else{
            db.get('users').find({'guid' : req.params.userId}).assign({'age' : parseInt(req.body.newData)}).write()
            res.status(200).end()
        }
    })
    app.put('/api/user/:userId/edit/picture', cors(), function(req, res){
        if(req.body.newData == 'null'){
            res.status(400).send('missing data')
        }
        else{
            db.get('users').find({'guid' : req.params.userId}).assign({'picture' : req.body.newData}).write()
            res.status(200).end()
        }
    })
    app.put('/api/user/:userId/edit/eyeColor', cors(), function(req, res){
        if(req.body.newData == 'null'){
            res.status(400).send('missing data')
        }
        else{
            db.get('users').find({'guid' : req.params.userId}).assign({'eyeColor' : req.body.newData}).write()
            res.status(200).end()
        }
    })
    app.put('/api/user/:userId/edit/firstName', cors(), function(req, res){
        if(req.body.newData == 'null'){
            res.status(400).send('missing data')
        }
        else{
            db.get('users').find({'guid' : req.params.userId}).get('name').assign({'first' : req.body.newData}).write()
            res.status(200).end()
        }
    })
    app.put('/api/user/:userId/edit/lastName', cors(), function(req, res){
        if(req.body.newData === 'null'){
            res.status(400).send('missing data')
        }
        else{
            db.get('users').find({'guid' : req.params.userId}).get('name').assign({'last' : req.body.newData}).write()
            res.status(200).end()
        }
    })
    app.put('/api/user/:userId/edit/company', cors(), function(req, res){
        if(req.body.newData === 'null'){
            res.status(400).send('missing data')
        }
        else{
            db.get('users').find({'guid' : req.params.userId}).assign({'company' : req.body.newData}).write()
            res.status(200).end()
        }
    })
    app.put('/api/user/:userId/edit/phone', cors(), function(req, res){
        if(req.body.newData === 'null'){
            res.status(400).send('missing data')
        }
        else{
            db.get('users').find({'guid' : req.params.userId}).assign({'phone' : req.body.newData}).write()
            res.status(200).end()
        }
    })
    app.put('/api/user/:userId/edit/address', cors(), function(req, res){
        if(req.body.newData === 'null'){
            res.status(400).send('missing data')
        }
        else{
            db.get('users').find({'guid' : req.params.userId}).assign({'address' : req.body.newData}).write()
            res.status(200).end()
        }
    })
    app.put('/api/user/:userId/edit/email', cors(), function(req, res){
        if(req.body.newData === 'null'){
            res.status(400).send('missing data')
        }
        else{
            db.get('users').find({'guid' : req.params.userId}).assign({'email' : req.body.newData}).write()
            res.status(200).end()
        }
    })

    //Admin route for API testing
    // Edit balance
    app.put('/api/admin/:userId/edit/balance', cors(), function(req, res){
        db.get('users').find({'guid' : req.params.userId}).assign({'balance' : req.body.newData}).write()
        res.status(200).end()
    })
    
    // Start listening @ port 5000
    app.listen(5000, ()=>{console.log('Connect at localhost:5000')});    
})
