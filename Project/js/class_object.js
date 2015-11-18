var Object = function(x, y, radius)
{
	this.pos = new Vect(x, y, 0);
	this.vel = new Vect(0, 0, 0);
	this.radius = radius;
}

Object.prototype.draw = function(ctx, color)
{
	ctx.save();
	ctx.beginPath();
	ctx.arc(
		this.pos.x, 
		this.pos.y, 
		this.radius, 
		0, 
		Math.PI * 2);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.restore();
}

Object.prototype.move = function()
{
	this.pos.add(this.vel);
}