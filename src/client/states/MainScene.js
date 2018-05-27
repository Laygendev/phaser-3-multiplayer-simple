import Network from './../Network';

class MainScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'MainScene'
		})

		this.network = new Network();
	}

	preload() {
		this.load.tilemapTiledJSON("map", "./assets/maps/Level1.json");
		this.load.spritesheet("tileset", "./assets/maps/01.png", {frameWidth: 32, frameHeight: 32});
		this.load.image("player", "./assets/images/player.png");
	}

	create() {
		this.map = this.make.tilemap({key:"map"});
		this.tiles = this.map.addTilesetImage("01", "tileset");
		this.backgroundLayer = this.map.createDynamicLayer("background", this.tiles, 0, 0);
		this.foregroundLayer = this.map.createDynamicLayer("foreground", this.tiles, 0, 0);
		this.collisionLayer = this.map.createDynamicLayer("collision", this.tiles, 0, 0);
		this.collisionLayer.setCollisionByExclusion([-1]);
		this.cursors = this.input.keyboard.createCursorKeys();
	}

	update() {
		this.network.key_right = false;
		this.network.key_left = false;

		if (this.cursors.left.isDown) {
			this.network.key_left = true;
		} else if (this.cursors.right.isDown) {
			this.network.key_right = true;
		}

		this.network.update();
	}
}

export default MainScene;
