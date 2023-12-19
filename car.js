class Car
{
    constructor(x,y, width, height)
    {
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.speed=0;
        this.acceleration=0.2;

        this.maxSpeed = 3;
        this.friction = 0.05;

        this.angle = 0;
        this.turnSpeed = 0.03;

        this.sensor = new Sensor(this);
        this.controls = new Controls();
    }

    update()
    {
       this.#move();
       this.sensor.update();
    }



    #move(){

        if(this.controls.forward){
            this.speed += this.acceleration;
        }
        if(this.controls.reverse){
            this.speed -= this.acceleration;
        }
        
        //cap the speed of the car
        if (this.speed > this.maxSpeed){
            this.speed = this.maxSpeed;
        }
        //make the top reversing speed half that of forward
        if (this.speed < -this.maxSpeed/2){
            this.speed = -this.maxSpeed/2;
        }


        //apply friction
        if(this.speed > 0){
            this.speed -= this.friction;
        }
        if(this.speed < 0){
            this.speed += this.friction;
        }
        //stop jittering on friction with low speeds
        if (Math.abs(this.speed) < this.friction){
            this.speed = 0;
        }
        

        //implement turning
        if(this.speed != 0){

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
            const flip = this.speed > 0 ? 1: -1;

            if(this.controls.left){
                this.angle += this.turnSpeed * flip;
            }
            if(this.controls.right){
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

    draw(context)
    {
        //this was added along with context.restore()
        //but the effect it has isn't immediately visible
        //at this stage of just adding the .translate()
        //and .rotate()
        context.save();
        
        //apply rotation and position
        context.translate(this.x, this.y);
        context.rotate(-this.angle);
        
        context.beginPath();
        context.rect(
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );
        context.fill();

        //this was added along with context.save()
        //but the effect it has isn't immediately visible
        //at this stage of just adding the .translate()
        //and .rotate()
        context.restore();


        this.sensor.draw(context);
    }
}

