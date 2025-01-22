const mysql = require('mysql');


const connection = mysql.createPool({
    host: 'MYSQL5035.site4now.net', 
    user: 'aaf278_alif',            
    password: 'abd_red080',
    database: 'db_aaf278_alif'     
});

module.exports = connection;
