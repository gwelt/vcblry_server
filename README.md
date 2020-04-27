![vcblry icon](public/vcblry192.png)
# vocabulary database and trainer for mobiles
  
This is a server for vocabulary-sets and an online vocabulary-trainer.  
- HTML-client-UI for mobile devices
- [OpenAPI](https://github.com/OAI/OpenAPI-Specification)-REST-interface to fetch and store vocabulary-sets ("challenges")
  
The client can also be used offline / without the server running.  
See `public/index.html` in action on https://gwelt.github.io/vcblry/

### Running the server
To run the server, run:
```
npm start
```
To open the VCBLRY* in the browser:
```
open http://localhost:3000
```
Don't miss the Swagger UI interface:
```
open http://localhost:3000/docs
```
