const express = require('express');
const Influx = require('influxdb-nodejs');
const client = new Influx('http://127.0.0.1:8086/metrics');
const iotiaquarium = require("./iotiaquarium");


const app= express();

// recuperation des aquarium

//récupération des données

//création de la version de l'API
const versionAPI = '/api/v1';



//recuperation des aquarium
app.get(`${versionAPI}/user/:id/aquarium`, (req, res) =>{
    var id = req.params.id;
    // get barer
    res.json({
        data: iotiaquarium.getUserById(client,id).aquariums || null,
        status:true
    })
});

//recuperation de l'aquarium via l'id
app.get(`${versionAPI}/aquarium/:id`, (req, res) =>{
    var id = req.params.id;
    res.json({
        data: iotiaquarium.getAquariumById(id).aquariums || null

    })
});

//recuperation de l'aquarium via l'id
app.delete(`${versionAPI}/aquarium/:id`, (req, res) =>{
   user.splice(id,1);
   res.sendStatus(200);
});

app.get(`${versionAPI}/aquarium/:id/datas`, (req, res) =>{
    var id = req.params.id;
    res.json({
        data: iotiaquarium.getUserByIdDatas(id).aquariums || null
    })
});

app.post(`${versionAPI}/aquarium/:id/light`, (req, res) =>{
    var id = req.params.id;
    res.json({
        data: iotiaquarium.getUserByIdLight(id).aquariums || null
    })
});

app.post(`${versionAPI}/aquarium/:id/food`, (req, res) =>{
    var id = req.params.id;
    res.json({
        data: iotiaquarium.getUserByIdfood(id).aquariums || null
    })
});



app.listen(3000, () =>console.log('listen on port 3000'));