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
    canvas : undefined,			// Canvas
    ctx : undefined,			// Canvas context
   	lastTime : 0, 				// used by calculateDeltaTime() 
    debug : true,				// debug
	animationID : 0,			//ID index of the current frame.
	
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
		this.ctx = this.canvas.getContext('2d');
		
		//Game objects
		this.player = new Object(
			300,
			300,
			20,
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
		this.player.pos.x += 200 * dt;
		
		//Save
		this.ctx.save();
		
		//Transform
		this.scaleByPos(.75);
		
		//Draw
		this.player.draw(this.ctx);
		this.target.draw(this.ctx);
		
		//Restore
		this.ctx.restore();
		
		//Draw debug info
		if (this.debug)
		{
			// draw dt in bottom right corner
			this.fillText("dt: " + dt.toFixed(3), this.WIDTH - 140, this.HEIGHT - 10, "18pt courier", "white");
		}
	},
	
	//Set view transform based on implicit player and target and explicit multiplier
	scaleByPos : function(multiplier)
	{
		//Midpoint between the player and target
		var diffX = (this.player.pos.x + this.target.pos.x) / 2;
		var diffY = (this.player.pos.y + this.target.pos.y) / 2;
		
		//Distance between the player and target
		var distX = Math.abs(this.player.pos.x - this.target.pos.x) + this.target.radius * 2;
		var distY = Math.abs(this.player.pos.y - this.target.pos.y) + this.target.radius * 2;
		
		//Scale to the target
		var scale = 1;
		
		if(distX > distY)
		{
			scale = multiplier * this.WIDTH / distX;
		}
		else
		{
			scale = multiplier * this.HEIGHT / distY;
		}
		this.ctx.scale(
			scale, scale);
		this.ctx.translate(
			1 / scale * this.WIDTH / 2 - diffX,
			1 / scale * this.HEIGHT / 2 - diffY);
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