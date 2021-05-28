const oracledb = require('oracledb');
const dbConfig = require('../config/dbconfig.js');

async function initialize() {
    const pool = await oracledb.createPool(dbConfig.oraPool);
}

module.exports.initialize = initialize;

async function close() {
    await oracledb.getPool().close();
}

module.exports.close = close;

function getQueryLimits(query) {
    return `SELECT * FROM (SELECT A.*, ROWNUM AS MY_RNUM FROM ( ${query} ) A
             WHERE ROWNUM <= :limit + :offset) WHERE MY_RNUM > :offset`;
}

function simpleExecute(statement, binds = [], opts = {}) {
    return new Promise(async (resolve, reject) => {
        let conn;
        let query;
        opts.outFormat = oracledb.OBJECT;
        opts.autoCommit = true;
        try {
            conn = await oracledb.getConnection();
            if (binds.limit !== undefined) {
                if (binds.offset == undefined) {
                    binds.offset = 0;
                }
                query = getQueryLimits(statement);
            } else {
                query = statement;
            }
            console.log("Inicio de la ejecución");
            const result = await conn.execute(query, binds, opts);
            console.log("Fin de la ejecución");
            resolve(result);
        } catch (err) {
            reject(err);
        } finally {
            if (conn) {
                try {
                    await conn.close();
                } catch (err) {
                    console.log(err);
                }
            }
        }
    })
}

module.exports.simpleExecute = simpleExecute;

async function execStoreProcedure(sp, binds) {

    const sql = `BEGIN sp END;`;

    console.log(query);
    console.log(binds);

    json = {};

    return json;

    try {
        const result = await simpleExecute(sql, binds);
        
    } catch (err) {
        console.error(err);
    } 
}

module.exports.execsp = execStoreProcedure;
