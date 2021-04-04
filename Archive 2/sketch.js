/*

The Game Project 5 - Bring it all together

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var game_score;
var flagpole;
var lives;
var enemies;

var d;

var platforms;

function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
    lives = 4;
    
    startGame();	
}

// ---------------------
// Key control functions
// ---------------------

function keyPressed(){
    
    if(flagpole.isReached && key == ' ')
{
    nextLevel();
    return
}
else if(lives == 0 && key == ' ')
{
    returnToStart();
    return
}

	console.log("press" + keyCode);
	console.log("press" + key);
    
        if (keyCode === 37)
        
        {
            
            isLeft = true;
            console.log("isLeft:" + isLeft);
            
        }
    
        if(keyCode === 39)
            
            {
                
                isRight = true;
                console.log("isRight:" + isRight);
                
            }
    
        if(keyCode === 32) 
            {
                isPlummeting = true;
            }
    

}

function keyReleased()
{

	console.log("release" + keyCode);
	console.log("release" + key);
    
    if (keyCode === 37)
        
        {
            
            isLeft = false;
            console.log("isLeft:" + isLeft);
            
        }
    
        if(keyCode === 39)
            
            {
                
                isRight = false;
                console.log("isRight:" + isRight);
                
            }
    
        if(keyCode === 32) 
            {
                isPlummeting = false;
            }

}


// ------------------------------
// Game character render function
// ------------------------------

function startGame(){
    gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
    
    

	// Initialise arrays of scenery objects.
    trees_x = [100,352, 604, 1200, 1452, 1704, 2400];
    
    clouds = [{x_pos: 100, y_pos: 100, size: 50},
              {x_pos: 300, y_pos: 100, size: 50},
              {x_pos:700, y_pos: 100, size:50},
              {x_pos: 1000,y_pos:100, size:50}
            ];

    mountains = [
        {x_pos: -1000, y_pos: 100},
        {x_pos: 100, y_pos: 100},
        {x_pos: 1400, y_pos: 100},
        {x_pos: 2700, y_pos: 100},
        {x_pos: 4000, y_pos: 100},
        {x_pos: 5300, y_pos: 100},
    ];
    
    collectable = [
        {x_pos: -1600, y_pos: floorPos_y, size:30, isFound: false},
        {x_pos: -950, y_pos: floorPos_y, size:30, isFound: false},
        {x_pos: 35, y_pos: floorPos_y - 37, size:30, isFound: false},
        {x_pos: 1850, y_pos: floorPos_y - 190, size:30, isFound: false},
        {x_pos: 2500, y_pos: floorPos_y, size:30, isFound: false},
        {x_pos: 3600, y_pos: floorPos_y, size:30, isFound: false},
        {x_pos: 4000, y_pos: floorPos_y, size:30, isFound: false},
        
    ];
        
    
    canyon = [
        
        {x_pos: -2400, width:100},
        {x_pos: -1200, width:100},
        {x_pos: 0, width:100},
        {x_pos: 1200, width:100},
        {x_pos: 2400, width:100},
        {x_pos: 3600, width:100},
        {x_pos: 4800, width:100},
    ];
    
    game_score = 0;
    
    flagpole = {
        
        x_pos: 4700,
        isReached: false
    }
    
    lives -= 1;
    
    platforms = [];
    
    platforms.push(createPlatform(0, floorPos_y - 50, 100));
    
    platforms.push(createPlatform(300, floorPos_y - 100, 100));
    
    platforms.push(createPlatform(400, floorPos_y - 150, 300));
    
    platforms.push(createPlatform(1700, floorPos_y - 200, 300));
    
    platforms.push(createPlatform(1550, floorPos_y - 150, 100));
    
    platforms.push(createPlatform(1420, floorPos_y - 100, 100));
        
    
    enemies = [];    
    enemies.push(new Enemy(0, floorPos_y, 100));
    
}

function draw()
{
    
	background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    
    push();
    translate(scrollPos, 0);

	// Draw clouds.
    for(var i = 0; i < clouds.length; i++){
    drawCloud(clouds[i]);
    }
    
	// Draw mountains.
    for(var i = 0; i < mountains.length; i++ ){
        drawMountains(mountains[i]);
    }

	// Draw trees.
    drawTree();
    

	// Draw canyons.
    for(var i = 0; i < canyon.length; i++ ){
        drawCanyon(canyon[i]);
        checkCanyon(canyon[i]);
    }

	// Draw collectable items.
    for(var i = 0; i < collectable.length; i++ ){
        if(collectable[i].isFound == false){
        
        drawCollectable(collectable[i]);
            checkCollectable(collectable[i]);
        }
    }
    
    renderFlagpole(); 
    
    for(var i = 0; i < platforms.length; i ++){
        
        platforms[i].draw();
    }
    
    for(var i = 0; i < enemies.length; i ++){
        
        enemies[i].update();
        enemies[i].draw();
        
        if(enemies[i].isContact(gameChar_world_x, gameChar_y)){
            
            startGame();
            break;
        }
    }
    
    pop();

	// Draw game character.
	
	drawGameChar();
    
    if(gameChar_y > height && lives > 0){
       startGame();
   }
    
    //game token
    
    for(var i = 0; i < lives; i++){
        rect(30+i*40, 30, 30, 30)
    }
    
    if(lives < 1){
        fill(255);
        textSize(40);
        stroke(0)
        text("Game Over. Press space to continue", width/2 - 300, height/2);
        return;
    }
    
    if(flagpole.isReached == true){
        fill(255);
        textSize(40);
        stroke(0)
        text("Level complete. Press space to continue.", width/2 - 300, height/2);
        return;
    }
    
    // draw screen text
    fill(255);
    noStroke();
    textSize(20);
    text("score: " + game_score, 20, 20);

	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}
    
    

	// Logic to make the game character rise and fall.
        if ((isPlummeting == true && gameChar_y == floorPos_y) || (isPlummeting == true && isContact == true ))
            {
                gameChar_y -= 100; 
            };
    
        
        if (gameChar_y !== floorPos_y){
            isContact = false;
            
            for(var i = 0; i < platforms.length; i++){
                if(platforms[i].checkContact(gameChar_world_x, gameChar_y) == true){
                    isContact = true;
                    break;
                }
            }
        
        if(isContact == false)
        {
            isFalling == true;
            gameChar_y += 4;
        } else {
            isFalling = false;
        }
        
        } else {
            isFalling == false;
        }

    
    if(flagpole.isReached != true){
        
        checkFlagpole(); 
    }
    
    

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;  
}

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
    
    if(isLeft && isFalling)
	{
		// add your jumping-left code
        
            //head
    fill(0,255,0); rect( gameChar_x - 5, gameChar_y - 63,10,20);
    //antenna
    fill(0,255,0); rect(gameChar_x - 2, gameChar_y - 68,3,5);
    fill(0,255,0); rect( gameChar_x - 6, gameChar_y - 72,10,4);
    //eye
    fill(255,255,255); ellipse(gameChar_x - 4, gameChar_y - 58,5,5);
    //pupil
    fill(0,0,0); ellipse(gameChar_x - 5, gameChar_y - 58,2,2);
    //mouth
    fill(0,0,0); rect(gameChar_x - 5, gameChar_y - 49,4,3);
    //neck
    fill(0,255,0); rect(gameChar_x - 2, gameChar_y - 44,5,5);
    //body
    fill(0,255,0); rect(gameChar_x - 6, gameChar_y - 40,14,20);
    //arm
    fill(0,0,0); rect(gameChar_x - 2, gameChar_y - 36,5,5);
    //wheel foot
    fill(0,0,0); ellipse(gameChar_x + 1, gameChar_y - 21,10,10);

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
        
            //head
    fill(0,255,0); rect(gameChar_x - 5, gameChar_y - 63,10,20);
    //antenna
    fill(0,255,0); rect(gameChar_x - 2, gameChar_y - 68,3,5);
    fill(0,255,0); rect(gameChar_x - 5, gameChar_y - 71,10,4);
    //right eye
    fill(255,255,255); ellipse( gameChar_x + 3, gameChar_y -59,5,5);
    //pupil
    fill(0,0,0); ellipse(gameChar_x + 4, gameChar_y - 59,2,2);
    //mouth
    fill(0,0,0); rect(gameChar_x + 1, gameChar_y - 49,4,3);
    //neck
    fill(0,255,0); rect(gameChar_x - 2, gameChar_y - 44,5,5);
    //body
    fill(0,255,0); rect( gameChar_x - 7, gameChar_y - 41,14,20);
    //arm
    fill(0,0,0); rect(gameChar_x - 3, gameChar_y - 37,5,5);
    //wheel foot
    fill(0,0,0); ellipse(gameChar_x, gameChar_y - 22,10,10);
    

	}
	else if(isLeft)
	{
		// add your walking left code
        
            //head
    fill(0,255,0); rect(gameChar_x - 5, gameChar_y - 62,10,20);
    //neck
    fill(0,255,0); rect(gameChar_x - 3, gameChar_y - 43,5,5);
    //body
    fill(0,255,0); rect(gameChar_x - 7, gameChar_y - 38,14,20);
    //mouth
    fill(0,0,0); rect(gameChar_x - 5, gameChar_y - 47,4,3);
   //wheel foot
   fill(0,0,0); ellipse(gameChar_x + 4, gameChar_y - 9, 10, 10); 
    //left arm
    fill(0,0,0); rect(gameChar_x - 3, gameChar_y - 33, 5, 5);
    //left eye
    fill(255,255,255); ellipse( gameChar_x - 4, gameChar_y - 57,5,5);
    fill(0,0,0); ellipse(gameChar_x - 5, gameChar_y - 57, 2, 2);
    //antenna
    fill(0,255,0); rect(gameChar_x - 2, gameChar_y - 67,3,5);
    fill(0,255,0); rect( gameChar_x - 4, gameChar_y - 67,8,3);

	}
	else if(isRight)
	{
		// add your walking right code
        
     //head
    fill(0,255,0); rect(gameChar_x - 5, gameChar_y - 62,10,20);
    //eye
    fill(255,255,255); ellipse(gameChar_x + 3, gameChar_y - 58,5,5);
    //pupil
    fill(0,0,0); ellipse(gameChar_x + 4, gameChar_y - 58,2,2);
    //mouth
    fill(0,0,0); rect( gameChar_x + 1, gameChar_y - 49,4,3);
    //neck
     fill(0,255,0); rect( gameChar_x - 2, gameChar_y - 43,5,5);
    //body
    fill(0,255,0); rect(gameChar_x - 6, gameChar_y - 39,14,20);
    //arm
    fill(0,0,0); rect(gameChar_x - 2, gameChar_y - 34,5,5);
    //wheel foot
    fill(0,0,0); ellipse(gameChar_x - 4, gameChar_y - 11,10,10);
    //antenna
    fill(0,255,0); rect(gameChar_x - 2, gameChar_y - 67,3,5);
    fill(0,255,0); rect(gameChar_x - 5, gameChar_y - 68,8,3);

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
        
            //head
    fill(0,255,0); rect(gameChar_x - 16, gameChar_y - 60,30,20);
    //antenna
    fill(0,255,0); rect( gameChar_x - 4,gameChar_y - 66,3,7);
    fill(0,255,0); rect(gameChar_x - 6, gameChar_y - 68,10,5);
    //neck
    fill(0,255,0); rect( gameChar_x - 6, gameChar_y - 41,10,6);
    //body
    fill(0,255,0); rect( gameChar_x - 17, gameChar_y - 35,32,24);
    //wheel foot
    fill(0,0,0); ellipse( gameChar_x - 1, gameChar_y - 11,10,10);
    //Right eye
    fill(255,255,255); ellipse( gameChar_x - 8, gameChar_y - 54,5,5);
    fill(0,0,0); ellipse( gameChar_x - 8, gameChar_y - 54, 2, 2);
    //left eye
    fill(255,255,255); ellipse( gameChar_x + 6, gameChar_y -54, 5, 5);
    fill(0,0,0); ellipse( gameChar_x + 6 , gameChar_y -55, 2, 2);
    //mouth
    fill(0,0,0); rect(gameChar_x - 7, gameChar_y -48, 13, 4);
    //tooth
    fill(255,255,255); rect(gameChar_x - 3, gameChar_y - 47,2,2);
    //right arm
    fill(0,0,0); rect(gameChar_x + 18, gameChar_y - 30,6,7);
    //left arm
    fill(0,0,0); rect( gameChar_x - 24, gameChar_y - 30,6,7);

	}
	else
	{
		// add your standing front facing code
        
        //head
    fill(0,255,0); rect( gameChar_x - 17, gameChar_y - 63, 30, 20);
    //neck
    fill(0,255,0); rect( gameChar_x - 6, gameChar_y - 44,10,6);
    //body
    fill(0,255,0); rect( gameChar_x - 17, gameChar_y - 39,32,28);
    // Left eye
    fill(255,255,255); ellipse(gameChar_x - 10, gameChar_y - 56,5,5);
    fill(0,0,0); ellipse(gameChar_x - 10,gameChar_y - 57,2,2);
    //right eye
    fill(255,255,255); ellipse(gameChar_x + 5,gameChar_y - 56, 5, 5);
    fill(0,0,0); ellipse(gameChar_x + 5, gameChar_y -57, 2, 2);
    //mouth
    fill(0,0,0); rect(gameChar_x - 9 , gameChar_y - 52,14 ,4);
    //tooth
    fill(255,255,255); rect( gameChar_x - 5, gameChar_y - 51, 2 ,2);
    // wheel feet
    fill(0,0,0); ellipse( gameChar_x, gameChar_y - 6,12,12); 
    //right arm
    fill(0,0,0); rect(gameChar_x + 15, gameChar_y - 34 ,6,7);
    fill(0,0,0); rect( gameChar_x - 23, gameChar_y - 34,6,7);
    //antenna
    fill(0,255,0); rect(gameChar_x - 6, gameChar_y - 72,9,5);
    fill(0,255,0); rect(gameChar_x - 3, gameChar_y - 68,3,7);
       

	}

}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawCloud(t_cloud){
    //cloud
    fill(255,204,213); ellipse(t_cloud.x_pos + 98, t_cloud.y_pos, t_cloud.size + 30, t_cloud.size + 30);
    ellipse(t_cloud.x_pos + 150, t_cloud.y_pos, t_cloud.size + 10, t_cloud.size + 10);
    ellipse(t_cloud.x_pos + 50, t_cloud.y_pos, t_cloud.size + 10,t_cloud.size + 10);
    //smaller cloud
    ellipse(t_cloud.x_pos + 300, t_cloud.y_pos + 110, t_cloud.size - 10,t_cloud.size - 10);
    ellipse(t_cloud.x_pos + 320, t_cloud.y_pos + 110, t_cloud.size -20, t_cloud.size - 20);
    ellipse(t_cloud.x_pos + 280, t_cloud.y_pos + 110, t_cloud.size -20, t_cloud.size - 20);
}

// Function to draw mountains objects.
	// Draw mountains.

function drawMountains(t_mountains){
    //mountains
    fill(122,31,31); triangle(t_mountains.x_pos + 342, t_mountains.y_pos + 331, t_mountains.x_pos + 500, t_mountains.y_pos - 35, t_mountains.x_pos + 626, t_mountains.y_pos + 331);
    fill(0,204,0); triangle(t_mountains.x_pos + 467, t_mountains.y_pos + 41, t_mountains.x_pos + 500, t_mountains.y_pos - 35, t_mountains.x_pos + 527, t_mountains.y_pos +41);
    }

// Function to draw trees objects.
function drawTree()
{
     for(var i = 0; i < trees_x.length; i++ ){
    //tree trunk
    fill(230,172,0);     
    rect(trees_x[i] + 282, floorPos_y - 153, 37, 153); 
    //bottom row
    fill(0,255,0); ellipse(trees_x[i] + 288, floorPos_y - 86,40,40);
    fill(0,255,0); ellipse(trees_x[i] + 318, floorPos_y - 86,40,40);
    fill(0,255,0); ellipse(trees_x[i] + 348, floorPos_y - 86,40,40);
    fill(0,255,0); ellipse(trees_x[i] + 258, floorPos_y - 86,40,40);
    //third row down
    fill(0,255,0); ellipse(trees_x[i] + 268, floorPos_y - 116,40,40);
    fill(0,255,0); ellipse(trees_x[i] + 298, floorPos_y - 116,40,40); 
    fill(0,255,0); ellipse(trees_x[i] + 328, floorPos_y - 116,40,40);
    //second to top
    fill(0,255,0); ellipse(trees_x[i] + 278, floorPos_y - 142,40,40); 
    fill(0,255,0); ellipse(trees_x[i] + 308, floorPos_y - 142,40,40);  
    //top of tree
    fill(0,255,0); ellipse(trees_x[i] + 291, floorPos_y - 169, 40,40);
    }
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    //canyon
    fill(100, 155, 255); rect(t_canyon.x_pos, t_canyon.width + 332,100,144);
//   
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    if ( gameChar_world_x > t_canyon.x_pos && gameChar_world_x < t_canyon.x_pos + t_canyon.width && gameChar_y == floorPos_y)
        {
            isPlummeting = true;
            gameChar_y += 5 ;
        };
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    
    //collectable
    fill(255,209,26);  
    rect(t_collectable.x_pos,
        t_collectable.y_pos - 45, 
        t_collectable.size, 
        t_collectable.size, 20, 15, 10, 5);
    
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    d = dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos);
     
     if (d <= 30)
         {
             t_collectable.isFound = true;
             game_score += t_collectable.size;
             console.log("1");
         };
}

function renderFlagpole(){
    
    push();
    stroke(150);
    strokeWeight(5);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 200);
    
    if(flagpole.isReached){
        
        noStroke();
        fill(0,191,255);
        rect(flagpole.x_pos, floorPos_y - 200, 50, 50);
        
    }
    else{
        
        noStroke();
        fill(0,191,255);
        rect(flagpole.x_pos, floorPos_y - 50, 50, 50);
    }
    
    pop();
}

function checkFlagpole(){
    
    var d = abs(gameChar_world_x - flagpole.x_pos);
    
    if(d < 50){
        
        flagpole.isReached = true;
    }
}

function createPlatform(x,y, length){
    
    
    
    var p ={
        x: x,
        y: y,
        length: length,
        draw: function(){
        
        fill(255, 102, 102);
        stroke(0);
        rect(this.x, this.y, this.length, 20);
        },
        
        checkContact: function(gc_x,gc_y){
            
            // checks weather game char is in contact with the platform
            
            if(gc_x > this.x && gc_x < this.x + this.length){
                
                var d = this.y - gc_y;
                if(d >= 0 && d < 5){
                    return true;
                }
                
            }
            
                return false;
        }
        
    }
      
        return p;
}

function Enemy(x,y,range){
    
    this.x = x;
    this.y = y;
    this.range = range;
    this.current_x = x;
    this.incr = 1;
    
    this.draw = function(){
        
        fill(255,0,0);
        ellipse(this.current_x ,this.y - 25, 50);
        fill(255)
        ellipse(this.current_x - 5, this.y - 25, 5);
        ellipse(this.current_x + 5, this.y - 25, 5);
        stroke(255);
        line(
            this.current_x - 15,
            this.y - 35,
            this.current_x - 5,
            this.y - 30
        );
        
            line(
            this.current_x + 15,
            this.y - 35,
            this.current_x + 5,
            this.y - 30
        );
        
    }
        
        this.update = function(){
        
            this.current_x += this.incr;
        
            if(this.current_x < this.x){
                this.incr = 1;
            }
        else if(this.current_x > this.x + this.range){
            
            this.incr = -1;
        }
            return;
        }
    
    
    this.isContact = function(gc_x, gc_y){
        
        //returns true is contact is made
        var d = dist(gc_x, gc_y, this.current_x, this.y);
        
        if(d < 25){
            
            return true;
        }
            return false;
    }

}