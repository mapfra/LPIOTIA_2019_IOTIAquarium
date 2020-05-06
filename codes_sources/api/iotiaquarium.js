

const Influx = require('influxdb-nodejs');


module.exports.getUserById = getUserById;
module.exports.getAquariumById = getAquariumById;
module.exports.getAquariumByIdDatas = getAquariumByIdDatas ;
module.exports.getAquariumByIdLight = getAquariumByIdLight;
module.exports.getAquariumByIdFood = getAquariumByIdFood;
module.exports.insertPhValuesByAquariumId = insertPhValuesByAquariumId;
module.exports.getPhValuesByAquariumId = getPhValuesByAquariumId;


function getUserById(users, userId) {
    return users.find(user => user.userid == userId);
}

function getAquariumById(users, aquariumId) {

    let result =  null;
    users.forEach((u)=>{
        let aquarium = u.aquariums.find(aqu => aqu.id == aquariumId);
        if (aquarium!==undefined){
            result = aquarium;
        }
    });
    return result;
}

function getPhValuesByAquariumId(client,aquariumId,userId, response) {


    client.query('ph_sensor')
        .where('aquarium', `${aquariumId}`)
        .where('user', `${userId}`)
        .then((values)=>{
            console.log(values.results[0].series[0].values);
            let value =  values.results[0].series[0].values;

            response.json({
                data:  value,
                status:true
            })
        })
        .catch(console.error);


}

function insertPhValuesByAquariumId(client,aquariumId, userId, value) {

    return client.write('ph_sensor')
        .tag({
            aquarium: aquariumId,
            user: userId
        })
        .field({
            value:value
        })
        .then(() => {
            return true;
        })
        .catch((err)=>{
            console.log(err);
            return false;
        });
}

function getLightValuesByAquariumId(client,id) {
    return client.query('light_sensor')
        .where('aquariumId', id)
        .then((values)=>{
            return values;
        })
        .catch(console.error);
}

function getWaterLvlValuesByAquariumId(client,id) {
    return client.query('water_sensor')
        .where('aquariumId', id)
        .then((values)=>{
            return values;
        })
        .catch(console.error);
}



function getAquariumByIdDatas(influx_client, aquariumId) {
    return [];
}

function getAquariumByIdLight(influx_client, aquariumId) {
    return [];
}

function getAquariumByIdFood(influx_client, aquariumId) {
    return [];
}