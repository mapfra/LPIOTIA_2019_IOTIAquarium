const Influx = require('influx');
const http = require('http');
const express = require('express');

const app = express();

const influx = new Influx.InfluxDB({
    host: 'localhost',
    database: 'express_response_db',
    schema: [
        {
            measurement: 'response_times',
            fields: {
                path: Influx.FieldType.STRING,
                duration: Influx.FieldType.INTEGER
            },
            tags: [
                'host'
            ]
        }
    ]
});


influx.getDatabaseNames()
    .then(names => {
        if (!names.includes('express_response_db')) {
            return influx.createDatabase('express_response_db');
        }
    })
    .then(() => {
        http.createServer(app).listen(3000, function () {
            console.log('Listening on port 3000')
        })
    })
    .catch(err => {
        console.error(`Error creating Influx database!`);
    });