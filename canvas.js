var can = document.querySelector("canvas");
can.width = window.innerWidth;
can.height = window.innerHeight;
var context = can.getContext("2d");
var radius = 40;
var columns = 8;
var rows = 4;
var circleArray = [];
var grid = [];
var canShoot = true;
var midShoot = false;
var next = Math.floor(Math.random() * 3) + 1;
var nextColor = idToColor(next);
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
        var newcirc = new Circle(this.innerWidth / 2, this.innerHeight - radius, radius, next);
        circleArray.push(newcirc);
        console.log(newcirc)
        midShoot = true;
        next = Math.floor(Math.random()*3)+1;
        nextColor = idToColor(next);
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
function idToColor(id) {
    switch (id) {
        case 1:
            return "green";
        case 2:
            return "blue";
        case 3:
            return "yellow";
        default:
            return "black";
    }
}
function Circle(x, y, radius, next) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = setdX() * 10;
    this.dy = setdY() * 10;
    this.hasStopped = false;
    this.id = next
    this.cellID = null;
    this.isClearing = false;
    switch (this.id) {
        case 1:
            this.color = "green";
            this.text = "N";
            break;
        case 2:
            this.color = "blue";
            this.text = "O";
            break;
        case 3:
            this.color = "yellow";
            this.text = "C";
            break;
        default:
            this.color = "black";
            break;
    }
    this.draw = function() {
        context.beginPath();
        context.arc(this.x, this.y,this.radius,0,Math.PI*2, false);
        context.strokeStyle = "black";
        context.fillStyle = this.color;
        context.fill();
        context.font = "20px Arial"
        context.strokeText(this.text, this.x, this.y);
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
        if (this.isClearing)
        {
            this.radius++;
            if (this.radius >= radius+15)
            {
                grid[this.cellID].clear();
            }
        }
        this.draw();
        if (!this.hasStopped)
        {
            for (var i = 0; i < grid.length; i++)
            {
                if (grid[i].isFilled)
                {
                    if ((this.x +radius>= grid[i].x) && this.x - radius <= grid[i].x)
                    {
                        if ((this.y + radius>= grid[i].y) && (this.y - radius<= grid[i].y))
                        {
                            this.stop();
                        }

                    }
                }
            }
        }

    }
    this.stop = function() {
        if (!this.hasStopped)
        {
            this.hasStopped = true;
            this.dx = 0;
            this.dy = 0;
            midShoot = false;
            collide(this);
        }
    }
    this.relocate = function(newx, newy) {
        this.x = newx;
        this.y = newy;
    }
    this.startClear = function() {
        this.isClearing = true;
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
    this.circle = null;
    this.id = null;
    this.adjacent = [];
    this.draw = function() {
        if (this.isFilled == true)
        {
            context.fillStyle = "white";
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
    this.clear = function() {
        if (!this.circle.isClearing)
        {
            this.circle.startClear();
        }
        else
        {
            var index = circleArray.indexOf(this.circle)
            circleArray.splice(index, 1);
            this.circle = null;
            this.isFilled = false;
            this.id = null;
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
        }
    }
    for (var i = 0; i < grid.length; i++)
    {
        if (grid[i-1] != null)
        {
            if (grid[i].y1 == grid[i-1].y1)
            {
                grid[i].adjacent.push(i-1);
            }
        }
        if (grid[i+1] != null)
        {
            if (grid[i].y1 == grid[i+1].y1)
            {
                grid[i].adjacent.push(i+1);
            }
        }
        if (grid[i+rows] != null)
        {
            console.log("CHECK FOR SPOT BELOW" + i);
            if (grid[i].x1 == grid[i+rows].x1)
            {
                grid[i].adjacent.push(i+rows);
            }
        }
        if (grid[i-rows] != null)
        {
            console.log("CHECK FOR SPOT ABOVE" + i);
            if (grid[i].x1 == grid[i-rows].x1)
            {
                grid[i].adjacent.push(i-rows);
            }
        }
        console.log("the adjacents of grid spot: " + i + " are " + grid[i].adjacent);
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
    var clearNum = 0;
    var cell = grid.length-1;
    console.log("circle (x,y): " + circle.x + " , " + circle.y);
    for (let i = 0; i < grid.length; i++)
    {
        if (!grid[i].isFilled && cell == null)
        {
            cell = i;
        }
        else if (grid[cell].distance(circle) > grid[i].distance(circle) && !grid[i].isFilled) {
            cell = i;
        }
    }
    console.log(cell);
    console.log(grid[cell].distance(circle));
    grid[cell].isFilled = true;
    circle.cellID = cell;
    grid[cell].circle = circle;
    grid[cell].id = circle.id;
    circle.relocate(grid[cell].x, grid[cell].y);
    for (var i = 0; i < grid[cell].adjacent.length; i++)
    {
        if (grid[grid[cell].adjacent[i]].id == grid[cell].id)
        {
            clearNum++;
            grid[grid[cell].adjacent[i]].clear();
        }
    }
    if (clearNum > 0)
    {
        grid[cell].clear();
    }
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
    if (canShoot == false)
    {
        context.strokeStyle = "red";
    }
    else
    {
        context.strokeStyle = nextColor;
    }
    context.stroke();
    drawGrid(columns, rows);
}
createGrid(columns, rows);
animate();