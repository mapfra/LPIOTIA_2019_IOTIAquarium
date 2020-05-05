const Influx = require('influxdb-nodejs');


module.exports.getUserById = getUserById;
module.exports.getAquariumById = getAquariumById;
module.exports.getAquariumByIdDatas = getAquariumByIdDatas ;
module.exports.getAquariumByIdLight = getAquariumByIdLight;
module.exports.getAquariumByIdFood = getAquariumByIdFood;


function getUserById(influx_client, userId) {
    return influx_client.query('http')
        .where('location', userId)
        .then((value)=>{
            console.log(value);
            return value;
        })
        .catch((err)=>{
            console.log(err);
            return null;
        });
}

function getAquariumById(influx_client, aquariumId) {
    return [];
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