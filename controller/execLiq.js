const oracledb = require('oracledb');
const dbConfig = require('./../config/dbconfig');

/*
if (process.platform === 'win32') { // Windows
  oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_19_11' });
} else if (process.platform === 'darwin') { // macOS
  oracledb.initOracleClient({ libDir: process.env.HOME + '/Downloads/instantclient_19_8' });
}
*/

async function run() {

  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    oracledb.autoCommit = true;

    // Create a PL/SQL stored procedure
  
    // Invoke the PL/SQL stored procedure.
    //
    // The equivalent call with PL/SQL named parameter syntax is:
    // `BEGIN
    //    no_proc(p_in => :i, p_inout => :io, p_out => :o);
    //  END;`

    const result = await connection.execute(
      `BEGIN
         MOD_LIQUIDACION.LIQ_PRINCIPAL(:periodo, :gruporep, :rep, :persona, :cargo, :liquidacion, :grupoadi);
       END;`,
      {
        periodo: '01/04/2021', 
        gruporep: 1, 
        rep: 0, 
        persona: 0, 
        cargo: 0, 
        liquidacion: 1, 
        grupoadi: 0
      }
    );

    console.log(result.outBinds);

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

run();