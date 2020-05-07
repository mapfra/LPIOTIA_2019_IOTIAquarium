#!/usr/bin/env bash

# verifier que nous sommes en root ou sudo
[ `whoami` = root ] || { sudo "$0" "$@"; exit $?; }

# Si erreurs arreter le script
set -o errexit
set -o nounset

# verifier les dependances
exitErreur="false"
# docker
if ! docker --version;
then
  echo "Docker n'est pas present, pour continuer veuillez suivre la procedure du README."
  exitErreur="true"
fi
# docker-compose
if [ ! -f /usr/local/bin/docker-compose ]; then
  echo "Docker-compose n'est pas present, pour continuer veuillez suivre la procedure du README."
  exitErreur="true"
fi
# openssl
if [ $(dpkg-query -W -f='${Status}' openssl 2>/dev/null | grep -c "ok installed") -eq 0 ];
then
  echo "OpenSSL n'est pas present, pour continuer veuillez l'installer."
  exitErreur="true"
fi

# creer le fichier contenant la variable d'environement pour identifier le projet avec docker
echo 'COMPOSE_PROJECT_NAME=iotiaquarium' > .env

# verifier la présence des fichiers importants
if [ ! -f docker-compose.yaml ]; then
    echo "fichier docker-compose.yaml absent"
    exitErreur="true"
fi
if [ ! -f .env ]; then
    echo "fichier .env absent"
    exitErreur="true"
fi
if [ ! -f influxdb/influxdb.conf ]; then
    echo "fichier influxdb.conf absent"
    exitErreur="true"
fi
if [ ! -f data/mosquitto.conf ]; then
    echo "fichier mosquitto.conf absent"
    exitErreur="true"
fi

# quitter si erreur
if [ "$exitErreur" == "true" ];
then
  exit
fi

# demande les identifiants
read -p "Veuillez entrer votre identifiant gitHub (email) pour permettre un echange de cle publique : `echo $'\n> '`" GIT_USER
echo "==> Identifiants InfluxDB`echo $'\n'`"
read -p "Veuillez entrer l'identifiant admin d'influxDB : `echo $'\n> '`" INFLUXDB_ADMIN_USER
read -s -p "Veuillez entrer le mot de passe admin d'influxDB : `echo $'\n> '`" INFLUXDB_ADMIN_PASSWORD
echo $'\n'
echo "==> Identifiants Mosquitto`echo $'\n'`"
read -p "Veuillez entrer l'identifiant admin de Mosquitto : `echo $'\n> '`" MOSQUITTO_ADMIN_USER
read -s -p "Veuillez entrer le mot de passe admin de Mosquitto : `echo $'\n> '`" MOSQUITTO_ADMIN_PASSWORD
echo $'\n'
echo "==> Certificat OpenSSL`echo $'\n'`"
read -s -p "Veuillez entrer le mot de passe de la cle SSL du CA : `echo $'\n> '`" OPENSSL_PASSWORD

# config openssl
echo "==> Creation des certificats"
# Requis
# Attention à être cohérent dans les informations renseignées à cette étape
# il faut que le Common Name soit différent pour les étapes suivantes.
commonnameCA=CA
commonname=server

# informations pour le certificat
country=FR
state=PACA
locality=SOPHIA
organization=IUT
organizationalunit=IOTIA

# Optionnel
password=$OPENSSL_PASSWORD

# Creer la clé
cd data/
openssl genrsa -aes256 -passout pass:$password -out ca.key 2048

# creer la requete et l'autosigne
openssl req -new -x509 -days 3600 -key ca.key -out ca.crt -passin pass:$password \
    -subj "/C=$country/ST=$state/L=$locality/O=$organization/OU=$organizationalunit/CN=$commonnameCA"

# creer une cle pour le serveur sans mot de passe
openssl genrsa -out server.key 2048

# creer la requete
openssl req -new -key server.key -out server.req \
    -subj "/C=$country/ST=$state/L=$locality/O=$organization/OU=$organizationalunit/CN=$commonname"

# Signer la requete
openssl x509 -req -in server.req -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt  -passin pass:$password -days 1800 
cd ..

# telecharger les images docker si besoin
echo "==> Docker Image Pull"
docker-compose pull

# preparer le fichier de sauvegarde de mosquitto
touch data/pwfile

# preparer le logiciel permettant le partage de  cle publique
if [ ! -f /usr/local/bin/ffsend ]; then
  mv ffsend-* /usr/local/bin/ffsend
  chmod +x /usr/local/bin/ffsend
fi

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
echo "  ==> Configuration de la bdd"
docker exec -it influxdb                 				   \
  influx -username $INFLUXDB_ADMIN_USER -password $INFLUXDB_ADMIN_PASSWORD \
    -execute 'CREATE DATABASE iotiaquarium;'
echo "  ==> Configuration des regles de gestion des donnees : On garde une valeur durant 24h"
docker exec -it influxdb                 				   \
  influx -username $INFLUXDB_ADMIN_USER -password $INFLUXDB_ADMIN_PASSWORD \
    -execute 'CREATE RETENTION POLICY "one_day" ON "iotiaquarium" DURATION 1d REPLICATION 1 DEFAULT;'
echo "  ==> Configuration des regles de gestion des donnees : On garde la moyenne d'un ensemble de valeur durant 1 an"
docker exec -it influxdb                 				   \
  influx -username $INFLUXDB_ADMIN_USER -password $INFLUXDB_ADMIN_PASSWORD \
    -execute 'CREATE RETENTION POLICY "one_year" ON "iotiaquarium" DURATION 52w REPLICATION 1;'
echo "  ==> Creation des requetes recursives qui vont faire une moyenne des valeurs des dernieres 24h et utiliser la regle un_an"
echo "    ==> requete 1/5 light_sensor"
docker exec -it influxdb                 				   \
  influx -username $INFLUXDB_ADMIN_USER -password $INFLUXDB_ADMIN_PASSWORD \
    -execute 'CREATE CONTINUOUS QUERY "req_1d_light_sensor" ON "iotiaquarium" BEGIN SELECT mean("value") AS "mean_value" INTO "one_year"."mean_light_sensor" FROM "light_sensor" GROUP BY time(1d) END;'
echo "    ==> requete 2/5 ph_sensor"
docker exec -it influxdb                 				   \
  influx -username $INFLUXDB_ADMIN_USER -password $INFLUXDB_ADMIN_PASSWORD \
    -execute 'CREATE CONTINUOUS QUERY "req_1d_ph_sensor" ON "iotiaquarium" BEGIN SELECT mean("value") AS "mean_value" INTO "one_year"."mean_ph_sensor" FROM "ph_sensor" GROUP BY time(1d) END;'
echo "    ==> requete 3/5 water_sensor"
docker exec -it influxdb                 				   \
  influx -username $INFLUXDB_ADMIN_USER -password $INFLUXDB_ADMIN_PASSWORD \
    -execute 'CREATE CONTINUOUS QUERY "req_1d_water_sensor" ON "iotiaquarium" BEGIN SELECT mean("value") AS "mean_value" INTO "one_year"."mean_water_sensor" FROM "water_sensor" GROUP BY time(1d) END;'
echo "    ==> requete 4/5 light_trigger"
docker exec -it influxdb                 				   \
  influx -username $INFLUXDB_ADMIN_USER -password $INFLUXDB_ADMIN_PASSWORD \
    -execute 'CREATE CONTINUOUS QUERY "req_1d_light_trigger" ON "iotiaquarium" BEGIN SELECT mean("value") AS "mean_value" INTO "one_year"."mean_light_trigger" FROM "light_trigger" GROUP BY time(1d) END;'
echo "    ==> requete 5/5 food_trigger"
docker exec -it influxdb                 				   \
  influx -username $INFLUXDB_ADMIN_USER -password $INFLUXDB_ADMIN_PASSWORD \
    -execute 'CREATE CONTINUOUS QUERY "req_1d_food_trigger" ON "iotiaquarium" BEGIN SELECT mean("value") AS "mean_value" INTO "one_year"."mean_food_trigger" FROM "food_trigger" GROUP BY time(1d) END;'

echo "  ==> Configuration de la bdd de test"
docker exec -it influxdb                 				   \
  influx -username $INFLUXDB_ADMIN_USER -password $INFLUXDB_ADMIN_PASSWORD \
    -execute 'CREATE DATABASE test;'
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

echo "==> Partage du certificat contenant la cle publique"
cd data/
var=$(ffsend upload ca.crt)
cd ..
# nom du gist
# preparation de la trame json
template='{"description": "cle publique pour iotiaquarium","public": false,"files": {"ca.crt": {"content": "%s"}}}'
json_string=$(printf "$template" "$var")
# envoie de la requete
curl -u "${GIT_USER}" -X POST -d "${json_string}" "https://api.github.com/gists"
echo $'\n'
echo $'\n'
echo $'\n'
echo "Vous pouvez retrouver la cle publique sur la page d'acceuil de votre compte gitHub" 
echo "cliquez sur l'icone de votre profil en haut a gauche puis sur 'your gists' sinon utilisez le lien suivant"
echo $var
echo $'\n'
echo $'\n'
echo -ne 'debut du monitoring Influx DB et Mosquitto dans 15s\r'
sleep 1
echo -ne 'debut du monitoring Influx DB et Mosquitto dans 14s\r'
sleep 1
echo -ne 'debut du monitoring Influx DB et Mosquitto dans 13s\r'
sleep 1
echo -ne 'debut du monitoring Influx DB et Mosquitto dans 12s\r'
sleep 1
echo -ne 'debut du monitoring Influx DB et Mosquitto dans 11s\r'
sleep 1
echo -ne 'debut du monitoring Influx DB et Mosquitto dans 10s\r'
sleep 1
echo -ne 'debut du monitoring Influx DB et Mosquitto dans 9s\r'
sleep 1
echo -ne 'debut du monitoring Influx DB et Mosquitto dans 8s\r'
sleep 1
echo -ne 'debut du monitoring Influx DB et Mosquitto dans 7s\r'
sleep 1
echo -ne 'debut du monitoring Influx DB et Mosquitto dans 6s\r'
sleep 1
echo -ne 'debut du monitoring Influx DB et Mosquitto dans 5s\r'
sleep 1
echo -ne 'debut du monitoring Influx DB et Mosquitto dans 4s\r'
sleep 1
echo -ne 'debut du monitoring Influx DB et Mosquitto dans 3s\r'
sleep 1
echo -ne 'debut du monitoring Influx DB et Mosquitto dans 2s\r'
sleep 1
echo -ne 'debut du monitoring Influx DB et Mosquitto dans 1s\r'
sleep 1
echo -ne 'debut du monitoring Influx DB et Mosquitto dans 0s\r'
echo -ne '\n'
echo "==> Monitoring InfluxDB et Mosquitto"
docker-compose logs -f