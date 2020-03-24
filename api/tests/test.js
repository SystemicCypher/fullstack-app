var expect = require('chai').expect
var request = require('supertest');
const jwt = require('jsonwebtoken')
const server =  require('../index.js');

const secret = 'quiet'

describe('Smart Pump API Tests', function(){

    
    var srv = request('http://localhost:5000')
    var token;
    var guid;

    it ('Register new account', function(done){
        srv.post('/api/register')
        .set("Content-type", "application/x-www-form-urlencoded")
        .send({
            email : 'john.smith@gmail.com',
            password : '12345',
            fname : 'John',
            lname : 'Smith',
            companyName : 'Virginia Company',
            phone : '1 (234) 567-8900',
            address : '1 Settlement Rd., Jamestown, VA, 00001'
        })
        .expect(201, function(err, res){
            if(err) return done(err);
            done();
        })
    })

    it ('Cannot register account with same email', function(done){
        srv.post('/api/register')
        .set("Content-type", "application/x-www-form-urlencoded")
        .send({
            email : 'john.smith@gmail.com',
            password : '12345',
            fname : 'John',
            lname : 'Smith',
            companyName : 'Virginia Company',
            phone : '1 (234) 567-8900',
            address : '1 Settlement Rd., Jamestown, VA, 00001'
        })
        .expect(409, function(err, res){
            if(err) return done(err);
            expect(res.text).to.equal('duplicate account')
            done();
        })
    })

    it('Receive a token on successful login', function(done){
        srv.post('/api/login')
        .set("Content-type", "application/x-www-form-urlencoded")
        .send({
            email : 'john.smith@gmail.com',
            password : '12345'
        })
        .expect(200, function(err, res){
            if(err) return done(err);
            expect(res.text).to.not.equal('login failed')
            token = res.text
            done()
        })
    })

    describe('Reject bad credentials', function(){
        it('Username', function(done){
            srv.post('/api/login')
            .set("Content-type", "application/x-www-form-urlencoded")
            .send({
                email : 'gsdgfjsd@gmail.com',
                password : '12345'
            })
            .expect(400, function(err, res){
                if(err) return done(err);
                expect(res.text).to.equal('login failed')
                done()
            })
        })
    
        it('Password', function(done){
            srv.post('/api/login')
            .set("Content-type", "application/x-www-form-urlencoded")
            .send({
                email : 'abc@gmail.com',
                password : '1345'
            })
            .expect(400, function(err, res){
                if(err) return done(err);
                expect(res.text).to.equal('login failed')
                done()
            })
        })
    })

    it("Can access user's data", function(done){
        guid = jwt.decode(token).guid
        srv.get('/api/user/' + guid + "?token=" + token)
        .expect(200, function(err, res){
            if(err) return done(err);
            expect(res.body).to.not.equal(null)
            expect(res.body.guid).to.equal(guid)
            done();
        })
    })

    it("Can edit user data if verified", function(done){
        srv.put('/api/user/' + guid + '/edit/age' + "?token=" + token)
        .set("Content-type", "application/x-www-form-urlencoded")
        .send({
            newData : 30
        })
        .expect(200)
        done()
    })

    it("Can't edit user data if not verified", function(done){
        srv.put('/api/user/' + guid + '/edit/age' + "?token=hkshfuiwhfkjsd.483573489573.werwer" )
        .set("Content-type", "application/x-www-form-urlencoded")
        .send({
            newData : 40
        })
        .expect(401)
        done()
    })

    describe('User Data Editing',  function(){
        it("Age", function(done){
            srv.put('/api/user/' + guid + '/edit/age' + "?token=" + token)
            .set("Content-type", "application/x-www-form-urlencoded")
            .send({
                newData : 70
            })
            .expect(200)
            done()
        })

        it("Age no data", function(done){
            srv.put('/api/user/' + guid + '/edit/age' + "?token=" + token)
            .set("Content-type", "application/x-www-form-urlencoded")
            .send({
                newData : null
            })
            .expect(400)
            done()
        })
        it("First name", function(done){
            srv.put('/api/user/' + guid + '/edit/firstName' + "?token=" + token)
            .set("Content-type", "application/x-www-form-urlencoded")
            .send({
                newData : 'Johnny'
            })
            .expect(200)
            done()
        })
        it("First name no data", function(done){
            srv.put('/api/user/' + guid + '/edit/firstName' + "?token=" + token)
            .set("Content-type", "application/x-www-form-urlencoded")
            .send({
                newData : null
            })
            .expect(400)
            done()
        })
        it("Last name", function(done){
            srv.put('/api/user/' + guid + '/edit/lastName' + "?token=" + token)
            .set("Content-type", "application/x-www-form-urlencoded")
            .send({
                newData : 'Smithy'
            })
            .expect(200)
            done()
        })
        it("Last name no data", function(done){
            srv.put('/api/user/' + guid + '/edit/lastName' + "?token=" + token)
            .set("Content-type", "application/x-www-form-urlencoded")
            .send({
                newData : null
            })
            .expect(400)
            done()
        })

        it("Picture", function(done){
            srv.put('/api/user/' + guid + '/edit/picture' + "?token=" + token)
            .set("Content-type", "application/x-www-form-urlencoded")
            .send({
                newData : 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRXi6Z7MZ5GAHbQXw0mK88IAzDMkRAvZGqiGsYxoPDYEicliykT'
            })
            .expect(200)
            done()
        })
        it("Picture no data", function(done){
            srv.put('/api/user/' + guid + '/edit/picture' + "?token=" + token)
            .set("Content-type", "application/x-www-form-urlencoded")
            .send({
                newData : null
            })
            .expect(400)
            done()
        })
        it("Address", function(done){
            srv.put('/api/user/' + guid + '/edit/address' + "?token=" + token)
            .set("Content-type", "application/x-www-form-urlencoded")
            .send({
                newData : '1322 Anystreet Way, Beach City, CA, 99999'
            })
            .expect(200)
            done()
        })
        it("Address no data", function(done){
            srv.put('/api/user/' + guid + '/edit/address' + "?token=" + token)
            .set("Content-type", "application/x-www-form-urlencoded")
            .send({
                newData : null
            })
            .expect(400)
            done()
        })
        it("Company", function(done){
            srv.put('/api/user/' + guid + '/edit/company' + "?token=" + token)
            .set("Content-type", "application/x-www-form-urlencoded")
            .send({
                newData : 'BizCo'
            })
            .expect(200)
            done()
        })
        it("Company no data", function(done){
            srv.put('/api/user/' + guid + '/edit/company' + "?token=" + token)
            .set("Content-type", "application/x-www-form-urlencoded")
            .send({
                newData : null
            })
            .expect(400)
            done()
        })
        it("Eye color", function(done){
            srv.put('/api/user/' + guid + '/edit/eyeColor' + "?token=" + token)
            .set("Content-type", "application/x-www-form-urlencoded")
            .send({
                newData : 'green'
            })
            .expect(200)
            done()
        })
        it("Eye color no data", function(done){
            srv.put('/api/user/' + guid + '/edit/eyeColor' + "?token=" + token)
            .set("Content-type", "application/x-www-form-urlencoded")
            .send({
                newData : null
            })
            .expect(400)
            done()
        })
    })
});
