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

        this.controls = new Controls();
    }

    update()
    {
        if(this.controls.forward){
            this.speed += this.acceleration;
        }
        if(this.controls.reverse){
            this.speed -= this.acceleration;
        }
        
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
        
        //console.log(this.speed);

        this.y-= this.speed;

        /*
        if(this.controls.left){
            this.x-=2;
        }
        if(this.controls.right){
            this.x+=2;
        }
        */
       
    }

    draw(context)
    {
        //console.log("draw method running");
        //console.log(context);

        context.beginPath();
        context.rect(
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );
        context.fill();

    }
}

