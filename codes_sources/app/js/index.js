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
        id:"5",
        username:"",
        aquariums:[]
    },
    current_aquarium:null,
    light_is_on:false,


    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener('load_aquarium', this.load_aquarium.bind(this), false);
        document.addEventListener("load_data_ph_waterlevel_tempvalue", this.load_data.bind(this), false);
        document.addEventListener("load_action_button_aquarium", this.load_action_button.bind(this), false);

    },
    load_action_button(){
        this.current_aquarium = this.GET("aquarium");
        let me = this;
        $("#btn_show_data").attr("href","donnees.html?aquarium="+this.current_aquarium);

        $("#btn_onoff_light").on("click",(event)=>{

            if (me.light_is_on){
                me.turnOffLight(me.current_aquarium,val => console.log(val));
                me.light_is_on = false;
            }else{
                me.turnOnLight(me.current_aquarium,val => console.log(val));
                me.light_is_on = true;
            }
        });

        $("#btn_feed").on("click",(event)=>{
            me.startFeed(me.current_aquarium,val => console.log(val));
        });

        $("#btn_active_pump").on("click",(event)=>{
            me.startPump(me.current_aquarium,val => console.log(val));
        });

        $("#btn_disconnect").on("click",(event)=>{
            me.disconnectAquarium(me.current_aquarium,val => console.log(val));
        });

        $("#btn_set_time_light").on("click",(event)=>{
            let time_start = $("#input_time_start").val();
            let time_end = $("#input_time_end").val();

            me.setHoursStartLight(me.current_aquarium,time_start,val => console.log(val));
            me.setHoursEndLight(me.current_aquarium,time_end,val => console.log(val));
        });

        $("#btn_set_time_food").on("click",(event)=>{
            let time_start = $("#input_time_start").val();

            me.setHoursFood(me.current_aquarium,time_start,val => console.log(val));
        });

        console.log("je suis la");
        console.log(this.GET("aquarium"));
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

            console.log(`#btn_delete_${i}`);
            let index =$(".aquarium").length+1;
            me.add_aquarium(index);
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
            `<a href=\"aquarium.html?aquarium=${str}\">` +
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

        //appel de la fonction et affichage
        this.getPhValue(i,(value)=>{
            console.log("value:"+value[value.length-1][3]);
            $("#aquarium_"+i+"_ph").html(value[value.length-1][3]);
        });
        //appel de la fonction et affichage
        this.getWaterLevel(i,(value)=>{
            $("#aquarium_"+i+"_water_level").html(value[value.length-1][3]);
        });
        //appel de la focntion et affichage
        this.getTemperature(i,(value)=>{
            $("#aquarium_"+i+"_temperature").html(value[value.length-1][3]);
        });
        //appel de la focntion et affichage
        this.getLightLevel(i,(value)=>{
            $("#aquarium_"+i+"_light_level").html(value[value.length-1][3]);
        });
    },

    //fonction qui récupére la valeur du Ph
    getPhValue(aquariumid,mycallback){

        console.log("entrer:getPhValue");
        $.get(this.api+"/"+this.api_version+"/users/"+this.client.id+"/aquariums/"+aquariumid+"/sensor/ph_sensor", (response)=>{
            /*console.log("response:");
            console.log(response);*/
            mycallback(response.data);
        });

    },

    //fonction qui récupére la valeur du niveau de l'eau
    getWaterLevel(aquariumid,mycallback){

        $.get(this.api+"/"+this.api_version+"/users/"+this.client.id+"/aquariums/"+aquariumid+"/sensor/water_sensor", (response)=>{

                if (response.status){
                    mycallback(response.data);
                }else{
                    mycallback(response.status);
                }

        });

    },
    //fonction qui récupére l'heure de l'allumage de la lumiére
    getHoursStartLight(aquariumid,mycallback){

        //TODO

        $.get(this.api+"/"+this.api_version+"/users/"+this.client.id+"/aquariums/"+aquariumid+"/data/start_light_hours", (response)=>{
            if (response.status){
                mycallback(response.data);
            }else{
                mycallback(response.status);
            }
        });

    },
    //fonction qui envoi l'heure d'allumage de la lumiere
    setHoursStartLight(aquariumid,value,mycallback){
        //TODO

        $.post(this.api+"/"+this.api_version+"/users/"+this.client.id+"/aquariums/"+aquariumid+"/data/start_light_hours", {value:value},(response)=>{
            mycallback(response.status);
        });

    },
    //fonction qui récupére l'heure d'exctinction de la lumiere
    getHoursEndLight(aquariumid,mycallback){
        //TODO

        $.get(this.api+"/"+this.api_version+"/users/"+this.client.id+"/aquariums/"+aquariumid+"/data/end_light_hours", (response)=>{
            if (response.status){
                mycallback(response.data);
            }else{
                mycallback(response.status);
            }
        });

    },

    //fonction que envoi l'heure d'exctinction de la lumiere
    setHoursEndLight(aquariumid,value,mycallback){

        //TODO
        $.post(this.api+"/"+this.api_version+"/users/"+this.client.id+"/aquariums/"+aquariumid+"/data/end_light_hours", {value:value},(response)=>{
            mycallback(response.status);
        });

    },

    //fonction qui récupére l'heure de distribution de nourriture
    getHoursFood(aquariumid,mycallback) {
        //TODO

        $.get(this.api+"/"+this.api_version+"/users/"+this.client.id+"/aquariums/"+aquariumid+"/data/food_hours", (response)=>{
            if (response.status){
                mycallback(response.data);
            }else{
                mycallback(response.status);
            }
        });

    },

    //fonction qui envoi l'heure de distribution de nourriture
    setHoursFood(aquariumid,value,mycallback){

        //TODO

        $.post(this.api+"/"+this.api_version+"/users/"+this.client.id+"/aquariums/"+aquariumid+"/data/food_hours", {value:value},(response)=>{
            mycallback(response.status);
        });

    },

    //fonction qui récupére la température de l'eau
    getTemperature(aquariumid,mycallback) {
        //TODO : Il n'est pas dans le shema de db

        $.get(this.api+"/"+this.api_version+"/users/"+this.client.id+"/aquariums/"+aquariumid+"/sensor/temp_sensor", (response)=>{
            if (response.status){
                mycallback(response.data);
            }else{
                mycallback(response.status);
            }
        });

    },

    //fonction qui récupére l'intensité de la lumiere
    getLightLevel(aquariumid,mycallback) {

        $.get(this.api+"/"+this.api_version+"/users/"+this.client.id+"/aquariums/"+aquariumid+"/sensor/light_sensor", (response)=>{
            if (response.status){
                mycallback(response.data);
            }else{
                mycallback(response.status);
            }
        });

    },

    turnOnLight(aquariumid,mycallback) {

        $.post(this.api+"/"+this.api_version+"/users/"+this.client.id+"/aquariums/"+aquariumid+"/trigger/light_trigger", {value:true},(response)=>{
            mycallback(response.status);
        });

    },

    turnOffLight(aquariumid,mycallback) {

        $.post(this.api+"/"+this.api_version+"/users/"+this.client.id+"/aquariums/"+aquariumid+"/trigger/light_trigger", {value:false},(response)=>{
            mycallback(response.status);
        });

    },

    startFeed(aquariumid,mycallback) {

        $.post(this.api+"/"+this.api_version+"/users/"+this.client.id+"/aquariums/"+aquariumid+"/trigger/feed_trigger", {date:new Date()},(response)=>{
            mycallback(response.status);
        });

    },

    startPump(aquariumid,mycallback) {

        $.post(this.api+"/"+this.api_version+"/users/"+this.client.id+"/aquariums/"+aquariumid+"/trigger/pump_trigger", {date:new Date()},(response)=>{
            mycallback(response.status);
        });

    },

    //fonction de déconnexion de l'aquiarium
    disconnectAquarium(aquariumid,mycallback) {

        $.post(this.api+"/"+this.api_version+"/users/"+this.client.id+"/aquariums/"+aquariumid+"/disconnect", {date:new Date()},(response)=>{
            mycallback(response.status);
        });

    },

    load_data(){
        let ph_value_html= $("#content");
        let temp_value_html =$("#tempvalue");
        let waterlevel_html = $("#input_water_level");

        let aquariumid = this.GET("aquarium");

        /*this.getWaterLevel(aquariumid,(value)=>{
           waterlevel_html.val(value[value.length-1][3]);
        });

        this.getTemperature(aquariumid,(value)=>{

            let val = ""+value[value.length-1][3];
            let tab_val= val.split(".");
            temp_value_html.html(`${tab_val[0]}<span>.${tab_val[1]}</span><strong>&deg;</strong>`);
        });*/

        this.getPhValue(aquariumid,(value)=>{

            let val = ""+value[value.length-1][3];
            let tab= $(".ph_level");
            console.log(tab);
            for(let i=0; i<tab.length; i++)
            {
                let elem=$(tab[i]);
                elem.removeClass("ph_active");
                console.log(tab[i]);
                if (elem.hasClass("_"+val))
                {
                    elem.addClass("ph_active");
                }
            }

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

    GET(param) {
        var vars = {};
        window.location.href.replace( location.hash, '' ).replace(
            /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
            function( m, key, value ) { // callback
                vars[key] = value !== undefined ? value : '';
            }
        );

        if ( param ) {
            return vars[param] ? vars[param] : null;
        }
        return vars;
    },

// Update DOM on a Received Event
    receivedEvent: function(id) {

    }
};

app.initialize();