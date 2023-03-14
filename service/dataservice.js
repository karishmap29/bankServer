const jwt = require('jsonwebtoken')
const db = require('./db.js')

// userDetails={
//     1000:{acno:1000,username:"anu",password:"abc123",balance:0,transaction:[]},
//     1001:{acno:1001,username:"amal",password:"abc123",balance:0,transaction:[]},
//     1002:{acno:1002,username:"arun",password:"abc123",balance:0,transaction:[]},
//     1003:{acno:1003,username:"akil",password:"abc123",balance:0,transaction:[]}

//   }

register = (uname, acno, psw) => {
  // if (acno in userDetails){  //use return coz the o/p shud go to the one who called register fnc
  return db.User.findOne({ acno }).then(user => {
    if (user) {
      //findOne is asynchronous.hence the whole fnc register becomes asynchronous.so we cant store its result in a variable.so use .then in the index file whr register is called
      return {
        status: false,
        message: 'user already present',
        statusCode: 401
      }
    }
    else {
      //create a new user obj in db
      const newuser = new db.User({
        acno,
        username: uname,
        password: psw,
        balance: 0,
        transaction: []
      })
      //save in db
      newuser.save()

      return {
        status: true,
        message: 'register success',
        statusCode: 200
      }
    }

  })
}



login = (acno, psw) => {
  //if (acno in userDetails) {
  return db.User.findOne({ acno, password: psw }).then(user => {
    if (user) {
      currentUser = user.username
      //console.log(this.currentUser);
      currentAcno = acno
      const token = jwt.sign({ currentAcno }, "supersecretkey123")
      return {
        status: true,
        message: 'login success',
        statusCode: 200,
        currentUser,
        currentAcno,
        token
      }
    }
    else {
      return {
        status: false,
        message: 'incorrect a/c number or password',
        statusCode: 401
      }
    }
  })
}


deposit = (acnum, password, amount) => {
  //convert string amount to number
  var amnt = parseInt(amount) //amnt is taken from input. hence it will be string type. to do mathematical operations we need to convert to int.
  return db.User.findOne({ acno: acnum, password }).then(user => {
    if (user) {
      user.balance += amnt
      user.transaction.push({ Type: "CREDIT", amount: amnt })
      user.save()
      return {
        status: true,
        message: `${amnt} is credited to your ac and the balance is ${user.balance}`,
        statusCode: 200,
      }
    }
    else {
      return {
        status: false,
        message: 'Incorrect a/c no or password',
        statusCode: 401
      }
    }
  })
}


withdraw = (acnum, password, amount) => {
  //convert string amount to number
  var amnt = parseInt(amount)
  return db.User.findOne({ acno: acnum, password }).then(user => {
    if (user) {
      if (amnt <= user.balance) {
        user.balance -= amnt
        user.transaction.push({ Type: "DEBIT", amount: amnt })
        user.save()
        return {
          status: true,
          message: `${amnt} is debited from your ac and the balance is ${user.balance}`,
          statusCode: 200,

        }
      }
      else {
        return {
          status: false,
          message: 'Insufficient balance',
          statusCode: 401
        }

      }
    }
    else {
      return {
        status: false,
        message: 'Incorrect password',
        statusCode: 401
      }
    }
  })
}

getTransaction = (acno) => {
  return db.User.findOne({acno}).then(user=>{
    if(user){
      return {
        status: true,
        statusCode: 200,
        transaction: user.transaction
      }
    }
  })
  
}

deleteAcc=(acno)=>{
  return db.User.deleteOne({acno}).then(user=>{
     if(user){
        return{
           status:true,
           statusCode:200,
           message:'account deleted'
        }
     }
     else{
        return{
           status:false,
           message:'user not exist',
           statusCode:401
        }
     }
  })
}
module.exports = {
  register,
  login,
  deposit,
  withdraw,
  getTransaction,
  deleteAcc
} 