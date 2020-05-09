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

/*users.push({
    userid:1,
    aquariums:[
        {
            id:1,
            name:"1",
            sensors:[
                {id:'ph_sensor',shard_name:'ph_sensor'}
            ],
            triggers:[],
            time_feed:null,
            time_start_light:null,
            time_end_light:null,
            deleted: false,
            disconnect:false
        },
        {id:2, sensors:[], triggers:[], deleted: false}
    ]
});*/




//  Insersion d'un sensor dans influxdb
app.post(`${versionAPI}/users/:userid/aquariums/:aquariumid/sensor/:sensor`, (req, res) =>{
    let userid = req.params.userid;
    let aquariumid = req.params.aquariumid;
    let sensorname = req.params.sensor;
    let aquarium = iotiaquarium.getAquariumById(users,aquariumid);
    let sensor= iotiaquarium.getSensorByName(users,aquarium,sensorname);
    let value = req.body.value;

    let status = false;

    if(aquarium!=undefined && sensor!=undefined){
        iotiaquarium.insertDataByAquariumId(client,aquariumid,userid,sensor,value);
        status = true;
    }
    // get barer
    res.json({
        data:  value,
        status:status
    })

});

//  Insersion d'un trigger dans influxdb
app.post(`${versionAPI}/users/:userid/aquariums/:aquariumid/trigger/:trigger`, (req, res) =>{
    let userid = req.params.userid;
    let aquariumid = req.params.aquariumid;
    let triggername = req.params.trigger;
    let aquarium = iotiaquarium.getAquariumById(users,aquariumid);
    let trigger= iotiaquarium.getTriggerByName(users,aquarium,triggername);
    let value = req.body.value;

    let status = false;

    if(aquarium!=undefined && trigger!=undefined){
        iotiaquarium.insertDataByAquariumId(client,aquariumid,userid,trigger,value);
        status = true;
    }
    // get barer
    res.json({
        data:  value,
        status:status
    })

});

//  Recuperation valeurs des sensor
app.get(`${versionAPI}/users/:userid/aquariums/:aquariumid/sensor/:sensor`, (req, res) =>{
    let userid = req.params.userid;
    let aquariumid = req.params.aquariumid;
    let sensorname = req.params.sensor;
    let aquarium = iotiaquarium.getAquariumById(users,aquariumid);
    let sensor = iotiaquarium.getSensorByName(users,aquarium,sensorname);

    if(aquarium!=undefined && sensor!=undefined) {
        iotiaquarium.getDataByAquariumId(client,aquariumid,userid,sensor, res);
    }else{
        // get barer
        res.json({
            data:  null,
            status:false
        })
    }

});

//  Recuperation valeurs des triggers
app.get(`${versionAPI}/users/:userid/aquariums/:aquariumid/trigger/:trigger`, (req, res) =>{
    let userid = req.params.userid;
    let aquariumid = req.params.aquariumid;
    let triggername = req.params.trigger;
    let aquarium = iotiaquarium.getAquariumById(users,aquariumid);
    let trigger = iotiaquarium.getTriggerByName(users,aquarium,triggername);

    if(aquarium!=undefined && trigger!=undefined ){
        iotiaquarium.getDataByAquariumId(client,aquariumid,userid,trigger, res);
    }else{
        // get barer
        res.json({
            data:  null,
            status:false
        })
    }

});



//  On cree un utilisateur
app.post(`${versionAPI}/users`, (req, res) =>{

    let userId = req.body.userId;
    let msg = null;
    let user = null;
    let status = false;



    let usertest = iotiaquarium.getUserById(users,userId);

    if(usertest!=undefined){
        status = false;
        msg="Already exist : "+userId;
    }else{
        users.push({
            userId:userId,
            aquariums: []
        });

        user = iotiaquarium.getUserById(users,userId);

        if(user!=undefined){
            status = true;
            msg="User created "+userId;
        }
    }

    res.json({
        data: user,
        msg:msg,
        status:status
    })
});


//recuperation des aquarium
app.get(`${versionAPI}/users/:id/aquariums`, (req, res) =>{
    var id = req.params.id;
    let aquariums = [];
    let user = iotiaquarium.getUserById(users,id);

    let status = false;

    if(user!=undefined){
        aquariums = user.aquariums;
        status = true;
    }
    // get barer
    res.json({
        data:  aquariums,
        status:status
    })
});


//  On ajoute un aquarium à un utilisateur
app.post(`${versionAPI}/users/:id/aquariums`, (req, res) =>{

    let userId = req.params.userId;
    let aquariumId = req.body.aquariumId;
    let name_aquarium = req.body.name_aquarium;
    let disconnect_aquarium = req.body.disconnect_aquarium;

    let aquarium = {
        id: aquariumId,
        name:name_aquarium,
        sensors:[],
        triggers:[],
        time_feed:null,
        time_start_light:null,
        time_end_light:null,
        deleted: false,
        disconnect:disconnect_aquarium
    };
    let user = iotiaquarium.getUserById(users,userId);

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

//  On disconnect un aquarium
app.post(`${versionAPI}/users/:userId/aquariums/:aquariumId/disconnect`, (req, res) =>{

    let userId = req.params.userId;
    let aquariumId = req.params.aquariumId;
    let value = req.body.value;

    let aquarium = iotiaquarium.getAquariumById(users,aquariumId);

    let status = false;

    if (aquarium!=undefined){
        aquarium.disconnect = value;
        status=true;
    }

    res.json({
        data: aquarium,
        status:status
    });
});

//  On ajout des composants
app.post(`${versionAPI}/users/:userId/aquariums/:aquariumId/add/:composant`, (req, res) =>{

    let userId = req.params.userId;
    let aquariumId = req.params.aquariumId;
    let id = req.body.id;
    let chard_name = req.body.chard_name;
    let composant = req.params.composant;

    let aquarium = iotiaquarium.getAquariumById(users,aquariumId);

    let status = false;

    if (aquarium!=undefined && id!="" && chard_name!="" && (composant.trim()=="sensor" || composant.trim()=="trigger")){

        let cmp = {id:id,shard_name:chard_name};

        if (composant=="sensor"){
            aquarium.sensors.push(cmp);
        }else{
            aquarium.triggers.push(cmp);
        }
        status=true;
    }

    res.json({
        data: aquarium,
        status:status
    });
});

//  On set le time_feed aquarium
app.post(`${versionAPI}/users/:userId/aquariums/:aquariumId/data/food_hours`, (req, res) =>{

    let userId = req.params.userId;
    let aquariumId = req.params.aquariumId;
    let value = req.body.value;

    let aquarium = iotiaquarium.getAquariumById(users,aquariumId);

    let status = false;

    if (aquarium!=undefined){
        aquarium.time_feed = value;
        status=true;
    }

    res.json({
        data: aquarium,
        status:status
    });
});

//  On set le start_light_hours aquarium
app.post(`${versionAPI}/users/:userId/aquariums/:aquariumId/data/start_light_hours`, (req, res) =>{

    let userId = req.params.userId;
    let aquariumId = req.params.aquariumId;
    let value = req.body.value;

    let aquarium = iotiaquarium.getAquariumById(users,aquariumId);

    let status = false;

    if (aquarium!=undefined){
        aquarium.time_start_light = value;
        status=true;
    }

    res.json({
        data: aquarium,
        status:status
    });
});

//  On set le end_light_hours aquarium
app.post(`${versionAPI}/users/:userId/aquariums/:aquariumId/data/end_light_hours`, (req, res) =>{

    let userId = req.params.userId;
    let aquariumId = req.params.aquariumId;
    let value = req.body.value;

    let aquarium = iotiaquarium.getAquariumById(users,aquariumId);

    let status = false;

    if (aquarium!=undefined){
        aquarium.time_end_light = value;
        status=true;
    }

    res.json({
        data: aquarium,
        status:status
    });
});

app.listen(3000, () =>console.log('listen on port 3000'));