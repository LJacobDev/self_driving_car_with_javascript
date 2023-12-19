class Sensor{

    constructor(car){
        //this sensor is attached to a car,
        //so it is given a car object to keep as a property
        this.car = car;

        //the sensors will be rays cast out in several directions
        this.rayCount = 5;

        this.rayLength = 150;

        //the rays use PI / 4 to get a 45 degree angle spread
        //the rays use PI * 2 to get a full 360 degree spread
        this.raySpread = Math.PI / 2;

        this.rays=[];
        this.readings=[];
    }

    update(roadBorders)
    {
        this.#castRays();

        this.readings=[];
        for(let i = 0; i < this.rays.length; i++){
            this.readings.push(
                this.#getReading(this.rays[i], roadBorders)
            );
        }
    }

    #castRays()
    {
        this.rays = [];
        for(let i=0; i < this.rayCount; i++){
            const rayAngle = lerp(
                this.raySpread/2,
                -this.raySpread/2,
                //when using1 rayCount, just put one line in the middle of the spread area, otherwise draw them as interpolated from 0 to rayCount-1
                this.rayCount == 1 ? 0.5 : i/(this.rayCount - 1) //since the i doesn't iterate to be equal to rayCount in this for loop, use rayCount - 1 here
                
            ) + this.car.angle;

            

            //starting point of each ray is the car centre
            const start = {x:this.car.x, y:this.car.y};
            //console.log(start);
            const end = {
                x: this.car.x - Math.sin(rayAngle) * this.rayLength,
                y: this.car.y - Math.cos(rayAngle) * this.rayLength            
            };
            

            //with start and endpoints made, put them into this.rays
            this.rays.push([start,end]);
        }
    }

    #getReading(ray, roadBorders)
    {
        //check for all points that the ray passes through
        //whether the left edge, right edge, or later on, other car locations
        //and use the closest touch point as the reading distance to go with
        let touches=[];

        for(let i = 0; i < roadBorders.length; i++){
            
            //this function will compare two line segments,
            //by using their respective start and end points,
            //and will return an intersection point between
            //them if one exists
            const touch = getIntersection(
                ray[0],
                ray[1],
                roadBorders[i][0],
                roadBorders[i][1]
            );
            if(touch){
                touches.push(touch);
            }
        }

        if(touches.length == 0)
            return null;
        else{
            //getIntersection returns an x, y, and offset from sensor start point
            //and we are only interested in collecting the offsets
            //into an array
            const offsets = touches.map(e => e.offset);
            
            //find the minimum value of the offset array
            //by using spread operator of array into Math.min
            const minOffset = Math.min(...offsets);

            //find the touch that had the smallest offset,
            //meaning the nearest touch point,
            //and return the touch so the x, y, and offset are available
            return touches.find(e => e.offset == minOffset);
        }

    }

    draw(context){
        for(let i = 0; i < this.rayCount; i++){
 
            //draw the full ray if it doesn't touch anything
            let endpoint = this.rays[i][1];
            //if there is a reading, make the ray end at the touch point
            if(this.readings[i]){
                endpoint = this.readings[i];
            }

            //draw a yellow line from
            //the start point of the ray
            //to either the end point of the ray
            //or to the touch point of the ray if any
            context.beginPath();
            context.lineWidth=2;
            context.strokeStyle="yellow";
            context.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y
            )
            context.lineTo(
                endpoint.x,
                endpoint.y
            )
            context.stroke();

            //draw a black line from
            //the normal ray end point
            //to either itself if no touch,
            //or to the touch if there is one
            //this results in a line that shows
            //where the ray would have ended extending
            //past any touch points
            context.beginPath();
            context.lineWidth=2;
            context.strokeStyle="black";
            context.moveTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            )
            context.lineTo(
                endpoint.x,
                endpoint.y
            )
            context.stroke();

        }
    }

}