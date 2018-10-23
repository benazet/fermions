var EMslider = document.getElementById("ELECTROMAGNETIC");
var electromagnetic = EMslider.value;
EMslider.oninput = function () {
    electromagnetic = this.value
}
var GRAVslider = document.getElementById("GRAVITATION");
var gravitation = GRAVslider.value;
GRAVslider.oninput = function () {
    gravitation = this.value
}
var ELASTslider = document.getElementById("ELASTICITY");
var elasticity = ELASTslider.value;
ELASTslider.oninput = function () {
    elasticity = this.value
}
var FRICTIONslider = document.getElementById("FRICTION");
var friction = FRICTIONslider.value;
FRICTIONslider.oninput = function () {
    friction = this.value
}

var TraceCheckbox = document.getElementById("TRACE");
var trace = TraceCheckbox.checked;
TraceCheckbox.oninput = function () {
    trace = TraceCheckbox.checked;
}

var VectorCheckbox = document.getElementById("VECTOR");
var showVector = VectorCheckbox.checked;
VectorCheckbox.oninput = function () {
    showVector = VectorCheckbox.checked;
}

var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
resizeCanvas();
window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
    canvas.width = window.innerWidth - 0;
    canvas.height = window.innerHeight - 30;
}


var particles = [];
var particlesCount = 200;
var maxSpeed = 0.1;
var trajLength = 100;
for (var i = 0; i < particlesCount; i++) {
    var pos = new Vector(
        canvas.width * Math.random(),
        canvas.height * Math.random(),
        canvas.height * Math.random());
    var vel = new Vector(
        maxSpeed * Math.random() - maxSpeed / 2,
        maxSpeed * Math.random() - maxSpeed / 2,
        maxSpeed * Math.random() - maxSpeed / 2);
    var acc = new Vector(0, 0, 0);
    if (Math.random() > .8) {
        var charge = 0;
        var radius = 20;
        var mass = 50;
    } else if (Math.random() > .5) {
        var charge = +1;
        var radius = 20;
        var mass = 50;
    } else {
        var charge = -1;
        var radius = 5;
        var mass = 5;
    }
    particles.push(new Particle(pos, vel, acc, radius, charge, mass));
}

animate();

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    particles.sort(function (a, b) {
        return a.pos.z - b.pos.z
    });

    if (trace) {
        particles.forEach(particle => {
            particle.drawTraj();
        });
    }
    particles.forEach(particle => {
        particle.update();
    });
}