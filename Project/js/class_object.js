var Object = function(x, y, radius, color)
{
	this.pos = new Vect(x, y, 0);
	this.radius = radius;
	this.color = color;
}

Object.prototype.draw = function(ctx)
{
	ctx.save();
	ctx.beginPath();
	ctx.arc(
		this.pos.x, 
		this.pos.y, 
		this.radius, 
		0, 
		Math.PI * 2);
	ctx.fillStyle = this.color;
	ctx.fill();
	ctx.restore();
}