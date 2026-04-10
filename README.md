# Ceci est la Documentation du projet “CTRL+A”, contenant l’installation, le lancement et le fonctionnement de celui-ci 

 

## INITIALISATION DU PROJET 

### Docker 

Le projet s’exécute dans un environnement Docker, il est nécessaire que Docker soit installé sur la machine (https://www.docker.com/products/docker-desktop/). 
Le projet contient un Dockerfile et un docker-compose-yml, pour exécuter le projet il faut entrer la commande  

` docker compose up ` 

À la racine du projet. Pour éteindre le container il faut effectuer la commande : 
` docker compose down ` 
 
## Dépendances
pour installer les dépendances il faut effectuer la commande : 

` yarn install `  

### Pipeline 

Via une configuration du GitHub, la partie Workflow, un fichier de propriétés pour SonarQube et un Dockerfile, à chaque fois qu’un push est effectué, le code est récupéré par SonarQube et est analysé afin de trouver de possibles failles de sécurités ou duplicata de code avant d’être envoyé à Docker pour qu’il soit conteneurisé afin de pouvoir être utilisé par n’importe qui possédant Docker. 

 

### Base de données 

Le système de Base de Données choisis pour ce projet est Postgres, il est nécessaire que Postgres soit installé sur la machine. pour Mettre à Jour la base de donnée il faut effectuer la commande :  

` yarn prisma db push `  

La base de données est push directement sur le serveur local Postgres.  
 

## ACCESSIBILITÉ 

Chaque page en dehors de la page d’accueil nécessite de se connecter avec son compte CTRL+A. Chaque connexion créera un token qui une fois expiré déconnectera l’utilisateur. Si un utilisateur essaye d’accéder à une page sans s’être connecté avant, il sera redirigé vers la page de connexion. 


## FONCTIONNEMENT DU PROJET 
Le site web est accessible à l’adresse [http://localhost:5173] une fois que le docker est lancé. 
 

### Initialisation des données 

Pour créer un utilisateur, il suffit de l’enregistrer avec la page de création de comptes. 

Pour configurer l’utilisateur, le compte admin à une page unique permettant de modifier la configuration de chaque utilisateur. 

Pour créer un cours, seul un utilisateur “PO” peut créer un cours sur la page emploie du temps, indiquant la classe, le nom du cours et les horaires. L’utilisateur étudiant pourra le voir sur son emploi du temps, ainsi que sa présence, qui devra être confirmé par le PO via le système d’appel. 

Pour ajouter une note, le PO peut attribuer une note à un élève qui va mettre à jour automatiquement sa moyenne et l’élève pourra la voir directement sur la page correspondante.  
