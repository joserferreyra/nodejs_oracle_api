const express = require('express');
const router = new express.Router();
const query = require('./getQuery.js');

// Responde llamadas del tipo .../query?<Nombre de objeto o entidad mapeada>={<Parametros en formato string JSON>}

router.route('/query').get(query.getQuery);

module.exports = router;