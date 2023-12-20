class Car {
    constructor(x, y, width, height, controlType, maxSpeed = 3) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;

        this.maxSpeed = maxSpeed;
        this.friction = 0.05;

        this.angle = 0;
        this.turnSpeed = 0.03;

        this.damaged = false;

        this.useBrain = controlType == "AI";

        if (controlType != "DRIVEFORWARD") {
            this.sensor = new Sensor(this);
            this.brain = new NeuralNetwork(
                [this.sensor.rayCount, 6, 4]
            );
        }
        this.controls = new Controls(controlType);
    }

    update(roadBorders, traffic) {

        if (!this.damaged) {
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic);
        }

        if (this.sensor) {
            this.sensor.update(roadBorders, traffic);
            const offsets = this.sensor.readings.map(
                s => s == null ? 0 : 1 - s.offsets  //uses 1-s.offset so that the reading is greater the closer the touch point is to the sensor start point
            );

            //give the neural network the 5 sensor offsets
            //and get back an array of decisions like [1,1,0,0]
            //which can be mapped to the decisions to go forward, back, left, right
            const outputs = NeuralNetwork.feedForward(offsets, this.brain);

            //the key inputs are still able to control this car,
            //however if the useBrain property is enabled,
            //it will override the keyboard control here with 
            //the neural network outputs as the movement controls
            if(this.useBrain){
                this.controls.forward = outputs[0];
                this.controls.left = outputs[1];
                this.controls.right = outputs[2];
                this.controls.reverse = outputs[3];
            }
        }

    }



    #move() {

        if (this.controls.forward) {
            this.speed += this.acceleration;
        }
        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }

        //cap the speed of the car
        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }
        //make the top reversing speed half that of forward
        if (this.speed < -this.maxSpeed / 2) {
            this.speed = -this.maxSpeed / 2;
        }


        //apply friction
        if (this.speed > 0) {
            this.speed -= this.friction;
        }
        if (this.speed < 0) {
            this.speed += this.friction;
        }
        //stop jittering on friction with low speeds
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }


        //implement turning
        if (this.speed != 0) {

            /*
                this was my first try of correcting
                the steering when going forward vs backward

            if(this.controls.left){
                if(this.speed > 0)
                    this.angle += this.turnSpeed;
                if(this.speed < 0)
                    this.angle -= this.turnSpeed;
            }
            if(this.controls.right){
                if(this.speed > 0)
                    this.angle -= this.turnSpeed;
                if(this.speed < 0)
                    this.angle += this.turnSpeed;
                
            }
            */

            //this is the one done in the tutorial:
            const flip = this.speed > 0 ? 1 : -1;

            if (this.controls.left) {
                this.angle += this.turnSpeed * flip;
            }
            if (this.controls.right) {
                this.angle -= this.turnSpeed * flip;
            }

        }



        //console.log(this.speed);
        //this.y-= this.speed;

        //getting sin/cos on a unit circle gets direction
        //relative to centre point
        //scaling it by speed makes it a velocity vector
        //because the unit circle is rotated 90 degrees,
        //and 0 is pointing as car's forward,
        //sine is used to get the x motion quantity
        //and cosine is used to get y motion quantity
        //then both are scaled by speed to apply
        //rotation oriented velocity 

        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;

    }


    #createPolygon() {

        //these points represent each corner of the car
        //used to draw the car rectangle
        //and used to detect collisions via checking if
        //line segments build off these points intersect
        //with other line segments like road borders or 
        //other car polygons
        const points = [];

        //get the car's 'radius' from centre to corner point
        //which is the same as getting a triangle's hypotenuse
        const rad = Math.hypot(this.width, this.height) / 2;  //dividing hypotenuse by 2 so that it goes from centre instead of based on full width and height

        //if you know the width and height of a rectangle,
        //atan2 function is able to get you the angle at point of
        //height to hypotenuse, which gives the angle from
        //the centre forward orientation at which a corner will be
        //atan2 gets angle from x axis to a point, but this x axis is aligned with car forward
        const alpha = Math.atan2(this.width, this.height);

        //add the point of a car corner to the points array,
        //by taking the car angle, the car x location,
        //and adding and subtracting the alpha angle
        //to give the top two corner points, using sine, cosine and radius
        //and then repeating that step but adding PI so it gets the bottom two corners

        //adding the top right corner point
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad,
        })

        //adding the top left corner point
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad,
        })

        //adding the bottom left corner point
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
        })

        //adding the bottom right corner point
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
        })

        return points;
    }


    #assessDamage(roadBorders, traffic) {
        for (let i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }

        for (let i = 0; i < traffic.length; i++) {
            if (polysIntersect(this.polygon, traffic[i].polygon)) {
                return true;
            }
        }

        return false;
    }


    draw(context, color) {

        if (this.damaged) {
            context.fillStyle = "gray";
        }
        else {
            context.fillStyle = color;
        }



        context.beginPath();
        context.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 1; i < this.polygon.length; i++) {
            context.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        //context.stroke();  //draws line from topright to topleft, to bottomleft, to bottomright, a gap where the right edge would be, like a blocky C shape or [
        context.fill();  //fills in a rectangle based on those four points

        if (this.sensor)
            this.sensor.draw(context);
    }
}

