var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var launchStart = 0;
var cannonBalls = [];
var numberBalls = 0;
var timeScale = .085;
var sizeScale = 1.5;
var gravity = 9.81;
var score = 0;
var maxHeight = 0;

class CannonBall {
    constructor(x, y, radius, xVel, yVel, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.xVel = xVel;
        this.yVel = yVel;
        this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0 , Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
    track() {
        ctx.beginPath();
        ctx.moveTo(0, this.y);
        ctx.lineTo(canvas.width, this.y);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(this.x, 0);
        ctx.lineTo(this.x, canvas.height);
        ctx.stroke();
        
        ctx.fillStyle = "black";
        ctx.font = "15px Arial";
        ctx.fillText("y: " + -((Math.floor(this.y * 100) / 100) - canvas.height), (canvas.width - 80), (this.y - 10));
        ctx.fillText("y-vel: " + -((Math.floor(this.yVel * 100) / 100)), (canvas.width - 80), (this.y + 25));
    }
}

class Goal {
    constructor(xDis, yDis, length) {
        this.xDis = xDis;
        this.yDis = yDis;
        this.length = length;
        this.width = 10;
        this.color = "blue";
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect((this.xDis - (this.length / 2)), (cannon.height - this.yDis), this.length, this.width);
        
        ctx.fillStyle = "black";
        ctx.font = "10px Arial";
        ctx.fillText("x: " + this.xDis + " y: " + this.yDis, (this.xDis - (this.length / 2)), (canvas.height - this.yDis) + this.width + 10);
    }
}


class Cannon {
    constructor() {
        this.pivotRadius = 15;
        this.length = 30;
        this.width = 10;
        this.angle = 90;
        this.launchVelocity = 50;
        this.height = canvas.height;
        this.color = "green";
    }
    draw() {
        var angle = -(cannon.angle * Math.PI / 180);
        ctx.fillStyle = "red";
        ctx.translate(0, cannon.height);
        ctx.rotate(angle);
        ctx.fillRect(0, -(this.width / 2), this.length, this.width);
        ctx.rotate(-angle);
        ctx.translate(0, -cannon.height);
        
        ctx.beginPath();
        ctx.arc(0, cannon.height, cannon.pivotRadius, 0 , Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
    
    updateAngle() {
        this.angle = document.getElementById("formAngle").value;
    }
    
    updateVelocity() {
        this.launchVelocity = document.getElementById("formVelocity").value;
    }
    fire() {
        launchStart = (new Date()).getTime();
        cannonBalls[numberBalls++] = new CannonBall(0, this.height, 5, cannon.launchVelocity * Math.sin((cannon.angle + 90) * (Math.PI / 180)), (cannon.launchVelocity * Math.cos((cannon.angle + 90) * (Math.PI / 180))), "red");
        console.log(cannon.launchVelocity * Math.sin(90));
    }
}

var cannon = new Cannon();
var goal = new Goal(290, 70, 50);

function updateScene() {
    for(var ball of cannonBalls) {
        if (Math.abs(ball.x - goal.xDis) < goal.length && Math.abs(cannon.height - goal.yDis - ball.y) < 20) {
            score++;
        }
        ball.x += (ball.xVel * timeScale);
        ball.y += (timeScale * (ball.yVel += (gravity * timeScale)));
        if (ball.y + ball.radius > canvas.height) {
            ball.y = canvas.height;
            ball.xVel = 0;
        }
        maxHeight = (Math.abs(ball.y - canvas.height) > maxHeight) ? Math.abs(ball.y - canvas.height) : maxHeight;
        
        
    }
}

function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateScene();
    
    //draw cannon
    cannon.draw();
    
    //draw balls
    for (var x of cannonBalls) {
        if (x.yVel != 0 && x.xVel != 0) {
            x.draw();
            x.track();
        }
        
    }
    
    goal.draw();
    
    ctx.fillStyle = "black";
    ctx.font = "15px Arial";
    ctx.fillText("Angle: " + cannon.angle, 10, 20);
    ctx.fillText("Launch Speed: " + cannon.launchVelocity, canvas.width / 2 - 70, 20);
    ctx.fillText("Score: " + score, canvas.width - 70, 20);
    
    document.getElementById("statsBox").innerHTML = "Angle: " + cannon.angle + " LaunchVelocity: " + cannon.launchVelocity + " Gravity: " + gravity + " NumberBalls: " + numberBalls + " Score: " + score + " Max Height: " + Math.floor(maxHeight) + " Calc height: " + (Math.pow(cannon.launchVelocity, 2) / (2 * gravity)) + "flight time: " + (2 * cannon.launchVelocity / gravity) + " time: " + ((new Date).getTime() - launchStart) / 1000; 
}

var timer = setInterval(drawScene, timeScale * 1000);