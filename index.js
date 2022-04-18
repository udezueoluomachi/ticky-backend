const {Nosqljsondb} = require("nosql-json-db");
const {WebSocketServer} = require("ws");

const db = new Nosqljsondb("./db.json");

const port = process.env.PORT || 4000;
const wss = new WebSocketServer({port : port});
const clients = [];
wss.on("connection" ,
    (ws) => {
        clients.push(ws)
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
