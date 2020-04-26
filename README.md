![vcblry icon](public/vcblry180.png)
# vocabulary database-server and trainer for mobiles

## Overview
This is a server for vocabulary-database and online vocabulary-trainer.  
It serves HTML for the client-UI adapted for mobile devices as well as an [OpenAPI](https://github.com/OAI/OpenAPI-Specification)-REST-interface to fetch and store vocabulary-sets ("challenges").  
The client can also be used offline / without the server running. Open `public/index.html` or try it on https://gwelt.github.io/vcblry/.

### Running the server
To run the server, run:
```
npm start
```
To open the VCBLRY* in the browser:
```
open http://localhost:3000
```
Swagger UI interface:
```
open http://localhost:3000/docs
```
