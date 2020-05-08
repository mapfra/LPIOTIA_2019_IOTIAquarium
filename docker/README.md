# Virtualisation et Communication : Configuration du Broker MQTT

## Dépendances

- Docker-CE 18.06+
- Docker Compose v1.23.1+
- OpenSSL
- Curl

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
$ chmod +x install_IOTIAquarium.sh
$ chmod +x uninstall_IOTIAquarium.sh
$ chmod +x shareKey.sh
```
## Installation
```bash
$ ./install_IOTIAquarium.sh
```
### Instructions d'installation
Vous devrez renseigner plusieurs informations puis appuyer sur entrée pour continuer.
- 1 : votre identifiant gitHub (l'adresse mail qui vous sert à vous identifier sur le site) pour permettre un échange de clé publique au travers d'un gist privé
- 2 : un identifiant et mot de passe pour InfluxDB, ils seront utilisés pour la création de la base et les accès.
- 3 : un identifiant et mot de passe pour Mosquitto, ils seront utilisés pour les accès.
- 4 : un mot de passe qui sera utilisé pour créé le certificat TLS.
- 5 : en fin de script, il vous serra demandé d'entrer votre mot de passe lié à l'identifiant gitHub renseigné en premier cela se fait directement avec l'API de gitHub nous ne stockons pas le mot de passe.

Une ultime intervention humaine sera nécerraire à la fin du script, vous devrez appuyer sur une touche pour vous donner le temps de lire les dernières instructions.

## Partage de clé publique
```bash
$ ./shareKey.sh
```
### A utiliser si vous voulez de nouveau partager la clé publique
Vous devrez renseigner plusieurs informations puis appuyer sur entrée pour continuer.
- 1 : votre identifiant gitHub (l'adresse mail qui vous sert à vous identifier sur le site) pour permettre un échange de clé publique au travers d'un gist privé
- 2 : en fin de script, il vous serra demandé d'entrer votre mot de passe lié à l'identifiant gitHub renseigné en premier cela se fait directement avec l'API de gitHub nous ne stockons pas le mot de passe.

Une ultime intervention humaine sera nécerraire à la fin du script, vous devrez appuyer sur une touche pour vous donner le temps de lire les dernières instructions.

## Désinstallation

```bash
$ ./uninstall_IOTIAquarium.sh
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

Pour le partage de clé publique nous avons adopté un solution ne demandant pas de serveur ftp externe ou interne. La clé est uploadé sur firefoxSend un service Open-Source de la fondation Mozilla. Le lien est ensuite envoyer sur le compte Github de l'utilisateur sous forme de Gist (petit dépot git créé pour ce genre d'opération).

La dernière problèmatique à résoudre est la capacité à réagir en cas d'erreur, pour y répondre le script se termine par une session de monitoring en temps réél qui permet de surveiller l'activité des différents containers trés utile en cas de bugs ou pour surveiller les personnes connectées.
___

## Point sécurité pour mosquito
Le port 1883 sera fermé vers l'extérieur pour permettre une identification par mot de passe sur le réseau local. L'identification par certificat *et* mot de passe sera réservé au port 8883 ouvert vers l'extérieur. Pour la connection au Brain nous utilisons la technologie des websocket sur le port 8080 avec la même sécurité que pour la connection TLS (certificat + idenntifiant/mot de passe).

## Point sécurité pour InfluxDB
Le port 8086 sera fermé vers l'extérieur pour permettre une identification par mot de passe sur le réseau local. Pas d'accès extérieur.
