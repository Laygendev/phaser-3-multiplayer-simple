import World from './World';
import Body from './Body';

class Boot {
	constructor() {
		this.World = new World();
		this.rate = 60;

		this.body = new Body(64, 64);
		console.log(this.body);

		setInterval( () => { this.update(); }, 1000 / this.rate);
	}

	update() {
		this.World.update();
	}
}

export default Boot;
