const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const user = require('./routes/user.route');
const teams = require('./routes/teams.route');

const PORT = 9000;
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


// function GetDatabaseResponse(DB_ProcedureCall) {
//     return new Promise((resolve, reject) => {
//         conn1db.getConnection(function (ConnectionErrorMessage, DB_LocalConnection) {
//             if (ConnectionErrorMessage) {
//                 resolve("Database  connection failed");
//                 return;
//             } else {
//                 DB_LocalConnection.query(DB_ProcedureCall, (error, response) => {
//                     DB_LocalConnection.release();
//                     if (error) {
//                         resolve("Database Query Execution Failed");
//                         return;
//                     } else {
//                         resolve(response);
//                     }
//                 });
//             }
//         });
//     });
// }



app.get('/test', function (req, res) {
    res.json({
        "Tutorial": "Server is running"
    });
});

app.use('/user', user);
app.use('/team', teams);




app.listen(PORT, function () {
    console.log('Server is running on Port', PORT);
});