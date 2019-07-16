const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../connection/connection');
let connection = mysql.createConnection(config);
/*            User Route                      */

try {
    router.post('/register', async (req, res) => {
        bcrypt.hash(req.body.password, 10, function (err, hash) {
            if (err) {
                return res.status(500).json({
                    error: err
                });
            }
            let Query = `Insert INTO users (email,password,name,type,created_at,updated_at) VALUES (?,?,?,?,?,?)`;
            let Query_values = [req.body.email, hash, req.body.name, req.body.type, new Date().toJSON().slice(0, 19).replace('T', ' '), new Date().toJSON().slice(0, 19).replace('T', ' ')];
            connection.query(Query, Query_values, (err, results, fields) => {
                if (err) {
                    return res.json({
                        message: `Duplicate Entry for ${req.body.email}`
                    });
                }
                // get inserted id
                console.log('User Added Successfully:' + results.insertId);
                res.json({
                    message: `New User Added Successfully...`
                });
            });
        });
    });
    // login route
    router.post('/login', async (req, res) => {
        let requestedUser = `SELECT id,name,email,password from users where email='${req.body.email}'`;
        console.log(requestedUser);
        connection.query(requestedUser, (err, results, fields) => {
            if (err) {
                return res.json({
                    message: err
                });
            }
            if (results[0] === undefined || results[0] === null) {
                res.status(401).json({
                    failed: 'User Not Exists'
                });
                return;
            }
            let password = results[0].password;
            bcrypt.compare(req.body.password, password, function (err, result) {
                if (err) {
                    return res.status(401).json({
                        failed: 'Unauthorized Access'
                    });
                }
                if (result) {

                    const JWTToken = jwt.sign({
                            email: results[0].email,
                            id: results[0].id
                        },
                        'secret', {
                            expiresIn: '2h'
                        });
                    res.status(200).json({
                        name: results[0].name,
                        email: results[0].email,
                        token: JWTToken
                    });

                    let checkUser = `SELECT id from user_tokens where user_id='${results[0].id}'`;
                    connection.query(checkUser, (err, results_out, fields) => {
                        if (err) {
                            return res.json({
                                message: err
                            });
                        }
                        //console.log("results_outresults_outresults_out",results_out[0]);
                        let checkUserExist = results_out[0];
                        if (checkUserExist === undefined || checkUserExist === null) {
                            let insertToken = `Insert into user_tokens (user_id,token,created_at,updated_at) VALUES ('${results[0].id}','${JWTToken}','${new Date().toJSON().slice(0, 19).replace('T', ' ')}','${new Date().toJSON().slice(0, 19).replace('T', ' ')}')`;
                            let ress = connection.query(insertToken);
                        } else {
                            let updateToken = `Update  user_tokens set user_id='${results[0].id}',token='${JWTToken}',updated_at='${new Date().toJSON().slice(0, 19).replace('T', ' ')}' where user_id='${results[0].id}'`;
                            console.log(updateToken);
                            let re1s = connection.query(updateToken);
                        }
                    });

                } else {
                    return res.status(401).json({
                        failed: 'Unauthorized Access'
                    });
                }
            });
        });
    });
} catch (err) {
    console.log(`err : ${err}`);
}

module.exports = router;