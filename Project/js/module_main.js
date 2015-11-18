// main.js
// Dependencies: 
// Description: singleton object
// This object will be our main "controller" class and will contain references
// to most of the other objects in the game.

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

/*
 .main is an object literal that is a property of the app global
 This object literal has its own properties and methods (functions)
 
 */
app.main =
{
    WIDTH : 480, 				// Canvas width
    HEIGHT : 480,				// Canvas height
	SIZE : undefined,
	
    canvas : undefined,			// Canvas
    ctx : undefined,			// Canvas context
   	lastTime : 0, 				// used by calculateDeltaTime() 
    debug : true,				// debug
	animationID : 0,			// ID index of the current frame.
	mouseDown : false,			// If mouse is down.
	mousePosRaw : undefined,	// Mouse position
	mousePos : undefined,		// Mouse position with translation and scaling.
	
	transX : 0,
	transY : 0,
	scale : 1,
	
	color : "#FFF",
	
	bgImage : undefined,
	
	player : undefined,
	target : undefined,
	
    //Initialization
	init : function()
	{
		//Init log
		console.log("app.main.init() called");
		
		// init canvas
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.canvas.style.cursor = "none";
		this.ctx = this.canvas.getContext('2d');
		this.SIZE = Math.min(this.WIDTH, this.HEIGHT);
		
		//Hook up mouse events
		this.canvas.onmousedown = this.doMousedown.bind(this);
		this.canvas.onmouseup = this.doMouseup.bind(this);
		this.canvas.onmousemove = this.doMousemove.bind(this);
		
		this.bgImage = new Image(128, 128);
		this.bgImage.src = "assets/temp.png";
		console.log(this.bgImage);
		
		//Mouse position
		this.mousePosRaw = new Vect(0, 0, 0);
		this.mousePos = new Vect(0, 0, 0);
		
		//Game objects
		this.player = new Object(
			300,
			50,
			15,
			"#FFF");
			
		this.target = new Object(
			300,
			300,
			80,
			"#FFF");
		
		// start the game loop
		this.update();
	},
	
	//Core update
	update : function()
	{
		//LOOP
	 	this.animationID = requestAnimationFrame(this.update.bind(this));
	 	
	 	//Calculate Delta Time of frame
	 	var dt = this.calculateDeltaTime();
		
		//Clear
		this.ctx.save();
		this.ctx.fillStyle = "#000";
		this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
		this.ctx.restore();
		
		//Logic
		this.mousePos = this.mousePosRaw.getDiv(this.scale).getSub(new Vect(this.transX, this.transY, 0));
		
		if(this.mouseDown)
		{
			this.player.vel.add(this.mousePos.getSub(this.player.pos).getNorm().getMult(25 * dt));
		}
		
		if(this.checkCollision())
		{
			this.target.vel = this.player.vel;
			this.player.vel = new Vect(0, 0, 0);
		}
		
		this.player.vel.mult(.95);
		this.player.move();
		
		this.target.vel.mult(.99);
		this.target.move();
		
		//Save
		this.ctx.save();
		
		//Transform
		this.scaleByPos(.75);
		
		//Draw
		this.drawBG(this.ctx);
		this.player.draw(this.ctx, this.color);
		this.target.draw(this.ctx, this.color);
		
		//Restore
		this.ctx.restore();
		
		this.ctx.beginPath();
		this.ctx.arc(
			this.mousePosRaw.x,
			this.mousePosRaw.y,
			12,
			0,
			Math.PI * 2);
		this.ctx.fillStyle = "rgba(0, 200, 200, 0.8)";
		this.ctx.fill();
		
		//Draw debug info
		if (this.debug)
		{
			// draw dt in bottom right corner
			this.fillText("dt: " + dt.toFixed(3), this.WIDTH - 140, this.HEIGHT - 10, "18pt courier", "white");
		}
	},
	
	//Mouse down actions.
	doMousedown: function(e)
	{	
		//Increment mouseDown to 1 (true)
		this.mouseDown = true;
	},
	
	//Mouse up actions
	doMouseup: function(e)
	{	
		//Decrement mouseDown to 0 (false)
		this.mouseDown = false;
	},
	
	//Mouse move tracking
	doMousemove : function(e)
	{
		this.mousePosRaw = getMouse(e, 0, 0);
	},
	
	//Set view transform based on implicit player and target and explicit multiplier
	scaleByPos : function(multiplier)
	{
		//Midpoint between the player and target
		var diffX = (this.player.pos.x + this.target.pos.x) / 2;
		var diffY = (this.player.pos.y + this.target.pos.y) / 2;
		
		//Distance between the player and target
		var dist = Math.sqrt(
			(this.player.pos.x - this.target.pos.x) * (this.player.pos.x - this.target.pos.x) +
			(this.player.pos.y - this.target.pos.y) * (this.player.pos.y - this.target.pos.y)) + this.target.radius * 2;
		
		//Scale to keep both player and target in 
		this.scale = multiplier * this.SIZE / dist;
		
		//Scale canvas
		this.ctx.scale(
			this.scale, this.scale);
		
		//Transformation to keep canvas around midpoint.
		this.transX = 1 / this.scale * this.WIDTH / 2 - diffX;
		this.transY = 1 / this.scale * this.HEIGHT / 2 - diffY;
		
		//Translate canvas
		this.ctx.translate(
			this.transX,
			this.transY);
	},
	
	//Check for collision between player and target, return true if collision occured.
	checkCollision : function()
	{
		var dist =
			(this.player.pos.x - this.target.pos.x) * (this.player.pos.x - this.target.pos.x) + 
			(this.player.pos.y - this.target.pos.y) * (this.player.pos.y - this.target.pos.y);
		var bord = (this.player.radius + this.target.radius) * (this.player.radius + this.target.radius);
		
		return dist < bord;
	},
	
	//Draw the tiled background.
	drawBG : function(ctx)
	{
		var originX = -this.transX - (-this.transX % this.bgImage.width);
		var originY = -this.transY - (-this.transY % this.bgImage.height);
		
		var countX = Math.ceil(this.WIDTH / (this.scale * this.bgImage.width)) + 1;
		var countY = Math.ceil(this.HEIGHT / (this.scale * this.bgImage.height)) + 1;
		for(var j = -1; j < countY; j++)
		{
			for(var i = -1; i < countX; i++)
			{
				ctx.drawImage(this.bgImage, originX + i * this.bgImage.width, originY + j * this.bgImage.height);
			}
		}
	},
	
	//Draw filled text
	fillText : function(string, x, y, css, color)
	{
		this.ctx.save();
		// https://developer.mozilla.org/en-US/docs/Web/CSS/font
		this.ctx.font = css;
		this.ctx.fillStyle = color;
		this.ctx.fillText(string, x, y);
		this.ctx.restore();
	},
	
	//Calculate delta-time
	calculateDeltaTime : function()
	{
		// what's with (+ new Date) below?
		// + calls Date.valueOf(), which converts it from an object to a 	
		// primitive (number of milliseconds since January 1, 1970 local time)
		var now,fps;
		now = (+new Date); 
		fps = 1000 / (now - this.lastTime);
		fps = clamp(fps, 12, 60);
		this.lastTime = now; 
		return 1/fps;
	},
}; // end app.main