// Socket.io variables

var express = require('express');  
var app = express();  
var server = require('http').createServer(app); 
var io = require('socket.io')(server);
var value = require('events').EventEmitter.defaultMaxListeners = 15;


// Game variables
// Variables needed for rooms (tables) and the players inside them
var rooms = ['room1', 'room2', 'room3', 'room4'];
var table1 = [];
var table2 = [];
var table3 = [];
var table4 = [];
var players = [table1, table2, table3, table4];
var names1 = [];
var names2 = [];
var names3 = [];
var names4 = [];
var names = [names1, names2, names3, names4];

// i and m are the counters of the players
var i = 0;
var m = 0;
var dice = 0;

// Reading from index.html
app.use(express.static(__dirname + '/public')); 
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(client) {  
    client.on('join1', function(room) {
        client.join(rooms[room]);
        players[room].push(client.id);
    });
});

// Using local vars j and k sending the message into the right room
io.on('connection', function(client) {  
    client.on('join2', function(data) {
        for (let j = 0; j<4; j++){
            for (let k = 0; k<6; k++) {
                if (players[j][k] === client.id) {
                    io.in(rooms[j]).emit('join2', k);
                }
            }
        }
    });
});

// Using local vars j and k sending the message into the right room
// The names of the players are becoming visible through the server to all in the room
io.on('connection', function(client) {  
    client.on('join3', function(name) {
        for (let j = 0; j<4; j++){
            for (let k = 0; k<6; k++) {
                if (players[j][k] === client.id) {
                    names[j].push(name);
                    io.in(rooms[j]).emit('join3', name);
                }
            }
        }
    });
});

// The 'server part' of revealing START button to the first player in the room
io.on('connection', function(client) {  
    client.on('join4', function(data) {
        for (let j = 0; j<4; j++){
            for (let k = 0; k<6; k++) {
                if (players[j][k] === client.id) {
                    io.to(players[j][0]).emit('join4', 'block');
                }
            }
        }
    });
});

// Revealing the ROLL button to the first player in the room
io.on('connection', function(client) {  
    client.on('start2', function(data) {
        for (let j = 0; j<4; j++){
            for (let k = 0; k<6; k++) {
                if (players[j][k] === client.id) {
                    io.to(players[j][k]).emit('start2', 'block');
                }
            }
        }
    });
});

// Revealiang CHAT after clicking on START button
io.on('connection', function(client) {  
    client.on('start1', function(data) {
        for (let j = 0; j<4; j++){
            for (let k = 0; k<6; k++) {
                if (players[j][k] === client.id) {
                    io.in(rooms[j]).emit('start1', 'block');
                }
            }
        }
    });
});

// Sending counter to the client
io.on('connection', function(client) {  
    client.on('start3', function(data) {
        for (let j = 0; j<4; j++){
            for (let k = 0; k<6; k++) {
                if (players[j][k] === client.id) {
                    io.in(rooms[j]).emit('start3', k);
                }
            }
        }
    });
});

// Rolling the dice and sending the result to the client
io.on('connection', function(client) {  
    client.on('roll1', function(data) {
        for (let j = 0; j<4; j++){
            for (let k = 0; k<6; k++) {
                if (players[j][k] === client.id) {
                    let die1 = Math.floor(Math.random()*6)+1;
                    let die2 = Math.floor(Math.random()*6)+1;
                    dice = die1 + die2;
                    io.in(rooms[j]).emit('roll1', dice);
                }
            }
        }
    });
});

// Revealing BUY and SELL button to the player
io.on('connection', function(client) {  
    client.on('roll2', function(data) {
        for (let j = 0; j<4; j++){
            for (let k = 0; k<6; k++) {
                if (players[j][k] === client.id) {
                    io.to(players[j][k]).emit('roll2', 'block');
                }
            }
        }
    });
});

// After clicking on the NEXT button, the counter increases for 1 and teh next player gets the ROLL button visible
io.on('connection', function(client) {  
    client.on('next1', function(data) {
        for (let j = 0; j<4; j++){
            for (let k = 0; k<6; k++) {
                if (players[j][k] === client.id) {
                    m = k;
                    m++;
                    if (m>players[j].length-1) {
                        m=m-players[j].length;
                    }
                    io.to(players[j][m]).emit('next1', m);
                }
            }
        }
    });
});

// Sending the info about actual player to the rest of the players
io.on('connection', function(client) {  
    client.on('next2', function(data) {
        for (let j = 0; j<4; j++){
            for (let k = 0; k<6; k++) {
                if (players[j][k] === client.id) {
                    io.in(rooms[j]).emit('next2', m);
                }
            }
        }
    });
});

// The server part of the BUYING function
io.on('connection', function(client) {  
    client.on('buy1', function(data) {
        for (let j = 0; j<4; j++){
            for (let k = 0; k<6; k++) {
                if (players[j][k] === client.id) {
                    io.in(rooms[j]).emit('buy1', k);
                }
            }
        }
    });
});

// The server part of the SELLING function
io.on('connection', function(client) {  
    client.on('sell1', function(data) {
        for (let j = 0; j<4; j++){
            for (let k = 0; k<6; k++) {
                if (players[j][k] === client.id) {
                    io.in(rooms[j]).emit('sell1', k);
                }
            }
        }
    });
});

// Setting the players name in the chat
io.on('connection', function(client) {  
    client.on('mess1', function(data) {
        for (let j = 0; j<4; j++){
            for (let k = 0; k<6; k++) {
                if (players[j][k] === client.id) {
                    io.in(rooms[j]).emit('mess1', k);
                }
            }
        }
    });
});

// The chat message
io.on('connection', function(client) {  
    client.on('mess2', function(text) {
        for (let j = 0; j<4; j++){
            for (let k = 0; k<6; k++) {
                if (players[j][k] === client.id) {
                    io.in(rooms[j]).emit('mess2', text);
                }
            }
        }
    });
});







server.listen(3040, function(){
    console.log('listening on *:3040');
  })
