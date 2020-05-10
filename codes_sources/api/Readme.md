# API


## Pré-requis

- NPM (Node Package Manager)
- NodeJS


## Dépendances

- ExpressJS
- Body-parser
- Cors
- Influxdb-nodejs


## Installer le projet

L'orsque vous récupérez le projet, vous devez l'installer afin d'importer les packets de la liste de dépendance du projet.

``` shell
$ npm install
```


## Lancer le projet

Pour lancer le projet, il y a deja une commande node qui est préconfiguré et si vous utilisé un IDE tel que WebStorm, vous devriez l'appercevoir dans la liste des commandes NPM.

Si ce n'est pas le cas, voici la commande à executer dans le terminal :

```shell
$ node index.js
```


## A quoi sert cette dépendance ?

### ExpressJS

ExpressJS permet de gerer les routes de l'API, grace à lui on a pu gagner un temps inestimable dans la mise en place de notre API.

Voir : https://www.npmjs.com/package/express



### Body-parser

Body-parser est un packet, qui permet de parser les objets récuperé dans le corp d'une requete en objet Javascript.

Voir : https://www.npmjs.com/package/body-parser



### Cors

Cors est un packet qui nous permet de définir le terme de la 'Cors-Policy' de notre API afin que seul notre application puisse l'utiliser (Dans la version qui sera livré, on autorise toutes entrées car, nous n'avons pas fait de version de déploiement officiel).

Voir : https://www.npmjs.com/package/cors



### Influxdb-nodejs

Influxdb-nodejs nous permet d'interagir avec la base de donnée InfluxDB de notre sytème. Pour les pro-php, c'est l'équivalent de PDO ou de Entity pour ceux qui préfèrent .NET et C#.

Voir : https://www.npmjs.com/package/influxdb-nodejs

