const http = require('http');
const express = require('express');
const webServerConfig = require('../config/web-server.js');

let httpServer;

function initialize() {
    return new Promise((resolve, reject) => {
        const app = express();
        httpServer = http.createServer(app);

        app.use('/api', router);

        app.get('/', (req, res) => {
            res.end('Servidor activo');
        });

        httpServer.listen(webServerConfig.port, err => {
            if (err) {
                reject(err);
                return;
            }

            console.log(`Web server listening on localhost:${webServerConfig.port}`);

            resolve();
        });
    });
}

module.exports.initialize = initialize;

function close() {
    return new Promise((resolve, reject) => {
        httpServer.close((err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

module.exports.close = close;