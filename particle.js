// A bit of fun with nucleons
// 2018 - Géraud Benazet

function Particle(pos, vel, acc, radius, charge, mass) {
    this.pos = pos;
    this.vel = vel;
    this.acc = acc;
    this.radius = radius;
    this.charge = charge;
    this.mass = mass;
    if (charge == 0) this.color = 'darkgreen';
    else if (charge > 0) this.color = 'darkgoldenrod';
    else this.color = 'red';
    this.traj = [];

    // this.color = getRandomColor();

    this.update = function () {
        this.acc = new Vector(0, 0, 0);

        particles.forEach(particle => {
            if (this != particle) {
                this.collide(particle);
                this.applyEMforce(particle);
                this.applyGravity(particle);
            }
        });

        // this.collideWithCanvas();
        // this.wrapCanvas();


        this.vel = this.vel.add(this.acc);
        this.vel = this.vel.multiply(1 - Math.pow(friction / 100, 2));
        this.pos = this.pos.add(this.vel);


        this.draw();

        if (trace) {
            this.traj.push(this.pos);
            if (this.traj.length > trajLength) {
                this.traj.splice(0, 1);
            }
        }
    }

    this.drawTraj = function () {
        for (let index = 0; index < this.traj.length; index++) {
            var pos = this.traj[index];
            c.fillStyle = this.color;
            c.fillRect(pos.x, pos.y, index / trajLength, index / trajLength);
        };

    }

    this.draw = function () {

        if (showVector) {
            var arrow = this.vel.unit().multiply(this.radius);
            var head = arrow.add(this.vel.multiply(4));
            if (this.vel.dot(new Vector(0, 0, 1)) < 0) {
                c.beginPath();
                c.moveTo(this.pos.add(arrow).x, this.pos.add(arrow).y);
                c.lineTo(this.pos.add(head).x, this.pos.add(head).y);
                c.strokeStyle = 'white';
                c.stroke();
            }
        }

        c.beginPath();
        c.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.fill();
        c.strokeStyle = 'black';
        c.stroke();

        if (showVector) {
            if (this.vel.dot(new Vector(0, 0, 1)) > 0) {
                c.beginPath();
                c.moveTo(this.pos.add(arrow).x, this.pos.add(arrow).y);
                c.lineTo(this.pos.add(head).x, this.pos.add(head).y);
                c.strokeStyle = 'white';
                c.stroke();
            }


        }
        
        // if (this.charge > 0) {
        //     c.strokeText('+', this.pos.x + this.radius / 3, this.pos.y - this.radius / 3);
        // } else if (this.charge < 0) {
        //     c.strokeText('-', this.pos.x + this.radius / 3, this.pos.y - this.radius / 3);
        // }
    }


    this.collideWithCanvas = function () {
        if (this.pos.x <= this.radius) this.vel.x = Math.abs(this.vel.x);
        if (this.pos.x >= canvas.width - this.radius) this.vel.x = -Math.abs(this.vel.x);
        if (this.pos.y <= this.radius) this.vel.y = Math.abs(this.vel.y);
        if (this.pos.y >= canvas.height - this.radius) this.vel.y = -Math.abs(this.vel.y);
    }

    this.wrapCanvas = function () {
        if (this.pos.x < 0) this.pos.x += canvas.width;
        if (this.pos.x > canvas.width) this.pos.x -= canvas.width;
        if (this.pos.y < 0) this.pos.y += canvas.height;
        if (this.pos.y > canvas.widheightth) this.pos.y -= canvas.height;
    }


    this.applyEMforce = function (that) {
        var u = that.pos.subtract(this.pos);
        var d = u.length();
        u = u.unit();
        this.acc = this.acc.add(u.multiply(-this.charge * that.charge / this.mass / d * electromagnetic));
    }
    this.applyGravity = function (that) {
        var u = that.pos.subtract(this.pos);
        var d = u.length();
        u = u.unit();
        this.acc = this.acc.add(u.multiply(that.mass / d * gravitation / 50000));
    }

    this.collide = function (that) {
        // u = normal vector of collision surface
        var u = that.pos.subtract(this.pos);
        var d = u.length();
        u = u.unit();

        if (d <= this.radius + that.radius) {
            // If the particles have already collided, we put them back in contact
            var contactPoint = Vector.add(
                this.pos.multiply(that.radius / (this.radius + that.radius)),
                that.pos.multiply(this.radius / (this.radius + that.radius)),
                new Vector()
            )
            this.pos = contactPoint.add(u.multiply(-this.radius));
            that.pos = contactPoint.add(u.multiply(that.radius));

            // Calculating initial normal and tangent speed
            var v1n = this.vel.dot(u);
            var v1t = this.vel.subtract(u.multiply(v1n));
            var v2n = that.vel.dot(u);
            var v2t = that.vel.subtract(u.multiply(v2n));

            // Calculating final normal speed
            var w1n = elasticity / 100 * (v1n * (this.mass - that.mass) + 2 * that.mass * v2n) / (this.mass + that.mass)
            var w2n = elasticity / 100 * (v2n * (that.mass - this.mass) + 2 * this.mass * v1n) / (this.mass + that.mass)

            // Tangent speed is not modified

            // Composing final velocity
            this.vel = v1t.add(u.multiply(w1n));
            that.vel = v2t.add(u.multiply(w2n));

        }
    }
}