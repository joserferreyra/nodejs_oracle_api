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

    // Create a PL/SQL stored procedure

    
    await connection.execute(
      `CREATE OR REPLACE PROCEDURE no_proc
         (p_in IN VARCHAR2, p_inout IN OUT VARCHAR2, p_out OUT NUMBER)
       AS
       BEGIN
         p_inout := p_in || p_inout;
         p_out := 101;
       END;`
    );    

    // Invoke the PL/SQL stored procedure.
    //
    // The equivalent call with PL/SQL named parameter syntax is:
    // `BEGIN
    //    no_proc(p_in => :i, p_inout => :io, p_out => :o);
    //  END;`


    const result = await connection.execute(
      `BEGIN
         no_proc(:i, :io, :o);
       END;`,
      {
        i:  'Chris',  // Bind type is determined from the data.  Default direction is BIND_IN
        io: { val: 'Jones', dir: oracledb.BIND_INOUT },
        o:  { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
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