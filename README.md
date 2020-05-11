## Expression du besoin : 

IOTIAQUARIUM a pour but d’aider à prendre soin de vos poissons en automatisant les tâches de contrôle et de maintenance. L’objectif est de communiquer des données liées à la survie de la faune et de la flore à une application qui génèrera des alertes et permettra d’intervenir sur les actionneurs. Contrairement à la nature, un aquarium n’est pas un environnement autonome et a besoin d’une assistance constante, ces tâches sont le plus souvent assurées manuellement et donc susceptible d’erreurs, le système devra donc reproduire au mieux un milieu de vie viable avec un minimum d’intervention humaine.

## Problématiques :
- Alimenter les poissons.
- Allumer/éteindre la lumière.
- Entretien de l’eau.
- Hyper-vision de l’environnement.


## Solution proposée :

Six capteurs sont utilisés dans la plate-forme pour mesurer les paramètres clés de l'aquarium, tels que la température, le pH, et d'autres pour contrôler l'état de l'aquarium (niveau et fuites, luminosité). De plus, il y a 3 actionneurs différents pour automatiser des tâches telles que nourrir les poissons, l'activation des pompes pour le changement d'eau, le contrôle de l'intensité de la lumière pour simuler les cycles jour/nuit et créer un réflexe de Pavlov pour l’alimentation des poissons. Une API complète sera créée pour contrôler facilement le système via un Raspberry. Nous prévoyons également de concevoir une application web qui permettra de stocker dans une base de données les informations recueillies et de les visualiser à partir d'un navigateur et d'appareils iPhone/Android.

![architecture systeme](https://github.com/mapfra/LPIOTIA_2019_IOTIAquarium/tree/master/documents?raw=true)

Notre but est de mettre en avant l’hétérogénéité de nos compétences, en répartissant le travail en fonction des différentes matières concernant le projet.

## Acteurs :
Olivier Durand, Raphaël Betti, Dieunelson Dorcelus, Eric Harkat.

## Sous-équipes :

| Partie : Circuit et arduino | Partie : virtualisation et communication | Partie : web et mobile         |
|-----------------------------|------------------------------------------|--------------------------------|
| Raphael Betti \(leader\)    | Olivier Durand \(leader\)                | Dieunelson Dorcelus \(leader\) |
| Eric Harkat                 | Eric Harkat                              | Eric Harkat                    |
| Olivier Durand              | Dieunelson Dorcelus                      | Raphael Betti                  |



*Pour le déploiement dans chaque sous parties (codes sources, docker) vous trouverez un README dédié à chaque parties. dans le dossier codes_sources/<nom_de_la_partie>*
