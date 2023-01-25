const { json } = require("express");
const e = require("express");
const express = require("express");
const pool = require("../config");
const bcrypt = require("bcrypt");

const router = express.Router();

// employee register 
router.post('/employee/register', async function(req, res, next){
    const conn = await pool.getConnection()
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    console.log(hashPassword);
    // Begin transaction
    await conn.beginTransaction();
    try{
        
        const [rows, fields] = await conn.query(
            'SELECT username FROM account WHERE username = ?',
            [req.body.username]
        )
        if(rows.length > 0){
            return res.json({status: 'username'})
        }

        const [rows1, fields1] = await conn.query(
            'INSERT INTO employee (fname, lname) VALUES (?, ?)', 
            [req.body.firstName, req.body.lastName]
        )
        const [rows2, fields2] = await conn.query(
            'INSERT INTO account (username, password, employee_id) VALUES (?, ?, ?)',
            [req.body.username, hashPassword, rows1.insertId]
        )
        await conn.commit()
        return res.json({status: 'success'})
    } catch (err) {
        await conn.rollback();
        return res.status(500).json(err)
    }finally{
        console.log('finally')
        conn.release();
    }
});

// employee login
router.post('/employee/login', async function(req, res, next){
    const [rows, fields] = await pool.query(
        'SELECT * FROM account WHERE username = ?',
        [req.body.username]
    )

    if(rows.length == 0){
        return res.json({status: 'notFound'})
    }
    else{
        const isMatch = await bcrypt.compare(req.body.password, rows[0].password) 
        
        if(isMatch === false){
            return res.json({status: 'notFound'})
        }
    }

    return res.json({id: rows[0].employee_id})
});


exports.router = router