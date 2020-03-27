# Virtualisation et Comunication : Configuration du Broker MQTT

## Install de Docker et Docker-compose

Le paquet d'installation Docker disponible dans le dépôt officiel de Debian peut ne pas être la dernière version. Pour être sûr de l'obtenir, nous installerons Docker à partir du dépôt de Docker. 

``` shell
apt update

apt install curl

apt install apt-transport-https ca-certificates curl gnupg2 software-properties-common

curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -

add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable"

apt update
```
ce dernier update est important

``` shell
apt install docker-ce docker-ce-cli containerd.io
```
Docker devrait maintenant être installé, le daemon lancé. Vérifiez qu'il est en cours d'exécution avec :
``` shell
systemctl status docker
```
Pour installer Docker-compose :
``` shell
curl -L "https://github.com/docker/compose/releases/download/1.25.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

chmod +x /usr/local/bin/docker-compose
```
Tester l'installation avec :
``` shell
docker-compose --version
```

## Problématique et solution

Dans une logique de travail à distance, utiliser Docker permet de simplifier l'installation et la configuration de service comme un broker MQTT. En quelques lignes de commandes on peut lancer un serveur mosquito prés à l'emploi. Le problème est la sécurité, nous pourrions créer notre propre image Docker contenant les certificats et le clés privés mais comme cette image sera rendue publique sur DockerHub ce n'est pas pertinent, de plus l'utilisation de plusieurs conteneurs (mosquito et influxDB) complique la tâche de déploiement et de configuration que nous voulons garder simple.
La solution est Docker-compose qui est un outil permettant de définir et d'exécuter de multiples conteneurs. Avec Compose, nous pouvons utiliser un fichier YAML pour configurer les applications et ensuite, avec une seule commande, créer et démarrer tous les services. Nous allons aussi l'utiliser pour la persistance des données, les certificats, clés et fichiers de configuration vont être stockés sur la machine hôte et synchroniser avec le conteneur à chacun redémarrage, à noter que la synchronisation va dans les deux sens hôte\<\-\-\>container. Nous utilisons cette fonctionalité a notre avantage, exemple 1 : Mosquitto gère lui-même son fichier de mot de passe mais avec la synchronisation nous pouvons consulter l'état de ce fichier dans le repertoire data de l'hôte. Exemple 2 : tout les modifications du fichier mosquitto.conf sera repercuté sur le container aprés son redémarrage. Attention les changements du fichier docker-compose.yml nécessite l'extinction des containers concernés et l'utilisation de la commande **docker-compose up -d** un redémarrage avec **docker-compose restart** ne suffira pas.

Notre image Docker custom d'un mosquitto (sans certificat) sera publiée sur DockerHub 
[https://hub.docker.com/repository/docker/lpiotia/mqtt](https://hub.docker.com/repository/docker/lpiotia/mqtt)
___

## Configuration du broker MQTT

Manipulation sur la machine hôte, se placer dans un répertoire adéquat, par exemple /home/\<username\>/docker/ :
  
``` shell
mkdir -p data

touch data/mosquitto.conf data/pwfile

vi data/mosquitto.conf
```

## Openssl

Il faut maintenant créer les certificats :
``` shell
openssl genrsa -aes256 -out ca.key 2048

openssl req -new -x509 -days 3600 -key ca.key -out ca.crt 
```
Attention a être cohérent dans les informations renseignées à cette étape, il faut que le Common Name soit différent que pour les etapes suivantes.
``` shell
openssl genrsa -out server.key 2048

openssl req -new -key server.key -out server.req

openssl x509 -req -in server.req -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -days 1800 
```
## Point securité pour mosquitto
Le port 1883 sera fermé vers l'extérieur pour permettre une identification par mot de passe sur le réseau local. L'identification par certificat *et* mot de passe sera réservé au port 8883 ouvert vers l'extérieur. À noter qu'il est possible d'utiliser la technologie des websocket sur le port 8080 pour permettre la communication entre une api Web et mosquitto. L'utilisation du protocole https nous fera préférer l'utilisation de let's encrypt plutôt qu'un certificat auto-signé.

## Continuer la configuration du broker
Copier le contenu du fichier data/mosquito.conf situé dans ce dépôt git, soit :

``` shell
port 1883
log_dest stdout
allow_anonymous false
password_file /etc/mosquitto/pwfile
persistence true
persistence_location /var/lib/mosquitto

###### ENABLE TLS ######
listener 8883
protocol mqtt
cafile /var/lib/mosquitto/ca.crt
certfile /var/lib/mosquitto/server.crt
keyfile /var/lib/mosquitto/server.key
require_certificate false
```
Créer le fichier Docker-compose (pas dans data/) :
``` shell
touch docker-compose.yml

vi docker-compose.yml
```
Copier le contenu du fichier docker-compose.yml situé dans ce dépôt git, soit :

``` shell
mosquitto:
  image: lpiotia/mqtt
  ports:
    - "1883:1883"
    - "8883:8883"
  volumes:
    - ./data/mosquitto.conf:/etc/mosquitto/mosquitto.conf
    - ./data/pwfile:/etc/mosquitto/pwfile
    - ./data:/var/lib/mosquitto
  restart: always
```
Nous pouvons démarrer le container, maintenant.
``` shell
docker-compose up -d

docker-compose exec mosquitto sh

>>> cd /etc/mosquitto
>>> mosquitto_passwd -b pwfile nomUtilisateur motDePasse
>>> cat pwfile
nomUtilisateur:7749&ksjfnvdwjo==
>>> exit
```
Maintenant il ne reste plus qu’à redémarrer le container pour prendre en compte les modifications.
``` shell
cd ..

docker-compose restart

docker-compose logs -f
```
