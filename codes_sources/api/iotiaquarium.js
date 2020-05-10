

const Influx = require('influxdb-nodejs');


module.exports.getUserById = getUserById;
module.exports.getAquariumById = getAquariumById;
module.exports.getAquariumByIdDatas = getAquariumByIdDatas ;
module.exports.getAquariumByIdLight = getAquariumByIdLight;
module.exports.getAquariumByIdFood = getAquariumByIdFood;
module.exports.insertDataByAquariumId = insertDataByAquariumId;
module.exports.getDataByAquariumId = getDataByAquariumId;
module.exports.getSensorByName = getSensorByName;
module.exports.getTriggerByName = getTriggerByName;


function getUserById(users, userId) {
    return users.find(user => user.userId == userId);
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

function getDataByAquariumId(client,aquariumId,userId, composant, response) {

    client.query(composant.shard_name)
        .where('aquarium', `${aquariumId}`)
        .where('user', `${userId}`)
        .then((values)=>{
            console.log(values);
            console.log(values.results[0].series[0].values);
            let value =  values.results[0].series[0].values;


            response.json({
                data:  value,
                status:true
            })
        })
        .catch(console.error);


}

function getSensorByName(users, aquarium, name)
{
    let result =  null;

    return aquarium.sensors.find(s => s.id==name);
}

function getTriggerByName(users, aquarium, name)
{
    let result =  null;

    return aquarium.triggers.find(s => s.id==name);
}

function insertDataByAquariumId(client,aquariumId, userId, composant, value) {

    return client.write(composant.shard_name)
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
