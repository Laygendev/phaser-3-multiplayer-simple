// var config = {
//     type: Phaser.WEBGL,
//     width: 1280,
//     height: 720,
//     pixelArt: true,
//     zoom: 1,
//     physics: {
//         default: 'arcade',
//         arcade: {
//             debug: true,
//             gravity: {y: 500}
//         }
//     },
//     scene: {
//     	key: "main",
//       preload: preload,
//       create: create,
//       update: update
//     }
// };
//
//
//
// var games = new Phaser.Game(config);
// var phaser;
// var map;
// var entities = {};
// var cursors;
// var foregroundLayer, backgroundLayer, collisionLayer;
// var text;
// var rate = 60;
//
// function preload ()
// {
// 		phaser = this;
//     this.load.tilemapTiledJSON("map", "./assets/maps/Level1.json");
//     this.load.spritesheet("tileset", "./assets/maps/01.png", {frameWidth: 32, frameHeight: 32});
//     this.load.image("player", "./assets/images/player.png");
// }
//
// function create ()
// {
//     map = this.make.tilemap({key:"map"});
//     var tiles = map.addTilesetImage("01", "tileset");
//     backgroundLayer = map.createDynamicLayer("background", tiles, 0, 0);
//     foregroundLayer = map.createDynamicLayer("foreground", tiles, 0, 0);
//     collisionLayer = map.createDynamicLayer("collision", tiles, 0, 0);
//     collisionLayer.setVisible(false);
//     collisionLayer.setCollisionByExclusion([-1]);
//
//     network.create();
//
//     cursors = this.input.keyboard.createCursorKeys();
// }
//
// function update ()
// {
//     network.key_right = false;
//     network.key_left = false;
//
//     if (cursors.left.isDown) // if the left arrow key is down
//     {
//         network.key_left = true;
//     }
//     else if (cursors.right.isDown) // if the right arrow key is down
//     {
//         network.key_right = true;
//     }
//
//     network.update();
// }
//
// function updateNetworkCursor() {
//   var cursorChangeState = false;
//
// }
//
// var game = {};
//
// game.removePlayer = function(data) {
// 	network.deletePlayerById(data.id);
// };
