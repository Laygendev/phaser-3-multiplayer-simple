class Player {
    constructor(x, y, main) {
        this.id,
        this.speed = 5000;
        this.position_buffer = [];

        if (main) {
            this.sprite = phaser.physics.add.sprite(x, y, "player");
            phaser.physics.add.collider(collisionLayer, this.sprite);
            phaser.cameras.main.startFollow(this.sprite);
            phaser.cameras.main.zoom = 2;
        } else {
            this.sprite = phaser.add.sprite(x, y, "player");
        }
    }

    remove() {
        this.sprite.destroy();

    }

    applyInput() {
        this.sprite.body.velocity.x = input.press_time * this.speed;
    }
}

export default Player;