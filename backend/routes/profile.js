const { json } = require("express");
const e = require("express");
const express = require("express");
const pool = require("../config");
const bcrypt = require("bcrypt");

const router = express.Router();

// get employee profile
router.get('/employee/profile/:account_id', async function(req, res, next){
    const [rows, fields] = await pool.query('SELECT * FROM account JOIN employee USING (employee_id) WHERE account_id = ?',
        [req.params.account_id]
    )

    console.log(rows[0])
    return res.json(rows[0])
});

//update employee profile
router.post('/employee/:employee_id/profile', async function(req, res, next){
    const conn = await pool.getConnection()
    console.log(req.body)
    // Begin transaction
    await conn.beginTransaction();
    try{
        const [rows, fields] = await conn.query(
            'UPDATE employee SET fname = ?, lname = ?, address = ?, phone = ?, salary = ?, role = ? WHERE employee_id = ?',
            [req.body.fname, req.body.lname, req.body.address, req.body.phone, req.body.salary, req.body.role, req.params.employee_id]
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
})

//employee chnage new password
router.put('/employee/:account_id', async function(req, res, next){
    const conn = await pool.getConnection()
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    console.log(hashPassword);
    // Begin transaction
    await conn.beginTransaction();
    try{
        const [rows, fields] = await conn.query(
            'UPDATE account SET password = ? WHERE account_id = ?',
            [hashPassword, req.params.account_id]
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
})

exports.router = router