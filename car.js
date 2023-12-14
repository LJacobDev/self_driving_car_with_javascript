class Car
{
    constructor(x,y, width, height)
    {
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
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

