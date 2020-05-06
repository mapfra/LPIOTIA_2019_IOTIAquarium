const express = require('express');
const Influx = require('influxdb-nodejs');
const bodyParser = require('body-parser');
const client = new Influx('http://127.0.0.1:8086/metrics');
const iotiaquarium = require("./iotiaquarium");


const app= express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
// recuperation des aquarium

//récupération des données

//création de la version de l'API
const versionAPI = '/api/v1';

// tableau utilisateur
//TODO: sauvegarder dans un fichier Json
const users = [];

users.push({
    userid:1,
    aquariums:[
        {id:1, sensors:[], triggers:[], deleted: false},
        {id:2, sensors:[], triggers:[], deleted: false}
    ]
});



//recuperation des aquarium
app.get(`${versionAPI}/users/:id/aquariums`, (req, res) =>{
    var id = req.params.id;
    let aquariums = [];
    let user = iotiaquarium.getUserById(users,id);
    if(user!=undefined){
        aquariums = user.aquariums;
    }
    // get barer
    res.json({
        data:  aquariums || null,
        status:true
    })
});

//recuperation de l'aquarium via l'id
app.get(`${versionAPI}/aquarium/:id`, (req, res) =>{
    var id = req.params.id;
    res.json({
        data: iotiaquarium.getAquariumById(users,id) || null

    })
});


//  Insersion d'une valeur pour le ph_sensor
app.post(`${versionAPI}/users/:userid/aquariums/:aquariumid/ph_sensor`, (req, res) =>{
    let userid = req.params.userid;
    let aquariumid = req.params.aquariumid;
    let aquarium = iotiaquarium.getAquariumById(users,aquariumid);
    let value = req.body.value;

    let status = false;

    if(aquarium!=undefined){
        iotiaquarium.insertPhValuesByAquariumId(client,aquariumid,userid,value);
        status = true;
    }
    // get barer
    res.json({
        data:  value,
        status:status
    })
});

//  Recuperation valeurs de ph_sensor
app.get(`${versionAPI}/users/:userid/aquariums/:aquariumid/ph_sensor`, (req, res) =>{
    let userid = req.params.userid;
    let aquariumid = req.params.aquariumid;
    let aquarium = iotiaquarium.getAquariumById(users,aquariumid);

    if(aquarium!=undefined){
        iotiaquarium.getPhValuesByAquariumId(client,aquariumid,userid, res);
    }else{
        // get barer
        res.json({
            data:  null,
            status:false
        })
    }

});


app.get(`${versionAPI}/aquarium/:id/datas`, (req, res) =>{
    var id = req.params.id;
    res.json({
        data: iotiaquarium.getDataByAquariumId(id).aquariums || null
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


//  On cree un utilisateur
app.post(`${versionAPI}/users`, (req, res) =>{

    let userId = req.body.userId;

    users.push({
        userId:userId,
        aquariums: []
    });

    res.json({
        data: iotiaquarium.getUserById(id) || null
    })
});

//  On ajoute un aquarium à un utilisateur
app.post(`${versionAPI}/users/:id/aquariums`, (req, res) =>{

    let userId = req.body.userId;
    let aquariumId = req.body.aquariumId;

    let aquarium = {
        id: aquariumId,
        sensors:[],
        triggers:[]
    };
    let user = iotiaquarium.getUserById(userId);

    let status = false;

    if (user!=undefined){
        user.aquariums.push(aquarium);
        status=true;
    }

    res.json({
        data: aquarium,
        status:status
    });
});

//  On supprime un aquarium
//delete de l'aquarium via l'id
app.delete(`${versionAPI}/aquarium/:id`, (req, res) =>{
    let aquariumId = req.params.id;
    let aquarium = iotiaquarium.getAquariumById(users,aquariumId);

    let status = false;

    if (aquarium!==undefined){
        aquarium.deleted = true;
        status=true;
    }

    res.json({
        data: aquarium,
        status:status
    });
});
app.listen(3000, () =>console.log('listen on port 3000'));