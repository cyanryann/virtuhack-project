var can = document.querySelector("canvas");
can.width = window.innerWidth;
can.height = window.innerHeight;
var context = can.getContext("2d");
var radius = 30;
var circleArray = [];
window.addEventListener("mousemove", function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
})
window.addEventListener("click", function() {
    var newcirc = new Circle(this.innerWidth / 2, this.innerHeight - radius, radius, (mouse.x - this.innerWidth/2) / (this.innerWidth/2), -2);
    circleArray.push(newcirc);
    console.log(newcirc)
})
var mouse = {
    x: undefined,
    y: undefined
};
function Circle(x, y, radius, dx, dy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
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
        this.draw();
    }
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
    context.stroke();
}
animate();