var can = document.querySelector("canvas");
can.width = 800;
can.height = 800;
var context = can.getContext("2d");
var radius = 40;
var columns = 8;
var rows = 4;
var circleArray = [];
var grid = [];
var compoundNeeded;
var elementsNeeded  = [];
var numberNeeded = 0;
var canShoot = true;
var midShoot = false;
var next = Math.floor(Math.random() * 3) + 1;
var nextColor = idToColor(next);
var score = 0;
var gameFinished = true;
var highScore = 0;
var flipper = false;
var isAnimating = false;
var audio = document.querySelector("audio");

function gameStart() {
    grid = [];
    circleArray = [];
    context.clearRect(0,0, can.width, can.height);
    createGrid(columns, rows);
    compoundNeeded = pickCompound();
    if (!isAnimating)
    {
        isAnimating = true;
        animate();
    }

    gameFinished = false;
    if (score > highScore)
    {
        highScore = score;
    }
    score = 0;
    mouse = {
        x: can.width / 2,
        y: can.height / 2
    };
}
function gameOver() {
    grid = [];
    circleArray = [];
    gameFinished = true;
}
window.addEventListener("mousemove", function(event) {
    const rect = can.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
    if (Math.abs(mouse.x - can.width/2) < 100 && Math.abs(mouse.y - can.height) < 100)
    {
        canShoot = false;
    }
    else if (mouse.y >= can.height - 30 || mouse.y < 0)
    {
        canShoot = false
    }
    else if (gameFinished)
    {
        canShoot = false;
    }
    else
    {
        canShoot = true;
    }
})
window.addEventListener("click", function() {
    if (canShoot && !midShoot && !gameFinished)
    {
        score += 10;
        var newcirc = new Circle(can.width / 2, can.height - radius, radius, next);
        newcirc.dx = setdX();
        newcirc.dy = setdY();
        circleArray.push(newcirc);
        console.log(newcirc)
        midShoot = true;
        next = Math.floor(Math.random()*4)+1;
        nextColor = idToColor(next);
        audio.src = "sounds/pop.wav";
        audio.currentTime = 0;
        audio.play();
    }

})
var mouse = {
    x: undefined,
    y: undefined
};
function setdX() {
    return (mouse.x - can.width/2) * 10 / (can.width);
}
function setdY() {
    return (mouse.y - can.height) * 10 / (can.height);
}
function idToColor(id) {
    switch (id) {
        case 1:
            return "green";
        case 2:
            return "blue";
        case 3:
            return "yellow";
        case 4:
            return "red";
        default:
            return "black";
    }
}
function pickCompound() {
    var num = Math.floor(Math.random()*4) + 1;
    numberNeeded = Math.floor(Math.random() *2) + 1;
    switch (num) {
        case 1:
            elementsNeeded = [3, 2, 2];
            return "Carbon Dioxide";
        case 2:
            elementsNeeded = [4, 4, 2];
            return "Dihydrogen Monoxide";
        case 3:
            elementsNeeded = [1, 4, 4, 4];
            return "Ammonia";
        case 4:
            elementsNeeded = [3, 1, 4];
            return "Hydrogen Cyanide"
        case 5:
            elementsNeeded = [3, 2, 2, 4];
            return "Carboxylic Acid"
        case 6:
            elementsNeeded = [3, 2];
            return "Carbon Monoxide"
    }
}
function Circle(x, y, radius, next) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.hasStopped = false;
    this.id = next
    this.cellID = null;
    this.isClearing = false;
    switch (this.id) {
        case 1:
            this.color = "green";
            this.shadowColor = "darkgreen";
            this.lightColor = "lightgreen";
            this.text = "N";
            break;
        case 2:
            this.color = "blue";
            this.shadowColor = "darkblue";
            this.lightColor = "lightblue";
            this.text = "O";
            break;
        case 3:
            this.color = "yellow";
            this.shadowColor = "orange";
            this.lightColor = "lightgoldenrodyellow";
            this.text = "C";
            break;
        case 4:
            this.color = "red";
            this.shadowColor = "darkred";
            this.lightColor = "lightcoral";
            this.text = "H";
            break;
        default:
            this.color = "black";
            this.shadowColor = "white";
            break;
    }
    this.draw = function() {
        context.beginPath();
        context.arc(this.x, this.y,this.radius,0,Math.PI*2, false);
        context.strokeStyle = "black";
        context.fillStyle = this.color;
        context.shadowColor = this.shadowColor;
        context.shadowOffsetX = 3;
        context.shadowOffsetY = 3;

        context.fill();
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.font = "20px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "black";
        context.fillText(this.text, this.x, this.y);
    }
    this.update = function() {
        this.x += this.dx;
        this.y += this.dy;
        if (this.y - radius <= 0)
        {
            this.stop();
        }
        if (this.x + radius > can.width || this.x - radius <= 0)
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
function Cell(x1, x2, y1, y2, color) {
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
        context.fillStyle = color;
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
            var color;
            if (i % 2 == 0)
            {
                if (k % 2 == 0)
                {
                    color = "lightgray";   
                }
                else
                {
                    color = "white";
                }
            }
            else
            {
                if (k%2 == 0)
                {
                    color = "white";
                }
                else
                {
                    color="lightgray";
                }
            }
            var newCell = new Cell(k * (can.width / rows), (k+1) * (can.width/rows),i * (can.height / (columns*2)), (i+1) * (can.height / (columns*2)), color);
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
            if (grid[i].x1 == grid[i+rows].x1)
            {
                grid[i].adjacent.push(i+rows);
            }
        }
        if (grid[i-rows] != null)
        {
            if (grid[i].x1 == grid[i-rows].x1)
            {
                grid[i].adjacent.push(i-rows);
            }
        }
        grid[i].adjacent.push(i);
    }
}
function drawGrid(rows, columns) {
    for (var i = 0; i < columns; i++)
    {
        for (var k = 0; k < rows; k++)
        {
            context.beginPath();
            context.strokeRect(k * (can.width / rows), i * (can.height / (columns*2)), can.width/rows, can.height / (columns * 2));
            context.strokeStyle = "black";
            context.stroke();
        }
    }
}
function collide(circle) {
    // TWO ISSUES STILL
    // 1) THE LAST CELL CAN SWAP ELEMENTS
    var cell = 0;
    var unSet = true;
    console.log("circle (x,y): " + circle.x + " , " + circle.y);
    for (let i = 0; i < grid.length; i++)
    {
        if (!grid[i].isFilled && unSet)
        {
            cell = i;
            unSet = false;
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
    // I think this is fixed now
    var willClear = false;
    var index = 0;
    for (var k = 0; k < grid[cell].adjacent.length; k++)
    {
        console.log("FOR POSITION " + grid[cell].adjacent[k]);
        var adjacentIDs = [];
        for (var i = 0; i < grid[grid[cell].adjacent[k]].adjacent.length; i++)
        {
            if (grid[grid[grid[cell].adjacent[k]].adjacent[i]].circle != null)
            {
                console.log("checking " + grid[grid[cell].adjacent[k]].adjacent[i]);
                adjacentIDs.push(grid[grid[grid[cell].adjacent[k]].adjacent[i]].id);
            }

        }
        var num = elementsNeeded.length;

        for (var i = 0; i < elementsNeeded.length; i++)
        {
            if (adjacentIDs.includes(elementsNeeded[i]))
            {
                adjacentIDs.splice(adjacentIDs.indexOf(elementsNeeded[i]), 1);
                num--;
                if (num == 0)
                {
                    willClear = true;
                    index = grid[cell].adjacent[k];
                    break;
                }
            }
        }
    }

    if (willClear)
    {
        score += 100;
        audio.src = "sounds/ping.wav";
        audio.currentTime = 0;
        audio.play();
        for (var i = 0; i < grid[index].adjacent.length; i++)
        {
            console.log(grid[index].adjacent[i]);
            if (grid[grid[index].adjacent[i]].circle != null)
            {
                if (elementsNeeded.includes(grid[grid[index].adjacent[i]].id))
                {
                    elementsNeeded.splice(elementsNeeded.indexOf(grid[grid[index].adjacent[i]].id), 1);
                    grid[grid[index].adjacent[i]].clear();
                    console.log("clearing " + grid[index].adjacent[i]);                }

            }

        }
        console.log(grid[cell]);
        grid[index].clear();
        numberNeeded -= 1;
        if (numberNeeded <= 0)
        {
            compoundNeeded = pickCompound();
            checkAll();
        }
    }
    if (grid.every((val) => val.circle != null))
    {
        gameOver();
    }
}
function checkAll() {
    grid.forEach(element => {
        var willClear = false;
        var index = 0;
        for (var k = 0; k < element.adjacent.length; k++)
        {
            console.log("FOR POSITION " + element.adjacent[k]);
            var adjacentIDs = [];
            for (var i = 0; i < grid[element.adjacent[k]].adjacent.length; i++)
            {
                if (grid[grid[element.adjacent[k]].adjacent[i]].circle != null)
                {
                    console.log("checking " + grid[element.adjacent[k]].adjacent[i]);
                    adjacentIDs.push(grid[grid[element.adjacent[k]].adjacent[i]].id);
                }

            }
            var num = elementsNeeded.length;

            for (var i = 0; i < elementsNeeded.length; i++)
            {
                if (adjacentIDs.includes(elementsNeeded[i]))
                {
                    adjacentIDs.splice(adjacentIDs.indexOf(elementsNeeded[i]), 1);
                    num--;
                    if (num == 0)
                    {
                        willClear = true;
                        index = element.adjacent[k];
                        break;
                    }
                }
            }
        }

        if (willClear)
        {
            score += 100;
            audio.src = "sounds/ping.wav";
            audio.play();
            for (var i = 0; i < grid[index].adjacent.length; i++)
            {
                console.log(grid[index].adjacent[i]);
                if (grid[grid[index].adjacent[i]].circle != null)
                {
                    grid[grid[index].adjacent[i]].clear();
                    console.log("clearing " + grid[index].adjacent[i]);
                }

            }
            console.log(grid[cell]);
            grid[index].clear();
            numberNeeded -= 1;
            if (numberNeeded <= 0)
            {
                compoundNeeded = pickCompound();
                checkAll();
            }
        }
    });
    
}


function animate() {
    requestAnimationFrame(animate);
    context.clearRect(0,0,can.width, can.height);
    for (var i = 0; i < grid.length; i++) {
        grid[i].draw();
    }
    for(var i = 0; i < circleArray.length; i++) {
        circleArray[i].update();
    }

    context.beginPath();
    context.moveTo(can.width / 2, can.height);
    context.lineTo(mouse.x, mouse.y);
    if (canShoot == false)
    {
        context.strokeStyle = "darkred";
    }
    else
    {
        context.strokeStyle = nextColor;
    }
    context.stroke();
    context.font = "20px Zalando Sans Expanded";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.strokeStyle = "black";
    context.fillStyle = "black";
    if (!gameFinished)
    {
        context.fillText("Molecule(s) needed:", (can.width *4) / 5, can.height * (13/20));
        context.fillText(numberNeeded + " " + compoundNeeded, (can.width*4)/5, can.height * (14/20));
    }

    context.fillText("Current Score: " + score, (can.width*4)/5, can.height * (16/20));
    context.fillText("High Score: " + highScore, (can.width*4)/5, can.height * (17/20));
    if (gameFinished) {
        context.font = "40px Arial";
        context.fillText("Game Over", can.width *(1/2), can.height * (5/10));
        context.font = "30px Arial";
        context.fillText("To try again, press start!", can.width *(1/2), can.height * (7/10));
    }
    if (!gameFinished) {
        drawGrid(columns, rows);
    }

}
