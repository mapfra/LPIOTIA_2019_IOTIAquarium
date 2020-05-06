# Virtualisation et Communication : Configuration du Broker MQTT

## Dépendances

- Docker-CE 18.06+
- Docker Compose v1.23.1+
- OpenSSL

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

## Guide de démarrage
Manipulation sur la machine hôte, se placer dans un répertoire adéquat, par exemple /home/\<username\> et y copier le repertoire docker du dépôt git. Le chemin final devrait ressembler à ça : /home/\<username\>/docker.

Si nécessaire regler les droits
```bash
$ chmod +x install_IOTAquarium.sh
$ chmod +x uninstall_IOTAquarium.sh
```
## Installation
```bash
$ ./install_IOTAquarium.sh
```
## Désinstallation

```bash
$ ./uninstall_IOTAquarium.sh
```
## Certificat
Le certificat contenant la clé publique (à distribuer à vos clients) se trouve dans le répertoire data sous le nom ca.crt, dans notre exemple le chemin sera /home/\<username\>/docker/data/ca.crt.
___

## Problématique et solution

Dans une logique de travail à distance, utiliser Docker permet de simplifier l'installation et la configuration de service comme un broker MQTT. En quelques lignes de commandes on peut lancer un serveur mosquito prêt à l'emploi. Le problème est la sécurité, nous pourrions créer notre propre image Docker contenant les certificats, les clés privés et les mots de passe mais comme cette image sera rendue publique sur DockerHub ce n'est pas pertinent, de plus l'utilisation de plusieurs conteneurs (mosquito et influxDB) complique la tâche de déploiement et de configuration que nous voulons garder simple.
La solution est Docker-compose qui est un outil permettant de définir et d'exécuter de multiples conteneurs. Avec Compose, nous pouvons utiliser un fichier YAML pour configurer les applications et ensuite, avec une seule commande, créer et démarrer tous les services. Nous allons aussi l'utiliser pour la persistance des données, les certificats, clés et fichiers de configuration vont être stockés sur la machine hôte et synchroniser avec le conteneur à chacun redémarrage, à noter que la synchronisation va dans les deux sens hôte\<\-\-\>container. Nous utilisons cette fonctionnalité a notre avantage, exemple 1 : Mosquitto gère lui-même son fichier de mot de passe mais avec la synchronisation nous pouvons consulter l'état de ce fichier dans le répertoire data de l'hôte. Exemple 2 : toutes les modifications du fichier mosquitto.conf sera répercuté sur le container après son redémarrage. 
Attention les changements du fichier docker-compose.yml nécessite l'extinction des containers concernés et l'utilisation de la commande **docker-compose up -d** un redémarrage avec **docker-compose restart** ne suffira pas.

Notre image Docker custom d'un mosquito (sans certificat) sera publiée sur DockerHub 
[https://hub.docker.com/repository/docker/lpiotia/mqtt](https://hub.docker.com/repository/docker/lpiotia/mqtt)
___

## Point sécurité pour mosquito
Le port 1883 sera fermé vers l'extérieur pour permettre une identification par mot de passe sur le réseau local. L'identification par certificat *et* mot de passe sera réservé au port 8883 ouvert vers l'extérieur. À noter qu'il est possible d'utiliser la technologie des websocket sur le port 8080 pour permettre la communication entre une api Web et mosquito. L'utilisation du protocole https nous fera préférer l'utilisation de let's encrypt plutôt qu'un certificat auto-signé.