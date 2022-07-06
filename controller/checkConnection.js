const oracledb = require('oracledb');
const dbconfig = require('./../config/dbconfig');

if (process.platform === 'win32') { // Windows
    oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_21_6' });
  } else if (process.platform === 'darwin') { // macOS
    oracledb.initOracleClient({ libDir: process.env.HOME + '/Downloads/instantclient_19_8' });
  }

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