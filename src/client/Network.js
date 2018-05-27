import io from 'socket.io-client';

class Network {
    constructor() {
        this.socket = io.connect('http://127.0.0.1:2000');
        this.socketID;
        this.startTime;
        this.messages = [];
        this.entities = {};

        socket.emit('newPlayer');

        socket.on('youAre', (data) => {
            this.socketID = data.id;
            player = new Player(data.x, data.y, true);
            player.id = data.id;
            player.sprite.tint = 0x58f500;
            entities[network.socketID] = player;
        });

        socket.on("removePlayer", this.removePlayer);

        socket.on('updateWorld', this.updateWorld);


        socket.on('pong', function() {
            latence = Date.now() - startTime;
        });
    }

    update() {
        this.startTime = +Date.now();

        this.socket.emit('ping');

        this.processServerMessage();
    
        if ( ! this.entities[this.socketID] ) {
            return;
        }
    
        this.processInput();
        this.interpolateEntities();
    }

    onNewWorldState(data) {
        let recv_ts = +new Date();
        this.messages.push({
            recv_ts: recv_ts + data.lag,
            payload: data.world_state
        });
    }

    getAvailableMessage() {
        let now = +new Date();
        for (let i = 0; i < this.messages.length; i++) {
            let message = this.messages[i];
            if (message.recv_ts <= now) {
                this.messages.splice(i, 1);
                return message.payload;
            }
        }
    }

    processServerMessage() {
       	while (true) {
            var message = this.getAvailableMessage();

            if (!message) {
                break;
            }

            // World state is a list of entity states.
            for (var i = 0; i < this.message.length; i++) {
                var state = this.message[i];

                // If this is the first time we see this entity, create a local representation.
                if (! entities[state.id] ) {
                    var entity = new Player(state.x, state.y);
                    entity.id = state.id;
                    entities[state.id] = entity;
                }

                var entity = entities[state.id];

                if (state.id == network.socketID) {
                    // Received the authoritative position of this client's entity.
                    entity.sprite.x = state.x;
                    entity.sprite.y = state.y;

                    var j = 0;
                    while (j < this.pending_inputs.length) {
                        var input = this.pending_inputs[j];
                        if (input.input_sequence_number <= state.last_processed_input) {
                            // Already processed. Its effect is already taken into account into the world update
                            // we just got, so we can drop it.
                            this.pending_inputs.splice(j, 1);
                        } else {
                            // Not processed by the server yet. Re-apply it.
                            entity.applyInput(input);
                            j++;
                        }
                    }
                } else {
                    // Received the position of an entity other than this client's.

                    if( entity ) {
                        // Add it to the position buffer.
                        var timestamp = +new Date();
                        entity.position_buffer.push([timestamp, state.x, state.y]);
                    }
                }
            }
        }
    }

    processInput() {
        var now_ts = +new Date();
        var last_ts = this.last_ts || now_ts;
        var dt_sec = (now_ts - last_ts) / 1000.0;
        this.last_ts = now_ts;
    
        // Package player's input.
        var input;
        if (this.key_right) {
        input = { press_time: dt_sec };
        } else if (this.key_left) {
        input = { press_time: -dt_sec };
        } else {
        // Nothing interesting happened.
        input = { press_time: 0 };
        }
    
        // Send the input to the server.
        input.input_sequence_number = this.input_sequence_number++;
        input.id = this.socketID;
        input.lag = latence;
        this.socket.emit(0, input);
    
        entities[this.socketID].applyInput(input);
    
        this.pending_inputs.push(input);

    }

    interpolateEntities() {
        //Compute render timestamp.
        var now = +new Date();
        var render_timestamp = now - (1000.0 / rate);

        for (var i in entities) {
            var entity = entities[i];

            // No point in interpolating this client's entity.
            if (entity.id == this.socketID) {
                continue;
            }

            // Find the two authoritative positions surrounding the rendering timestamp.
            var buffer = entity.position_buffer;

            // Drop older positions.
            while (buffer.length >= 2 && buffer[1][0] <= render_timestamp) {
                buffer.shift();
            }

            // Interpolate between the two surrounding authoritative positions.
            if (buffer.length >= 2 && buffer[0][0] <= render_timestamp && render_timestamp <= buffer[1][0]) {
                var x0 = buffer[0][1];
                var x1 = buffer[1][1];
                var y0 = buffer[0][2];
                var y1 = buffer[1][2];
                var t0 = buffer[0][0];
                var t1 = buffer[1][0];

                entity.sprite.x = x0 + (x1 - x0) * (render_timestamp - t0) / (t1 - t0);
                entity.sprite.y = y0 + (y1 - y0) * (render_timestamp - t0) / (t1 - t0);
            }
        }
    }
}

export default Network;