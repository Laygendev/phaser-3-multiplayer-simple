module.exports = NetworkManager = {};

NetworkManager.messages = [];
NetworkManager.sockets = {};
NetworkManager.players = {};

NetworkManager.onNewPlayer = function(socket, data) {
	var player = NetworkManager.findPlayerById(socket.id);
	socket.emit('youAre', {
		id: socket.id,
		x: player.sprite.x,
		y: player.sprite.y
	});
};

NetworkManager.onClientDisconnect = function(socket, data) {
	NetworkManager.deletePlayerById(socket.id);
	NetworkManager.deleteSocketById(socket.id);

	console.log("removing player " + socket.id);

	socket.broadcast.emit('removePlayer', {id: socket.id});
};

NetworkManager.onGiveMePlayers = function(socket, data) {
	var tmpList = [];
	for( var key in NetworkManager.players ) {
		if ( NetworkManager.players[key].id != socket.id ) {
			tmpList.push({
				id: NetworkManager.players[key].id,
				x: NetworkManager.players[key].sprite.x,
				y: NetworkManager.players[key].sprite.y
			});
		}
	}
	socket.emit('listPlayer', tmpList);
};

NetworkManager.onMove = function(socket, data) {
	var recv_ts = +new Date();
	socket.lag = data.lag;
	this.messages.push({
		recv_ts: recv_ts + data.lag,
		payload: data
	});
};

NetworkManager.deletePlayerById = function(id) {
	for (var key in NetworkManager.players) {
		if (NetworkManager.players[key].id == id) {
			delete NetworkManager.players[key];
		}
	}
};

NetworkManager.findPlayerById = function(id) {
	for (var key in NetworkManager.players) {

		if (NetworkManager.players[key].id == id) {
			return NetworkManager.players[key];
		}
	}

	return false;
};

NetworkManager.deleteSocketById = function(id) {
	for (var key in NetworkManager.sockets) {
		if (NetworkManager.sockets[key].id == id) {
			delete NetworkManager.sockets[key];
		}
	}
}

NetworkManager.findSocketById = function(id) {
	for (var key in NetworkManager.sockets) {
		if (NetworkManager.sockets[key].id == id) {
			return NetworkManager.sockets[key];
		}
	}

	return false;
}
