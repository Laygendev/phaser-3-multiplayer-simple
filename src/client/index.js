import 'phaser';

import MainScene from './states/MainScene';

let config = {
    type: Phaser.WEBGL,
    pixelArt: true,
    parent: 'content',
    width: 1280,
	height: 720,
    scaleMode: 0,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: true
        }
    },
    scene: [
        MainScene,
    ]
};

let game = new Phaser.Game(config);
