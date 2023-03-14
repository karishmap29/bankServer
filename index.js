// import data service file
const dataService = require('./service/dataservice')

//import cors
const cors= require("cors")

// import json web token
const jwt = require('jsonwebtoken')

// import express
const express = require("express")

//create app using express 
const app = express()

//connection string to frontend integration
app.use(cors({origin:'http://localhost:4200'}))

//to parse json data from req body(to server)
app.use(express.json()) //all datas coming to express will be converted to js from json

//middleware
const jwtMiddleware = (req, res, next) => { 
   try {
      const token = req.headers['access_token']
      //verify token
      const data = jwt.verify(token, "supersecretkey123")
      console.log("-------middleware-------- ");
      console.log(data);

      next()
   }
   catch {
      res.status(422).json({
         statusCode: 422,
         status: false,
         message: 'please login first'
      })
   }
}



//register-post
app.post('/register', (req, res) => {

   dataService.register(req.body.uname, req.body.acno, req.body.psw).then(result => {
      res.status(result.statusCode).json(result)
   })
   //convert obj to json and send as response(from server)

   //console.log(req.body);
   // res.send("success")
})

//login api
app.post('/login', (req, res) => {

   dataService.login(req.body.acno, req.body.psw).then(result => {
      res.status(result.statusCode).json(result)
   })
})
//convert obj to json and send as response(from server)

//console.log(req.body);
// res.send("success")


//deposit api 
app.post('/deposit', jwtMiddleware, (req, res) => {

   dataService.deposit(req.body.acnum, req.body.password, req.body.amount).then(result => {
      res.status(result.statusCode).json(result)
   }) 
   //convert obj to json and send as response(from server)

   //console.log(req.body);
   // res.send("success")
})

//withdraw api
app.post('/withdraw', jwtMiddleware, (req, res) => {

   dataService.withdraw(req.body.acnum, req.body.password, req.body.amount).then(result => {
      res.status(result.statusCode).json(result)
   })
   //convert obj to json and send as response(from server)

   //console.log(req.body);
   // res.send("success")
})

//getTransaction 
app.post('/transaction', jwtMiddleware, (req, res) => {

   dataService.getTransaction(req.body.acno).then(result =>{
      res.status(result.statusCode).json(result)
   })
   
})

//delete
app.delete('/delete/:acno',jwtMiddleware,(req,res)=>{
   dataService.deleteAcc(req.params.acno).then(result=>{
      res.status(result.statusCode).json(result)
   })
})
//request
// app.get('/',(req,res)=>{
//     res.send('Get Method...123')
// })
//request
// app.post('/',(req,res)=>{
//     res.send('Post Method...123')
// }) 
//request
// app.put('/',(req,res)=>{
//     res.send('Put Method...123')
// })
// //request
// app.patch('/',(req,res)=>{
//     res.send('Patch Method...123')
// })
// //request
// app.delete('/',(req,res)=>{
//     res.send('Delete Method...123')
// })



//create port 
app.listen(3000, () => { console.log("server started at port number 3000"); })
