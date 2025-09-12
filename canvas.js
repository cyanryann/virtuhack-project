var can = document.querySelector("canvas");
can.width = window.innerWidth;
can.height = window.innerHeight;
var context = can.getContext("2d");
var radius = 50;
var circleArray = [];
var canShoot = true;
window.addEventListener("mousemove", function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
    if (Math.abs(mouse.x - this.innerWidth/2) < 100 && Math.abs(mouse.y - this.innerHeight) < 100)
    {
        canShoot = false;
    }
    else
    {
        canShoot = true;
    }
})
window.addEventListener("click", function() {
    if (canShoot)
    {
        var newcirc = new Circle(this.innerWidth / 2, this.innerHeight - radius, radius);
        circleArray.push(newcirc);
        console.log(newcirc)
    }

})
var mouse = {
    x: undefined,
    y: undefined
};
function setdX() {
    return (mouse.x - this.innerWidth/2) / (this.innerWidth);
}
function setdY() {
    return (mouse.y - this.innerHeight) / (this.innerHeight);
}
function Circle(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = setdX() * 10;
    this.dy = setdY() * 10;
    this.draw = function() {
        context.beginPath();
        context.arc(this.x, this.y,this.radius,0,Math.PI*2, false);
        context.strokeStyle = "black";
        context.fillStyle = "black"
        context.fill();
    }
    this.update = function() {
        this.x += this.dx;
        this.y += this.dy;
        if (this.x + radius > innerWidth || this.x - radius <= 0)
        {
            this.dx = -this.dx;
        }
        this.draw();
    }
}
function drawGrid(rows, columns) {
    for (var i = 0; i < rows; i++)
    {
        for (var k = 0; k < columns; k++)
        {

        }
    }
}
function collide() {
    /*
    WHEN CIRCLE HITS OTHER CIRCLE OR TOP OF SCREEN, STOP IT
    AND CHECK FOR WHAT GRID CELL IT FALLS IN
    */
}
function animate() {
    requestAnimationFrame(animate);
    context.clearRect(0,0,innerWidth, innerHeight);
    for(var i = 0; i < circleArray.length; i++) {
        circleArray[i].update();
        console.log("updating");
    }
    context.beginPath();
    context.moveTo(this.innerWidth / 2, this.innerHeight);
    context.lineTo(mouse.x, mouse.y);
    context.strokeStyle = "black";
    if (canShoot == false)
    {
        context.strokeStyle = "red";
    }
    context.stroke();
}
animate();