import Vector2 from './Math/Vector2';

class Body {
	constructor(width, height) {
		this.width = width;
		this.height = height;

		this.transform = {
			x: 0,
			y: 0
		};

		this.position = new Vector2(0, 0);
		console.log(this.position);
	}
}

export default Body;
