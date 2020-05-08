/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {

    //API url
    api:"http://localhost:3000/api",
    api_version:"v1",

    client:{
        id:"",
        username:"",
        aquariums:[]
    },

    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener('load_aquarium', this.load_aquarium.bind(this), false);

    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {

    },

    load_aquarium: function () {

        console.log("ok start event");

        //  On recupere la liste des aquariums
        let client = this.client;

        /*$.get(this.api+"/"+this.api_version+"/users/"+this.client.id+"/aquariums", (data)=>{
            data.forEach((elem)=>{
                client.aquariums.push(elem);
            });
        */

            let aquarium_list = $(".aquarium");


            console.log(aquarium_list);

            if (client.aquariums.length==0){
                let parent = $("#aquarium_parent");
                parent.append("<p id='rien_ici'>Il n'y a rien ici !</p>");
            }else{
                $("#rien_ici").remove();
                //  Dynamic loading

                //  On charge les aquariums
                client.aquariums.forEach((elem)=>{
                    this.add_aquarium(elem);
                });
            }
        /*
        });
         */
        let i = 0;
        let me = this;
        $("#aquarium_add").on('click', function () {
            me.add_aquarium(i);
            console.log(`#btn_delete_${i}`);
            let index =i;
            $(`#btn_delete_${i}`).on('click', function () {
                console.log(`aquarium_${index}`);
                me.sup_form(`aquarium_${index}`);

            });
            i++;
        });
    },



    add_aquarium: function (i)  {

        // get parrent
        let parent = $("#aquarium_parent");

        var str = i.toString();
        /*let ids = 'aquarium_';
        var conc = ids.concat(str);*/

        //  on ajoute l'enfant
        parent.append(`<div id='aquarium_${str}'>` +
            "<section class=\"aquarium bg-blue\" >" +
            "<a href=\"aquarium.html?aquarium=aquarium_id\">" +
            "<h3 class=\"aquarium-name\">Name</h3>" +
            "<table class=\"aquarium-details\">"+
            "<tr>"+
            "<td class=\"aquarium-details-item\">Ph</td>"+
            "<td class=\"aquarium-details-item\">Niveau eau</td>"+
            "<td class=\"aquarium-details-item\">Temperature</td>"+
            "<td class=\"aquarium-details-item\">Lumiere</td>"+
            "</tr>"+
            "<tr>"+
            "<td class=\"aquarium-details-item\" id='aquarium_"+str+"_ph'></td>"+
            "<td class=\"aquarium-details-item\" id='aquarium_"+str+"_water_level'></td>"+
            "<td class=\"aquarium-details-item\" id='aquarium_"+str+"_temperature'></td>"+
            "<td class=\"aquarium-details-item\" id='aquarium_"+str+"_light_level'></td>"+
            "</tr>"+
            "</table>"+
            "</section>"+
            "</a>" +
            `<button id='btn_delete_${str}' class=\"btnsup\">Supprimer</button>`+
            "</div>");

        this.getPhValue(i).then((value)=>{
            $("#'aquarium_"+i+"_ph'").html(value);
        });

        this.getWaterLevel(i).then((value)=>{
            $("#'aquarium_"+i+"_water_level'").html(value);
        });

        this.getTemperature(i).then((value)=>{
            $("#'aquarium_"+i+"_temperature'").html(value);
        });

        this.getLightLevel(i).then((value)=>{
            $("#'aquarium_"+i+"_light_level'").html(value);
        });
    },

    getPhValue(aquariumid){


        $.get(this.api+"/"+this.api_version+"/users/"+this.client.id+"/aquariums/"+aquariumid+"/sensor/ph_sensor", (response)=>{
            return new Promise(((resolve, reject) =>{
                if (response.status){
                    resolve(response.data)
                }else{
                    reject(response.status)
                }
            }));
        });

    },
    getWaterLevel(aquariumid){

        $.get(this.api+"/"+this.api_version+"/users/"+this.client.id+"/aquariums/"+aquariumid+"/sensor/water_sensor", (response)=>{
            return new Promise(((resolve, reject) =>{
                if (response.status){
                    resolve(response.data)
                }else{
                    reject(response.status)
                }
            }));
        });

    },
    getHoursStartLight(aquariumid){

        //TODO

        $.get(this.api+"/"+this.api_version+"/users/"+this.client.id+"/aquariums/"+aquariumid+"/data/start_light_hours", (response)=>{
            return new Promise(((resolve, reject) =>{
                if (response.status){
                    resolve(response.data)
                }else{
                    reject(response.status)
                }
            }));
        });

    },

    setHoursStartLight(aquariumid,value){
        //TODO

        $.post(this.api+"/"+this.api_version+"/users/"+this.client.id+"/aquariums/"+aquariumid+"/data/start_light_hours", {value:value},(response)=>{
            return response.status;
        });

    },
    getHoursEndLight(aquariumid){
        //TODO

        $.get(this.api+"/"+this.api_version+"/users/"+this.client.id+"/aquariums/"+aquariumid+"/data/end_light_hours", (response)=>{
            return new Promise(((resolve, reject) =>{
                if (response.status){
                    resolve(response.data)
                }else{
                    reject(response.status)
                }
            }));
        });

    },
    setHoursEndLight(aquariumid,value){

        //TODO
        $.post(this.api+"/"+this.api_version+"/users/"+this.client.id+"/aquariums/"+aquariumid+"/data/end_light_hours", {value:value},(response)=>{
            return response.status;
        });

    },
    getHoursFood(aquariumid) {
        //TODO

        $.get(this.api+"/"+this.api_version+"/users/"+this.client.id+"/aquariums/"+aquariumid+"/data/food_hours", (response)=>{
            return new Promise(((resolve, reject) =>{
                if (response.status){
                    resolve(response.data)
                }else{
                    reject(response.status)
                }
            }));
        });

    },
    setHoursFood(aquariumid,value){

        //TODO

        $.post(this.api+"/"+this.api_version+"/users/"+this.client.id+"/aquariums/"+aquariumid+"/data/food_hours", {value:value},(response)=>{
            return response.status;
        });

    },

    getTemperature(aquariumid) {
        //TODO : Il n'est pas dans le shema de db

        $.get(this.api+"/"+this.api_version+"/users/"+this.client.id+"/aquariums/"+aquariumid+"/sensor/temperature_sensor", (response)=>{
            return new Promise(((resolve, reject) =>{
                if (response.status){
                    resolve(response.data)
                }else{
                    reject(response.status)
                }
            }));
        });

    },

    getLightLevel(aquariumid) {

        $.get(this.api+"/"+this.api_version+"/users/"+this.client.id+"/aquariums/"+aquariumid+"/sensor/light_sensor", (response)=>{
            return new Promise(((resolve, reject) =>{
                if (response.status){
                    resolve(response.data)
                }else{
                    reject(response.status)
                }
            }));
        });

    },

    turnOnLight(aquariumid) {

        $.post(this.api+"/"+this.api_version+"/users/"+this.client.id+"/aquariums/"+aquariumid+"/trigger/light_trigger", {value:true},(response)=>{
            return response.status;
        });

    },

    turnOffLight(aquariumid) {

        $.post(this.api+"/"+this.api_version+"/users/"+this.client.id+"/aquariums/"+aquariumid+"/trigger/light_trigger", {value:false},(response)=>{
            return response.status;
        });

    },

    startFeed(aquariumid) {

        $.post(this.api+"/"+this.api_version+"/users/"+this.client.id+"/aquariums/"+aquariumid+"/trigger/feed_trigger", {date:new Date()},(response)=>{
            return response.status;
        });

    },


    sup_form: function(d) {
        //let parent = document.getElementById("aquarium_parent");
        //let d_form = document.getElementById(d);
        let d_form = $("#"+d);
        console.log(d_form);
        //console.log(parent);
        //parent.remove(d_form);
        d_form.remove();
        alert(d);
        console.log(d_form);
    },

// Update DOM on a Received Event
    receivedEvent: function(id) {

    }
};

app.initialize();