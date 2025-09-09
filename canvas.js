var can = document.querySelector("canvas");
can.width = window.innerWidth;
can.height = window.innerHeight;
var context = can.getContext("2d");
window.addEventListener("mousemove", function(event) {
    context.clearRect(0,0, this.innerWidth, this.innerHeight);
    context.beginPath();
    context.moveTo(this.innerWidth / 2, this.innerHeight);
    context.lineTo(event.x, event.y);
    context.strokeStyle = "black";
    context.stroke();
    console.log(event.x);
})