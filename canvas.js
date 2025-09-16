var can = document.querySelector("canvas");
can.width = window.innerWidth;
can.height = window.innerHeight;
var context = can.getContext("2d");
var radius = 50;
var circleArray = [];
var grid = [];
var canShoot = true;
var midShoot = false;
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
    if (canShoot && !midShoot)
    {
        var newcirc = new Circle(this.innerWidth / 2, this.innerHeight - radius, radius);
        circleArray.push(newcirc);
        console.log(newcirc)
        midShoot = true;
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
        context.fillStyle = "black";
        context.fill();
    }
    this.update = function() {
        this.x += this.dx;
        this.y += this.dy;
        if (this.y - radius <= 0)
        {
            this.stop();
        }
        if (this.x + radius > innerWidth || this.x - radius <= 0)
        {
            this.dx = -this.dx;
        }
        this.draw();
    }
    this.stop = function() {
        this.dx = 0;
        this.dy = 0;
        midShoot = false;
        collide(this);
    }
    this.relocate = function(newx, newy) {
        this.x = newx;
        this.y = newy;
    }
}
function Cell(x1, x2, y1, y2) {
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this.x = (x2-x1) / 2 + x1;
    this.y = (y2-y1) / 2 + y1;
    this.isFilled = false;
    this.draw = function() {
        if (this.isFilled == true)
        {
            context.fillStyle = "blue";
        }
        else
        {
            context.fillStyle = "red";
        }
        context.beginPath();
        context.fillRect(this.x1, this.y1, (this.x2-this.x1), (this.y2-this.y1))
    }
    this.distance = function(circle) {
        if (this.x < circle.x)
        {
            if (this.y < circle.y)
            {
                return Math.sqrt(Math.pow(this.x - (circle.x - circle.radius), 2) + Math.pow(this.y - (circle.y - circle.radius), 2));
            }
            else
            {
                return Math.sqrt(Math.pow(this.x - (circle.x - circle.radius), 2) + Math.pow(this.y - (circle.y + circle.radius), 2));
            }
        }
        else
        {
            if (this.y < circle.y)
            {
                return Math.sqrt(Math.pow(this.x - (circle.x + circle.radius), 2) + Math.pow(this.y - (circle.y - circle.radius), 2));
            }
            else
            {
                return Math.sqrt(Math.pow(this.x - (circle.x + circle.radius), 2) + Math.pow(this.y - (circle.y + circle.radius), 2));
            }
        }
    }
}
function createGrid(rows, columns) {
    for (var i = 0; i < columns; i++)
    {
        for (var k = 0; k < rows; k++) 
        {
            var newCell = new Cell(k * (innerWidth / rows), (k+1) * (innerWidth/rows),i * (innerHeight / (columns*2)), (i+1) * (innerHeight / (columns*2)));
            grid.push(newCell);
            console.log(newCell);
        }
    }
}
function drawGrid(rows, columns) {
    for (var i = 0; i < columns; i++)
    {
        for (var k = 0; k < rows; k++)
        {
            context.beginPath();
            context.strokeRect(k * (innerWidth / rows), i * (innerHeight / (columns*2)), innerWidth/rows, innerHeight / (columns * 2));
            context.strokeStyle = "black";
            context.stroke();
        }
    }
}
function collide(circle) {
    var cell = null;
    for (var i = 0; i < grid.length; i ++)
    {
        if (!grid[i].isFilled && cell == null)
        {
            cell = i;
        }
        console.log(grid[i].distance(circle));
        if (grid[cell].distance(circle) > grid[i].distance(circle) && !grid[i].isFilled) {
            cell = i;
        }
    }
    console.log(cell);
    grid[cell].isFilled = true;
    circle.relocate(grid[cell].x, grid[cell].y);
}
function animate() {
    requestAnimationFrame(animate);
    context.clearRect(0,0,innerWidth, innerHeight);
    for (var i = 0; i < grid.length; i++) {
        grid[i].draw();
    }
    for(var i = 0; i < circleArray.length; i++) {
        circleArray[i].update();
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
    drawGrid(8, 4);
}
createGrid(8, 4);
animate();