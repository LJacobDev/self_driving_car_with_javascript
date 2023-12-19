class Sensor{

    constructor(car){
        //this sensor is attached to a car,
        //so it is given a car object to keep as a property
        this.car = car;

        //the sensors will be rays cast out in several directions
        this.rayCount = 3;

        this.rayLength = 100;

        //the rays use PI / 4 to get a 45 degree angle
        this.raySpread = Math.PI / 4;

        this.rays=[];
    }

    update(){
        this.rays = [];
        for(let i=0; i < this.rayCount; i++){
            const rayAngle = lerp(
                this.raySpread/2,
                -this.raySpread/2,
                i/(this.rayCount - 1) //since the i doesn't iterate to be equal to rayCount in this for loop, use rayCount - 1 here
            ) + this.car.angle;

            

            //starting point of each ray is the car centre
            const start = {x:this.car.x, y:this.car.y};
            console.log(start);
            const end = {
                x: this.car.x - Math.sin(rayAngle) * this.rayLength,
                y: this.car.y - Math.cos(rayAngle) * this.rayLength            
            };
            

            //with start and endpoints made, put them into this.rays
            this.rays.push([start,end]);
        }
    }

    draw(context){
        for(let i = 0; i < this.rayCount; i++){
            context.beginPath();
            context.lineWidth=2;
            context.strokeStyle="yellow";
            context.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y
            )
            context.lineTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            )
            context.stroke();
        }
    }

}