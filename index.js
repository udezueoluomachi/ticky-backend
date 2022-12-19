const {Nosqljsondb} = require("nosql-json-db");
const {Server} = require("ws");

const db = new Nosqljsondb("./db.json");
const http = require("http");

const port = process.env.PORT || 4000;

const server = http.createServer(
    (req, res) => {
        res.writeHead(200,{
            "Access-Control-Allow-Origin"       : `https://udezueoluomachi.github.io`,
            "Acess-Control-Allow-Methods"       : "OPTIONS, POST, GET",
            "Access-Control-Max-Age"            : 2592000,
            "Access-Control-Request-Headers"    : "Content-Type"
        });
        res.write("Hello world");
        res.end();
    }
).listen(port , () => console.log(`Server is running on port ${port}`));

const wss = new Server({server});

const clients = [];
wss.on("connection" ,
    (ws) => {
        clients.push(ws);
        //setInterval( () =>  clients.forEach(element => element.send(JSON.stringify({message : new Date().toString()}))), 2000);
        ws.on("message" , (msg) => {
            let message = JSON.parse(msg);
            if(message.match_id && message.message_type === "matchid_insertion") {
                db.insertInto("matchid",{ matchid : message.match_id});
                clients.forEach(element => {
                    element.send(JSON.stringify(message));
                });
            }
            if(message.message_type === "match-creation" && message.match_id && message.first_name) {
                db.selectFrom("matchid",[],{
                    columns: ["matchid"],
                    equals : [message.match_id]
                }, result => {
                    if(result.matchid.length > 0) {
                        /**/
                        clients.forEach(element => {
                            element.send(JSON.stringify(message));
                        });
                    }
                    else {
                        clients.forEach(element => {
                            element.send(JSON.stringify({msg: "match-not-found"}));
                        });
                    }
                });
            }
            if(message.match_id && message.message_type === "create_environment" && message.first_name) {
                clients.forEach(element => {
                    element.send(JSON.stringify(message));
                });
            }
            if(message.btn_id && message.table_name && message.match_id) {
                clients.forEach(element => {
                    element.send(JSON.stringify(message));
                });
            }
            if(message.match_id && message.o_score && message.x_score) {
                clients.forEach(element => {
                    element.send(JSON.stringify(message));
                });
            }
            if(message.match_id && message.message_type === "friend-declined") {
                clients.forEach(element => {
                    element.send(JSON.stringify(message));
                });
            }
        });
    }
);

module.exports = server;