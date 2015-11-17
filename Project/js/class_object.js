var Object = function(x, y, radiusObj, radiusBnd)
{
	this.pos = new Vect(x, y, 0);
	this.radiusObj = radiusObj;
	this.radiusBnd = radiusBnd;
}

Object.prototype.draw = function(ctx)
{
	ctx.save();
	ctx.beginPath();
	ctx.arc(
		this.pos.xPos, 
		this.pos.yPos, 
		12, 
		0, 
		Math.PI * 2);
	ctx.fillStyle = "#FFF";
	ctx.fill();
	ctx.restore();
}