const oracledb = require('oracledb');
const dbconfig = require('./../config/dbconfig');

// hr schema password

// checkConnection asycn function

async function checkConnection() {
    try {
        connection = await oracledb.getConnection(dbconfig);
        console.log('connected to database');
    } catch (err) {
        console.error(err.message);
    } finally {
        if (connection) {
            try {
                // Always close connections
                await connection.close();
                console.log('close connection success');
            } catch (err) {
                console.error(err.message);
            }
        }
    }
}

checkConnection();