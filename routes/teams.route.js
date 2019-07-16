const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const config = require('../connection/connection');
let connection = mysql.createConnection(config);
/*            User Route                      */

try {
    router.post('/addTeam', async (req, res) => {
        
     let addTeam = `Insert INTO teams (title,user_name,skype,created_at,updated_at) VALUES (?,?,?,?,?)`;
            let Query_values = [req.body.title,req.body.user_name, req.body.skype, new Date().toJSON().slice(0, 19).replace('T', ' '), new Date().toJSON().slice(0, 19).replace('T', ' ')];
            connection.query(addTeam, Query_values, (err, results, fields) => {
                if (err) {
                    return res.json({
                        message: err.message
                    });
                }       
    });
    });
} catch (err) {
    console.log(`err : ${err}`);
}

module.exports = router;