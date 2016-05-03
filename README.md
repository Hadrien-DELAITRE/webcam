# webcam

## Prérequis :

- Le serveur [nodejs](https://nodejs.org/en/) (Prends la v6.0.0 par exemple) pour faire tourner le projet.

- Le terminal [git bash](https://git-for-windows.github.io/) qui intègre `git` qui va permettre de récupérer le projet.

- Le logiciel propriétaire [SYSM Monitor](http://www.scc21.net/) qui va permettre de récupérer les flux des webcams.

- Le logiciel [OBS](https://obsproject.com/) qui va permettre de stream le logiciel propriétaire des caméras.

Configurer le raccourci de l'application de manière à ce qu'elle accepte les instances multiples :
`Click droit sur le raccourci de l'application > Propriété` et ensuite rajouter le paramètre `-multi`.

![OBS - Multi-instances](https://i.gyazo.com/65b36dc80b74d06fbb8b44f704c73614.png)

Pas certain que le paramètre soit obligatoire, mais sait-on jamais !

- L'outil [FFMPEG](https://ffmpeg.zeranoe.com/builds/) qui permettra de transcoder le flux de la video en HLS (pour la compatibilitée iOS/Android).

Ne pas oublier de rentrer la variable d'environnement pour que la commande soit utilisable depuis [git bash](https://git-for-windows.github.io/):
`Panneau de configuration\Système > Paramètres système avancés > Variables d'environnement`.
Ensuite, il faut cliquer sur `Modifier...` la valeur `PATH` :

![Variables d'environnement - PATH](https://i.gyazo.com/584c89597ad4195bf07fa05a14668bf6.png)

Puis, `Nouveau` et `Parcourir` en allant chercher le chemin des binaires de [FFMPEG](https://ffmpeg.zeranoe.com/builds/).
Attention à ne pas remplacer une ligne existante (c'est un peu buggé sur windows...) :

![Variables d'environnement - FFMPEG PATH](https://i.gyazo.com/bd604a1296bac66d7f745a426e258a7b.png)

## Installation

### Construction et lancement du projet `webcam` :

Tout d'abord, il faut commencer par récupérer ce projet. Pour ce faire, il suffit d'utiliser le terminal [git bash](https://git-for-windows.github.io/), d'aller dans un répertoire choisi et de faire la commande `git` suivante :

```bash
> git clone git@github.com:Hadrien-DELAITRE/webcam.git
```

Ensuite, simplement se déplacer dans le dossier nouvellement créé :

```bash
> cd webcam
```

Une fois au sein du dossier, si `npm` a correctement été installé, il faut installer toutes les dépendances nécessaires au bon fonctionnement du projet grâce à la commande :

```bash
> npm install
```

Pour lancer le projet correctement, il y a plusieurs commandes à executer, mais tout d'abord, il faut s'assurer que la configuration est bonne. En effet, il faut modifier le fichier de [config](https://github.com/Hadrien-DELAITRE/webcam/blob/master/config/index.js).

Au sein de ce fichier, il faut définir l'IP de la machine (ou le nom de domaine, en tout cas ne pas laisser à `localhost`). Ensuite, les variables `port` et `rtmpPort` doivent être laissées comme défini.
Ensuite, il y a le tableau `cams`. Ce tableau contiendra le nombre de camera que l'on souhaite afficher. Il faut bien comprendre que ce tableau correspondra au nombre de flux vidéo créés par le stream d'[OBS](https://obsproject.com/).
Enfin, la chaîne de caractère `streamDestFolder` doit être modifier pour correspondre chemin absolu du fichier `dist` de ce projet.
La chaîne `rtmpBaseUrl` ne doit pas être modifiée.

Une fois la configuration modifiée, il faut lancer la commande permettant de construire le projet :

```bash
> gulp build
```

Une fois cette commande exécutée, normalement la construction devrait se lancer correctement, si un message de ce type apparait :

![gulp error](https://i.gyazo.com/8b454b2cfb88879d60e66a3a92ef1bb2.png)

Il suffit de réessayer après avoir fait :

```bash
> npm install gulp
```
ou
```bash
> npm install -g gulp
```

Après avoir construit le projet, il faut démarrer les serveurs grâce à la commande :

```bash
> gulp start
```

A partir de ce moment là, le serveur HTTP est démarré ainsi que les serveurs RTMP qui vont permettre à [FFMPEG](https://ffmpeg.zeranoe.com/builds/) de transcoder les flux vidéos.

Nous allons donc maintenant nous intéresser aux flux vidéos :

### Configuration et lancement des flux vidéos :

Tout d'abord, nous allons lancer le logicier propriétaire des caméras [SYSM Monitor](http://www.scc21.net/).
Une fois lancé, le logiciel présente une fenêtre où à sa gauche les caméras IP vont apparaitre. Un simple `click droit` dans la partie de gauche va ouvrir un sous-menu permettant d'afficher toutes les caméras en même temps. Une fois que les caméras sont toutes afficher, nous allons pouvoir configurer le logiciel de stream [OBS](https://obsproject.com/).

Il faut lancer le logiciel [OBS](https://obsproject.com/) autant de fois que l'on souhaite avoir de flux vidéo (qui correspondra à la configuration des caméras définit plus haut via le fichier de [config](https://github.com/Hadrien-DELAITRE/webcam/blob/master/config/index.js)).

Une fois le logiciel ouvert, il faut tout d'abord le paramètrer via le bouton `Paramètres...`. Dans le menu `Paramètres de streaming`, il faut définir les champs suivants :

```
Mode: Stream en direct
Service de Stream: Custom
FMS URL: rtmp://127.0.0.1/2035/live
```
Et utiliser **la Clef du Stream** qui correspondra au nom définit dans la [config](https://github.com/Hadrien-DELAITRE/webcam/blob/master/config/index.js), par exemple :
```
Clef du Stream: cam1
```
Ainsi, pour chacune des instances d'OBS lancée, il faudra mettre une **Clef différente pour chacune des caméras que l'on aura**, i.e : `cam1 / cam2 / cam3 / ...`.

Une fois la paramétrisation réalisée pour chacune des instances, il faut ajouter une source pour chacune d'entres elles via un `click droit` dans la partie `sources` et en choisissant `Ajouter > Capture de la fenêtre` :

![OBS - capture de la fenêtre](https://i.gyazo.com/f04d2cdd243d22e4f410efe07de4793b.png)

Il faut ensuite donner un nom pour la source, par exemple ici : `cam1`. Puis une grande fênetre s'affiche dans laquelle il faut tout d'abord sélectionner :
`Fenêtre: SYSM Monitor`

Puis dans le menu `Capturer une Région`, définit la sélection de la caméra par rapport à la fenêtre du logiciel SYSM Monitor :

![OBS - capture de la région](https://i.gyazo.com/bf4c5f291345dffc7a241e10d3ee34d9.png).

Il faut réitérer cette opération pour chacune des instances d'[OBS](https://obsproject.com/) pour stream l'ensemble des caméras présentée par [SYSM Monitor](http://www.scc21.net/).
Une fois ces configurations réalisée, nous allons pouvoir lancer nos stream avec le bouton `Commencer le Streaming` pour chaque instance d'[OBS](https://obsproject.com/).
Il faut bien s'assurer que notre serveur du projet `webcam` est bien lancée (ce que l'on a fait avec la commande `gulp start`).

Une fois que les streams sont lancés, nous allons pouvoir transcoder les flux vidéos :

### Transcodage vidéo RTMP > HLS avec FFMPEG :

Il faut à présent lancer **un nouveau terminal [git bash](https://git-for-windows.github.io/)**, puis accéder à notre projet `webcam` en retournant dans le répertoire choisi.

Pour transcoder les flux vidéos, il suffit de lancer la commande suivante :

```bash
> gulp ffmpeg
```

Cela va lancer les flux vidéos pour chacunes des caméras présentes dans la [config](https://github.com/Hadrien-DELAITRE/webcam/blob/master/config/index.js).

Une fois cette dernière commande lancée, il suffit maintenant d'accéder à notre site web via l'URL suivante avec les valeurs de la [config](https://github.com/Hadrien-DELAITRE/webcam/blob/master/config/index.js) pour le `port` et l'`ip` :

`http://${ip}:${port}/webcams.html`
