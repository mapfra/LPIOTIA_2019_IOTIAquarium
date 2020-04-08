#!/usr/bin/env bash

# Si erreurs arreter le script
set -o errexit
set -o nounset

# creer le fichier contenant la variable d'environement pour identifier le projet avec docker
echo 'COMPOSE_PROJECT_NAME=iotaquarium' > .env

# verifier la présence des fichiers importants
if [ ! -f docker-compose.yaml ]; then
    echo "fichier docker-compose.yaml absent"
    exit
fi
if [ ! -f .env ]; then
    echo "fichier .env absent"
    exit
fi
if [ ! -f influxdb/influxdb.conf ]; then
    echo "fichier influxdb.conf absent"
    exit
fi
if [ ! -f data/mosquitto.conf ]; then
    echo "fichier mosquitto.conf absent"
    exit
fi

# demande les identifiants
read -p "Veuillez entrer l'identifiant admin d'influxDB : " INFLUXDB_ADMIN_USER
read -s -p "Veuillez entrer le mot de passe admin d'influxDB : " INFLUXDB_ADMIN_PASSWORD
read -p "Veuillez entrer le nom de la base pour influxDB : " INFLUXDB_DATABASE
read -p "Veuillez entrer l'identifiant admin de Mosquitto : " MOSQUITTO_ADMIN_USER
read -s -p "Veuillez entrer le mot de passe admin de Mosquitto: " MOSQUITTO_ADMIN_PASSWORD

# télécharge les images docker si besoin
echo "==> Docker Image Pull"
docker-compose pull

# prepaper le fichier de sauvegarde de mosquitto
touch data/pwfile

echo "==> Demarrer les services Mosquitto et InfluxDB"
docker-compose up -d

# attente de 25 sec pour laisser le temps aux service de démarrer
echo -ne '#####                     (22%)\r'
sleep 5
echo -ne '########                  (35%)\r'
sleep 5
echo -ne '###########               (51%)\r'
sleep 5
echo -ne '#############             (66%)\r'
sleep 5
echo -ne '##################        (88%)\r'
sleep 5
echo -ne '#######################   (100%)\r'
echo -ne '\n'

echo "==> Configuration d'influxDB"
docker exec -it influxdb                 \
  influx                         \
    -execute "CREATE USER "$INFLUXDB_ADMIN_USER" WITH PASSWORD '"$INFLUXDB_ADMIN_PASSWORD"' WITH ALL PRIVILEGES;"
echo "==> Configuration InfluxDB ok"
echo "==> Configuration de mosquitto"
docker exec -it mosquitto mosquitto_passwd -b /etc/mosquitto/pwfile $MOSQUITTO_ADMIN_USER $MOSQUITTO_ADMIN_PASSWORD
echo "==> Configuration mosquitto ok"

docker-compose restart

# attente de 25 sec pour laisser le temps aux service de démarrer
echo -ne '#####                     (22%)\r'
sleep 5
echo -ne '########                  (35%)\r'
sleep 5
echo -ne '###########               (51%)\r'
sleep 5
echo -ne '#############             (66%)\r'
sleep 5
echo -ne '##################        (88%)\r'
sleep 5
echo -ne '#######################   (100%)\r'
echo -ne '\n'

echo "==> Monitoring InfluxDB et Mosquitto"
docker-compose logs -f

