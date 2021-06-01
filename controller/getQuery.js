const db = require('./dbserver.js');
const entitiesMap = require('../model/entitiesMap.js');
const sql = require('../model/queryBuilder.js');

async function getQuery(req, res, next) {

  try {

    const type = req.path.substring(1);

    const entity = req.query;
    const entityName = Object.keys(entity)[0]; //Nombre de la entidad solicitada

    if (entitiesMap[entityName]) {
      const entityParams = JSON.parse(entity[entityName]); //Parametros en formato json

      let query;

      if (entityParams) {
        query = sql.getSQLEntity(entityParams, entitiesMap[entityName]);
      }
      
      const result = await db.simpleExecute(query.sql, query.binds);
      
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).end('No se pudo ejecutar la consulta.');
      }      

    } else {
      res.status(404).end(`Recurso no encontrado:`+ entityName);
    }

  } catch (err) {
    res.status(404).end(`Error en parametros de llamada \n` + err);
  }

}

module.exports.getQuery = getQuery;