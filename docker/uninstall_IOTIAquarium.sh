#!/usr/bin/env bash

# verifier que nous sommes en root ou sudo
[ `whoami` = root ] || { sudo "$0" "$@"; exit $?; } 

# arreter et supprimer les containers ainsi que les reseaux
docker-compose down &> /dev/null

# arreter et supprimer les containers si la commande plus haut a echoue
docker container stop influxdb
docker container stop mosquitto
docker container rm influxdb &> /dev/null
docker container rm mosquitto &> /dev/null

#supprimer le volume contenant les donnees de la bdd
docker volume rm iotiaquarium_influxdb-lib &> /dev/null
