 class Road
 {

    constructor(xCentre, width, laneCount=3)
    {
        this.x = xCentre;
        this.width = width;
        this.laneCount = laneCount;

        //get left and right edge's x locations
        this.leftEdge = xCentre-width/2;
        this.rightEdge = xCentre+width/2;

        //a large number to simulate the road
        //having practically infinite length
        const infinity = 1000000;
        this.topEdge = -infinity;
        this.bottomEdge = infinity;
    }

    draw(context)
    {
        context.lineWidth = 5;
        context.strokeStyle="white";

        //to get the lane marking x positions
        //interpolate between left and right x values
        for(let i=0; i <= this.laneCount; i++)
        {
            const x = lerp(
                this.leftEdge,
                this.rightEdge,
                i/this.laneCount);


            //add dashed line styling to the middle lane markers
            //but not to the left and right edge markers
            if(i > 0 && i < this.laneCount)
            {
                //20 pixel dash with 20 pixel gaps
                context.setLineDash([20,20]);
            }
            else
            {
                //giving an empty array makes a solid line
                context.setLineDash([]);
            }

            context.beginPath();
            context.moveTo(x, this.topEdge);
            context.lineTo(x, this.bottomEdge);
            context.stroke();
        

        }

    }
 }

