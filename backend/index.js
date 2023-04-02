const express = require("express")
const pool = require("./config")
var cors = require('cors')
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors())
// Statics
app.use(express.static('static'))

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//login
const jwtToken = "My JWT T0K3N"

app.post("/login", async function(req, res, next) {
  console.log()
  const {username, password} = req.body;

  const [rows, fields] = await pool.query('SELECT * FROM user_account WHERE username = ?',
  [username])

  if(rows.length == 0){
    return res.json({status: 'notFound'})
  }
  else{
    const isMatch = await bcrypt.compare(password, rows[0].password)
    if(isMatch === false){
      return res.json({status: "notFound"})
    }
    else{
      var token = jwt.sign({user_id: rows[0].user_id, username: username}, jwtToken, {expiresIn: '24h'});
      return res.json({status: 'success', token})
    }
  }
});

//register
app.post("/register", async function(req, res, next) {
  console.log("this is register");
  console.log(req.body);
  const conn = await pool.getConnection()
  await conn.beginTransaction()
  try{
    const { fname, lname, username, password} = req.body;

    //check user input
    if(!(fname && lname && username && password)){
      return res.json({status: "All input is required"});
    }

    //check if username already exist
    const [rows, fields] = await conn.query('SELECT * FROM user_account WHERE username = ?;',
    [username])

    if(rows.length > 0){
      return res.json({status: "This username already in use"});
    }

    //Encrypt password
    const hashPassword = await bcrypt.hash(password, 10);

    //Save user data in db
    const  [rows1, fields1] = await conn.query('INSERT INTO user_account (fname, lname, username, password) VALUES(?, ?, ?, ?)',
      [fname, lname, username, hashPassword]
    )
    await conn.commit();
    return res.json({status: 'success'});

  }catch(err){
    console.log(err);
    await conn.rollback();
  }finally{
    await conn.release();
  }
});


//login with token
app.post('/authen', async function(req, res, next){
  try{
    const token = req.body.token;
    var decoded = jwt.verify(token, jwtToken);
    res.json({status: "ok", decoded})
  }catch(err){
    res.json({status: "expired"})
  }
  
})

app.get("/userAccount", async function(req, res, next) {
  
  //transaction
  const conn = await pool.getConnection()
  await conn.beginTransaction()

  try{
      //if success commit
      const [rows, fields] = await conn.query('SELECT * FROM user_account')
      await conn.commit();
      res.json(rows);
  }
  catch(err){
      //if error rollback
      console.log(err)
      await conn.rollback();
  }
  finally{
      //release transaction
      await conn.release();
  }
});


//get bank accout with username
app.post('/bankAccount', async function(req, res, next){
  const conn = await pool.getConnection()
  await conn.beginTransaction()
  const user_id = req.body.user_id;
  try{
      const [rows, fields] = await conn.query('SELECT * FROM user_account JOIN bank_account USING(user_id) WHERE user_id = ?', 
      [user_id])
      await conn.commit();
      res.json({status: 'success', bank_account: rows});
  }
  catch(err){
      //if error rollback
      console.log(err)
      await conn.rollback();
  }
  finally{
      //release transaction
      await conn.release();
  }
  
})

//create bank account
app.post("/createBankAccount", async function(req, res, next) {
  const conn = await pool.getConnection()
  await conn.beginTransaction()
  const { user_id, balance, type} = req.body;

  try{

    //check user input
    if(!(balance && type && user_id)){
      return res.json({status: "All input is required"});
    }

    //generate Account number
    while(true){
      var number = Math.floor(Math.random() * 9000000000) + 1000000000;
      const [rows, fields] = await conn.query('SELECT * FROM bank_account WHERE account_number = ?',
      [number])

      if(rows.length == 0){
        break;
      }
    }

    //create account in database
    const [rows2, fields2] = await conn.query('INSERT INTO bank_account (user_id, balance, account_number, account_type) VALUES(?, ?, ?, ?)',
    [user_id, balance, number, type])

    await conn.commit();
    return res.json({status: 'success'});

  }catch(err){
    console.log(err);
    await conn.rollback();
  }finally{
    await conn.release();
  }
});

//deposit
app.put("/deposit", async function(req, res, next){
  const conn = await pool.getConnection()
  await conn.beginTransaction()
  const { account_id, money} = req.body;

  try{

    //check user input
    if(!(account_id && money)){
      return res.json({status: "All input is required"});
    }

    //get account balance
    const [rows, fields] = await conn.query('SELECT balance FROM bank_account WHERE account_id = ?',
    [account_id])

    //cal new balance
    var new_balance = (parseFloat(rows[0].balance) + parseFloat(money)).toFixed(2);
    
    //update balance in database
    const [rows2, fields2] = await conn.query('UPDATE bank_account SET balance = ? WHERE account_id = ?',
    [new_balance, account_id])

    //update transaction
    const [rows3, fields3] = await conn.query('INSERT INTO transaction(account_id, transaction_type, money, date) VALUES(?, "deposit", ?, CURRENT_TIMESTAMP)', 
    [account_id, money])

    await conn.commit();
    return res.json({status: 'success'});

  }catch(err){
    console.log(err);
    await conn.rollback();
  }finally{
    await conn.release();
  }
});

//withdraw
app.put("/withdraw", async function(req, res, next){
  const conn = await pool.getConnection()
  await conn.beginTransaction()
  const { account_id, money} = req.body;

  try{

    //check user input
    if(!(account_id && money)){
      return res.json({status: "All input is required"});
    }

    //get account balance
    const [rows, fields] = await conn.query('SELECT balance FROM bank_account WHERE account_id = ?',
    [account_id])

    //cal new balance
    var new_balance = (parseFloat(rows[0].balance) - parseFloat(money)).toFixed(2);
    if(new_balance < 0){
      return res.json({status: 'not enough money'});
    }

    //update balance in database
    const [rows2, fields2] = await conn.query('UPDATE bank_account SET balance = ? WHERE account_id = ?',
    [new_balance, account_id])

    //update transaction
    const [rows3, fields3] = await conn.query('INSERT INTO transaction(account_id, transaction_type, money, date) VALUES(?, "withdraw", ?, CURRENT_TIMESTAMP)', 
    [account_id, money])

    await conn.commit();
    return res.json({status: 'success'});

  }catch(err){
    console.log(err);
    await conn.rollback();
  }finally{
    await conn.release();
  }
});

//check transfer to account
app.post("/checkAccount", async function(req, res, next){
  const account_number = req.body.account_number;
  
  try{

    //check user input
    if(!(account_number)){
      return res.json({status: "All input is required"});
    }

    //get account
    const [rows, fields] = await pool.query('SELECT user_id, account_id, account_number, fname, lname FROM bank_account JOIN user_account USING (user_id) WHERE account_number = ?',
    [account_number])

    if(rows.length == 0){
      return res.json({status: 'Inccorect Account Number'})
    }

    return res.json({status: 'success', account_data: rows[0]});

  }catch(err){
    console.log(err);
  }
});

//transfer money
app.post("/transfer", async function(req, res, next){
  const {sender_id, receiver_id, money, note} = req.body;

  const conn = await pool.getConnection();
  await conn.beginTransaction()
  
  try{
    //check user input
    if(!(sender_id || receiver_id || money || note)){
      return res.json({status: "All input is required"});
    }

    //- balance from sender
    const [rows, fields] = await conn.query('SELECT balance FROM bank_account WHERE account_id = ?',
    [sender_id])

    var result = (parseFloat(rows[0].balance) - parseFloat(money)).toFixed(2);


    const [rows2, fields2] = await conn.query('UPDATE bank_account SET balance = ? WHERE account_id = ?',
    [result, sender_id])

    //+ balance from receiver
    const [rows3, fields3] = await conn.query('SELECT balance FROM bank_account WHERE account_id = ?', 
    [receiver_id])

    result = (parseFloat(rows3[0].balance) + parseFloat(money)).toFixed(2);

    const [rows4, fields4] = await conn.query('UPDATE bank_account SET balance = ? WHERE account_id = ?', 
    [result, receiver_id])

    //update transaction
    const [rows5, fields5] = await conn.query('INSERT INTO transaction(account_id, otherAccount_id, transaction_type, note, money, date) VALUES(?, ?, "transfer", ?, ?, CURRENT_TIMESTAMP)', 
    [sender_id, receiver_id, note, money])

    await conn.commit()
    return res.json({status: 'success'});

  }catch(err){
    await conn.rollback();
    console.log(err);
  }finally{
    await conn.release();
  }
});

//get transaction
app.post('/transaction', async function(req, res, next){
  const conn = await pool.getConnection()
  await conn.beginTransaction()
  const account_id = req.body.account_id;
  try{
      const [rows, fields] = await conn.query('SELECT t.*, ba.user_id, ba.account_number, ua.fname, ua.lname, t.otherAccount_id, subquery.account_number as other_account_number, subquery.fname as other_fname, subquery.lname as other_lname, date_format(date, "%d/%m/%Y") as formatDate FROM transaction as t INNER JOIN bank_account as ba ON (t.account_id = ba.account_id) JOIN user_account as ua ON (ba.user_id = ua.user_id)LEFT JOIN (SELECT sub_ba.account_id, sub_ba.account_number, sub_ua.fname, sub_ua.lname FROM bank_account as sub_ba JOIN user_account as sub_ua USING (user_id)) as subquery ON (t.otherAccount_id = subquery.account_id) WHERE t.account_id = ? OR t.otherAccount_id =? ORDER BY date DESC;', 
      [account_id, account_id])
      await conn.commit();
      res.json({status: 'success', transaction_data: rows});
  }
  catch(err){
      //if error rollback
      console.log(err)
      await conn.rollback();
  }
  finally{
      //release transaction
      await conn.release();
  }
  
})

app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000/userAccount`)
})