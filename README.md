[![Netlify Status](https://api.netlify.com/api/v1/badges/f541d02a-cd3f-416d-b259-bca32f204822/deploy-status)](https://app.netlify.com/sites/sparkly-stardust-15c687/deploys)


Instruction pour local:


Clone repo avec github desk
copy paste cette commande : set NODE_OPTIONS=--openssl-legacy-provider dans le terminal vscode peut importe le dir, juste sois dans le root dir blue-sitemaps

ensuite: depuis le root dir : cd netlify/functions et commande : npm install et node api. Ca demarera l'api, qui serve notre db sur localhost:5000/articles
ensuite retourne dans le root dir, et npm install, ca pendra 1 minute, et ensuite npm start 

le site sera sur localhost:3000, il faut que le serveur node soit en marche pour deservir la base de donnée et que le site marche 
Copyright (c) 2024 by sapg-dev
All Rights Reserved.

