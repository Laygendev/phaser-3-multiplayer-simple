module.exports = NetworkController = {};

NetworkController.last_processed_input = {};

NetworkController.update = function() {
	NetworkController.processInput();
	NetworkController.sendWorld();
}

NetworkController.getAvailableMessage = function() {
	var now = +new Date();
	for (var i = 0; i < NetworkManager.messages.length; i++) {
		var message = NetworkManager.messages[i];
		if (message.recv_ts <= now) {
			NetworkManager.messages.splice(i, 1);
			return message.payload;
		}
	}
}

NetworkController.processInput = function() {
	while (true) {
		var message = NetworkController.getAvailableMessage();

		if (!message) {
			break;
		}

		// Update the state of the entity, based on its input.
		// We just ignore inputs that don't look valid; this is what prevents clients from cheating.
		var id = message.id;

		if (NetworkManager.players[id]) {
			NetworkManager.players[id].applyInput(message);
			NetworkController.last_processed_input[id] = message.input_sequence_number;
		}
	}
}

NetworkController.sendWorld = function() {
	var data = {
		send_ts: +new Date(),
		world_state: []
	};

	for (var key in NetworkManager.players) {
		if ( NetworkManager.players[key] ) {
			data.world_state.push({
				id: NetworkManager.players[key].id,
				x: NetworkManager.players[key].sprite.x,
				y: NetworkManager.players[key].sprite.y,
				last_processed_input: NetworkController.last_processed_input[NetworkManager.players[key].id]
			});
		}
	}

	for (var key in NetworkManager.sockets) {
		if ( NetworkManager.sockets[key] ) {
			data.lag = NetworkManager.sockets[key].lag;
			NetworkManager.sockets[key].emit('1', data);
		}
	}
}
