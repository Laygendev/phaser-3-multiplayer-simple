// var socket;
// socket = io.connect('http://127.0.0.1:2000');
// var startTime;
// var network = {};
// var latence;
//
// network.socketID;
// // Reconciliation
// network.input_sequence_number = 0;
// network.pending_inputs = [];
// network.messages = [];
//
// network.key_right = false;
// network.key_left = false;
//
//
// network.create = function() {
// 	socket.emit('newPlayer');
//
// 	socket.on('youAre', (data) => {
// 		console.log('You are: ' + data.id );
// 		network.socketID = data.id;
// 		player = new Player(data.x, data.y, true);
// 		player.id = data.id;
// 		player.sprite.tint = 0x58f500;
// 		entities[network.socketID] = player;
// 	});
//
// 	socket.on("removePlayer", game.removePlayer);
//
// 	socket.on('1', network.move);
//
//
// 	socket.on('pong', function() {
// 		latence = Date.now() - startTime;
// 	});
// };
//
// network.update = function() {
// 	startTime = +Date.now();
// 	socket.emit('dzkaodkzadop');
// 	network.processServerMessage();
//
// 	if ( ! entities[network.socketID] ) {
// 		return;
// 	}
//
// 	network.processInput();
//   network.interpolateEntities();
// };
//
// network.processInput = function() {
// 	var now_ts = +new Date();
//   var last_ts = network.last_ts || now_ts;
//   var dt_sec = (now_ts - last_ts) / 1000.0;
//   network.last_ts = now_ts;
//
//   // Package player's input.
//   var input;
//   if (network.key_right) {
//     input = { press_time: dt_sec };
//   } else if (network.key_left) {
//     input = { press_time: -dt_sec };
//   } else {
//     // Nothing interesting happened.
//     input = { press_time: 0 };
//   }
//
//   // Send the input to the server.
//   input.input_sequence_number = network.input_sequence_number++;
//   input.id = network.socketID;
// 	input.lag = latence;
//   socket.emit(0, input);
//
//   entities[network.socketID].applyInput(input);
//
//   network.pending_inputs.push(input);
// };
//
// network.move = function(data) {
// 	var recv_ts = +new Date();
// 	network.messages.push({
// 		recv_ts: recv_ts + data.lag,
// 		payload: data.world_state
// 	});
// };
//
// function getAvailableMessage() {
// 	var now = +new Date();
// 	for (var i = 0; i < network.messages.length; i++) {
// 	  var message = network.messages[i];
// 	  if (message.recv_ts <= now) {
// 	    network.messages.splice(i, 1);
// 	    return message.payload;
// 	  }
// 	}
// }
//
// network.processServerMessage = function() {
// 	while (true) {
// 		var message = getAvailableMessage();
//
// 		if (!message) {
// 			break;
// 		}
//
// 		// World state is a list of entity states.
// 		for (var i = 0; i < message.length; i++) {
// 			var state = message[i];
//
// 			// If this is the first time we see this entity, create a local representation.
// 			if (! entities[state.id] ) {
// 				var entity = new Player(state.x, state.y);
// 				entity.id = state.id;
// 				entities[state.id] = entity;
// 			}
//
// 			var entity = entities[state.id];
//
// 			if (state.id == network.socketID) {
// 				// Received the authoritative position of this client's entity.
// 				entity.sprite.x = state.x;
// 				entity.sprite.y = state.y;
//
// 				var j = 0;
// 				while (j < this.pending_inputs.length) {
// 					var input = this.pending_inputs[j];
// 					if (input.input_sequence_number <= state.last_processed_input) {
// 						// Already processed. Its effect is already taken into account into the world update
// 						// we just got, so we can drop it.
// 						this.pending_inputs.splice(j, 1);
// 					} else {
// 						// Not processed by the server yet. Re-apply it.
// 						entity.applyInput(input);
// 						j++;
// 					}
// 				}
// 			} else {
// 				// Received the position of an entity other than this client's.
//
// 				if( entity ) {
// 					// Add it to the position buffer.
// 					var timestamp = +new Date();
// 					entity.position_buffer.push([timestamp, state.x, state.y]);
// 				}
// 			}
// 		}
// 	}
// };
//
// network.interpolateEntities = function() {
// 	// Compute render timestamp.
// 	var now = +new Date();
// 	var render_timestamp = now - (1000.0 / rate);
//
// 	for (var i in entities) {
// 		var entity = entities[i];
//
// 		// No point in interpolating this client's entity.
// 		if (entity.id == network.socketID) {
// 			continue;
// 		}
//
// 		// Find the two authoritative positions surrounding the rendering timestamp.
// 		var buffer = entity.position_buffer;
//
// 		// Drop older positions.
// 		while (buffer.length >= 2 && buffer[1][0] <= render_timestamp) {
// 			buffer.shift();
// 		}
//
// 		// Interpolate between the two surrounding authoritative positions.
// 		if (buffer.length >= 2 && buffer[0][0] <= render_timestamp && render_timestamp <= buffer[1][0]) {
// 			var x0 = buffer[0][1];
// 			var x1 = buffer[1][1];
// 			var y0 = buffer[0][2];
// 			var y1 = buffer[1][2];
// 			var t0 = buffer[0][0];
// 			var t1 = buffer[1][0];
//
// 			entity.sprite.x = x0 + (x1 - x0) * (render_timestamp - t0) / (t1 - t0);
// 			entity.sprite.y = y0 + (y1 - y0) * (render_timestamp - t0) / (t1 - t0);
// 		}
// 	}
// };
//
// // network.fakeUpdate = function() {
// // 	// send request with network.queueSocketData
// // 	// jQuery.ajax({
// // 	// 	url: 'http://127.0.0.1:3000/client',
// // 	// 	type: 'POST',
// // 	// 	contentType: 'application/json',
// // 	// 	data: JSON.stringify(network.queueSocketData),
// // 	// 	dataType: 'json',
// // 	// 	success: function(data) {
// // 	// 		console.log(data);
// // 	// 	}
// // 	// });
// // };
// // setInterval(network.fakeUpdate, 5000);
//
// network.emit = function() {
// 	// socket.emit('move', {
// 	// 	x: player.player.x,
// 	// 	y: player.player.y
// 	// });
// }
//
// network.addToQueue = function(name, data ) {
// 	var today = new Date();
//
//   var currentTime = today.getHours() + ":" + today.getMinutes();
//
// 	if ( ! network.queueSocketData[currentTime] ) {
// 		network.queueSocketData[currentTime] = [];
// 	}
//
// 	network.queueSocketData[currentTime].push({
// 		id: network.socketID,
// 		time: currentTime,
// 		name: name,
// 		data: data
// 	})
// }
//
//
// network.deletePlayerById = function(id) {
// 	for (var key in entities) {
// 		if (entities[key].id == id) {
// 			entities[key].remove();
// 			delete entities[key];
// 		}
// 	}
// };
//
// network.findPlayerById = function(id) {
// 	for (var key in entities) {
//
// 		if (entities[key].id == id) {
// 			return entities[key];
// 		}
// 	}
//
// 	return false;
// };
