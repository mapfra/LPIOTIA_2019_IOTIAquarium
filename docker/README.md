# Virtualisation et Communication : Configuration du Broker MQTT

## Install de Docker et Docker-compose

Le paquet d'installation Docker disponible dans le dépôt officiel de Debian peut ne pas être la dernière version. Pour être sûr de l'obtenir, nous installerons Docker à partir du dépôt de son concepteur. 

``` shell
apt update

apt install curl

apt install apt-transport-https ca-certificates curl gnupg2 software-properties-common

curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -

add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable"

apt update
```
Ce dernier update est important, il permet de prendre en compte la modification des sources de dépôt.

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

Dans une logique de travail à distance, utiliser Docker permet de simplifier l'installation et la configuration de service comme un broker MQTT. En quelques lignes de commandes on peut lancer un serveur mosquito prêt à l'emploi. Le problème est la sécurité, nous pourrions créer notre propre image Docker contenant les certificats, les clés privés et les mots de passe mais comme cette image sera rendue publique sur DockerHub ce n'est pas pertinent, de plus l'utilisation de plusieurs conteneurs (mosquito et influxDB) complique la tâche de déploiement et de configuration que nous voulons garder simple.
La solution est Docker-compose qui est un outil permettant de définir et d'exécuter de multiples conteneurs. Avec Compose, nous pouvons utiliser un fichier YAML pour configurer les applications et ensuite, avec une seule commande, créer et démarrer tous les services. Nous allons aussi l'utiliser pour la persistance des données, les certificats, clés et fichiers de configuration vont être stockés sur la machine hôte et synchroniser avec le conteneur à chacun redémarrage, à noter que la synchronisation va dans les deux sens hôte\<\-\-\>container. Nous utilisons cette fonctionnalité a notre avantage, exemple 1 : Mosquitto gère lui-même son fichier de mot de passe mais avec la synchronisation nous pouvons consulter l'état de ce fichier dans le répertoire data de l'hôte. Exemple 2 : toutes les modifications du fichier mosquitto.conf sera répercuté sur le container après son redémarrage. 
Attention les changements du fichier docker-compose.yml nécessite l'extinction des containers concernés et l'utilisation de la commande **docker-compose up -d** un redémarrage avec **docker-compose restart** ne suffira pas.

Notre image Docker custom d'un mosquito (sans certificat) sera publiée sur DockerHub 
[https://hub.docker.com/repository/docker/lpiotia/mqtt](https://hub.docker.com/repository/docker/lpiotia/mqtt)
___

## Configuration du broker MQTT

Manipulation sur la machine hôte, se placer dans un répertoire adéquat, par exemple /home/\<username\>/docker/ et créer un répertoire data qui contiendra tous nos fichiers :
  
``` shell
mkdir -p data

touch data/mosquitto.conf data/pwfile
```

## Openssl

Il faut maintenant créer les certificats dans le répertoire data :
``` shell
cd ./data/

openssl genrsa -aes256 -out ca.key 2048

openssl req -new -x509 -days 3600 -key ca.key -out ca.crt 
```
Attention à être cohérent dans les informations renseignées à cette étape, il faut que le Common Name soit différent que pour les étapes suivantes.
``` shell
openssl genrsa -out server.key 2048

openssl req -new -key server.key -out server.req

openssl x509 -req -in server.req -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -days 1800 
```
## Point sécurité pour mosquito
Le port 1883 sera fermé vers l'extérieur pour permettre une identification par mot de passe sur le réseau local. L'identification par certificat *et* mot de passe sera réservé au port 8883 ouvert vers l'extérieur. À noter qu'il est possible d'utiliser la technologie des websocket sur le port 8080 pour permettre la communication entre une api Web et mosquito. L'utilisation du protocole https nous fera préférer l'utilisation de let's encrypt plutôt qu'un certificat auto-signé.

## Continuer la configuration du broker
Précédemment, nous avons créé un fichier mosquito.conf dans le répertoire data, veuillez y copier les éléments ci-dessous. (Le fichier source se trouve dans ce dépôt git)

``` shell
port 1883
# Port à utiliser par défaut.

log_dest stdout
# envoie les messages de log sur la console externe, rendant possible la diffusion des logs sur la machine hôte directement.

allow_anonymous false
password_file /etc/mosquitto/pwfile
# active l'authentification par mot de passe et indique le fichier stockant ces informations.

persistence true
persistence_location /var/lib/mosquitto
# Sauvegarder les données des messages sur le disque à l'emplacement indiqué.

###### TLS ######
listener 8883
# port d'écoute secondaire

protocol mqtt
cafile /var/lib/mosquitto/ca.crt
certfile /var/lib/mosquitto/server.crt
keyfile /var/lib/mosquitto/server.key
# emplacement des fichiers nécessaire au bon fonctionnement de TLS

require_certificate false
# le client n'a pas besoin de fournir son propre certificat
```
Créer le fichier Docker-compose dans le dossier racine créé au départ, soit dans notre exemple /home/\<username\>/docker/ :
``` shell
touch docker-compose.yml

vi docker-compose.yml
```
Veuillez y copier les éléments ci-dessous, attention l'indentation est importante comme en python il faut respecter la structure. (Le fichier source se trouve dans ce dépôt git) :

``` shell
mosquitto:
# nom de la tâche
  image: lpiotia/mosquitto
  # utilise notre image située sur le dépôt DockerHub que nous avons créé, si elle n'existe pas localement compose la télécharge
  # puis démarre un container avec les éléments qui vont suivre
  ports:
    - "1883:1883"
    - "8883:8883"
    # ouverture des ports du container
  volumes:
    - ./data/mosquitto.conf:/etc/mosquitto/mosquitto.conf
    - ./data/pwfile:/etc/mosquitto/pwfile
    - ./data:/var/lib/mosquitto
    # synchronise des élements entre l'hôte et le container avec cette syntaxe dossier_sur_hôte:dossier_dans_container
  restart: always
  # Toujours redémarrer le conteneur s'il s'arrête. S'il est arrêté manuellement, il n'est activé que lorsque le daemon Docker
  # redémarre, comme de base ce daemon s'active lors du boot,
  # alors avec cette commande nos containers démarrent aussi lors du boot sans intervention humaine.
```
Nous pouvons démarrer le container, maintenant.
``` shell
docker-compose up -d
```
Cette commande exécute les instructions du fichier yaml et démarre les containers concernés

Avec docker-compose exec on entre dans le container avec une invite de commande shell
``` shell
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
