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

        let aquarium_list = $(".aquarium");


        console.log(aquarium_list);

        if (aquarium_list.length==0){
            let parent = $("#aquarium_parent");
            parent.append("<p id='rien_ici'>Il n'y a rien ici !</p>");
        }else{
            $("#rien_ici").remove();
            //  Dynamic loading
        }
        let i = 0;
        let me = this;
        $("#aquarium_add").on('click', function () {
            me.add_aquarium(i);
            console.log(`#btn_delete_${i}`);
            let saloperie =i;
            $(`#btn_delete_${i}`).on('click', function () {
                console.log(`aquarium_${saloperie}`);
                me.sup_form(`aquarium_${saloperie}`);

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
            "<a href=\"aquarium.html?aquarium=aquarium_id\">" +
            "<section class=\"aquarium bg-blue\" >" +
            "<h2 class=\"aquarium-name\">Name</h2>" +
            "<table class=\"aquarium-details\">"+
            "<tr>"+
            "<td class=\"aquarium-details-item\">Status</td>"+
            "<td class=\"aquarium-details-item\">Niveau eau</td>"+
            "<td class=\"aquarium-details-item\">Temperature</td>"+
            "<td class=\"aquarium-details-item\">Lumiere</td>"+
            "</tr>"+
            "</table>"+
            "</section>"+
            "</a>" +
            `<button id='btn_delete_${str}' class=\"btnsup\">Supprimer</button>`+
            "</div>");
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