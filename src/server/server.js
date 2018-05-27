var rate = 10;

var config = {
    type: Phaser.HEADLESS,
    width: 1280,
    height: 720,
    pixelArt: true,
    zoom: 1,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 500}
        }
    },
    scene: {
    	key: "main",
      preload: preload,
      create: create,
      update: update
    }
};

var game = new Phaser.Game(config);
var foregroundLayer, backgroundLayer, collisionLayer;
var map;

// Phaser func
function preload() {
  phaser = this;
  this.load.tilemapTiledJSON("map", "./public/maps/Level1.json");
  this.load.spritesheet("tileset", "./public/maps/01.png", {frameWidth: 32, frameHeight: 32});
  this.load.image("player", "./public/images/player.png");
}

function create() {
  map = this.make.tilemap({key:"map"});
  var tiles = map.addTilesetImage("01", "tileset");
  backgroundLayer = map.createDynamicLayer("background", tiles, 0, 0);
  foregroundLayer = map.createDynamicLayer("foreground", tiles, 0, 0);
  collisionLayer = map.createDynamicLayer("collision", tiles, 0, 0);
  collisionLayer.setVisible(false);
  collisionLayer.setCollisionByExclusion([-1]);


  io.on('connection', function(socket) {
    console.log('new socket: ' + socket.id);
    NetworkManager.sockets[socket.id] = socket;

  	var player = new Player(collisionLayer);
  	player.id = socket.id;
    NetworkManager.players[socket.id] = player;

  	socket.on("newPlayer", (data) => { NetworkManager.onNewPlayer(socket, data); });
  	socket.on("disconnect", (data) => { NetworkManager.onClientDisconnect(socket, data); });
  	socket.on("giveMePlayers", (data) => { NetworkManager.onGiveMePlayers(socket, data); });
  	socket.on("0", (data) => { NetworkManager.onMove(socket, data); });
		socket.on("dzkaodkzadop", () => {
			socket.emit("pong");
		});

    socket.on("velocityOption", (data) => {
      console.log(data);
      useVelocity = Boolean(data);
      console.log(useVelocity);
      console.log('Change velocity option to ' + useVelocity);
    })

  });
}

var lastDate = new Date();

function update() {}

setInterval(NetworkController.update, 1000 / rate );
