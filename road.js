class Road {

    constructor(xCentre, width, laneCount = 3) {
        this.x = xCentre;
        this.width = width;
        this.laneCount = laneCount;

        //get left and right edge's x locations
        this.leftEdge = xCentre - width / 2;
        this.rightEdge = xCentre + width / 2;

        //a large number to simulate the road
        //having practically infinite length
        const infinity = 1000000;
        this.topEdge = -infinity;
        this.bottomEdge = infinity;

        //define borders of the road
        //using arrays for flexibility
        //Initially will use 4 x,y points,
        //but adding curved roads and borders
        //with additional points is possible
        const topLeft = { x: this.leftEdge, y: this.topEdge };
        const bottomLeft = { x: this.leftEdge, y: this.bottomEdge };
        const topRight = { x: this.rightEdge, y: this.topEdge };
        const bottomRight = { x: this.rightEdge, y: this.bottomEdge };
        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ];
    }

    getLaneCenter(laneIndex) {
        const laneWidth = this.width / this.laneCount;
        //this starts on the left edge, adds half a lane width,
        //to be in centre of left lane, then adds the width
        //of a lane multiplied by the number of lanes over
        //being indexed, getting centre x of any given lane
        return this.leftEdge + laneWidth / 2 + laneIndex * laneWidth;
    }

    draw(context) {
        context.lineWidth = 5;
        context.strokeStyle = "white";

        //to get the lane marking x positions
        //interpolate between left and right x values
        for (let i = 1; i <= this.laneCount - 1; i++) {
            const x = lerp(
                this.leftEdge,
                this.rightEdge,
                i / this.laneCount);


            //add dashed line styling to the middle lane markers
            //but not to the left and right edge markers

            //20 pixel dash with 20 pixel gaps
            context.setLineDash([20, 20]);

            context.beginPath();
            context.moveTo(x, this.topEdge);
            context.lineTo(x, this.bottomEdge);
            context.stroke();

        }


        //giving an empty array makes a solid line
        context.setLineDash([]);
        this.borders.forEach(border => {
            context.beginPath();
            context.moveTo(border[0].x, border[0].y);
            context.lineTo(border[1].x, border[1].y);
            context.stroke();
        })
    }
}

