#!/usr/bin/env bash

# verifier que nous sommes en root ou sudo
[ `whoami` = root ] || { sudo "$0" "$@"; exit $?; }


# verifier la présence des fichiers importants
if [ ! -f data/ca.crt ]; then
    echo "certificat absent veuillez installer IOTIAquarium en premier"
    exitErreur="true"
fi
if [ ! -f /usr/bin/curl ]; then
  echo "Curl n'est pas present, pour continuer veuillez l'installer."
  exitErreur="true"
fi
# quitter si erreur
if [ "$exitErreur" == "true" ];
then
  exit
fi
read -p "Veuillez entrer votre identifiant gitHub (email) pour permettre un echange de cle publique : `echo $'\n> '`" GIT_USER

# preparer le logiciel permettant le partage de  cle publique
if [ ! -f /usr/local/bin/ffsend ]; then
  mv ffsend-* /usr/local/bin/ffsend
  chmod +x /usr/local/bin/ffsend
fi

echo "==> Partage du certificat contenant la cle publique"
cd data/
var=$(ffsend upload ca.crt)
cd ..
rm /usr/local/bin/ffsend
# nom du gist
# preparation de la trame json
template='{"description": "cle publique pour iotiaquarium","public": false,"files": {"ca.crt": {"content": "%s"}}}'
json_string=$(printf "$template" "$var")
# envoie de la requete
curl -u "${GIT_USER}" -X POST -d "${json_string}" "https://api.github.com/gists" > /dev/null
echo $'\n'
echo -e "\e[41mVous pouvez retrouver la cle publique sur la page d'acceuil de votre compte gitHub\e[0m" 
echo -e "\e[41mCliquez sur l'icone de votre profil en haut a gauche puis sur 'your gists' sinon utilisez le lien suivant\e[0m"
echo -e "\e[44m $var \e[0m"
echo $'\n'
read -p "Si vous avez fini de lire, veuillez appuyer sur une touche pour terminer ce script..." -n1 -s
echo $'\n'
exit