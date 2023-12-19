const canvas = document.getElementById("myCanvas");
canvas.width = 200;

const context = canvas.getContext("2d");

const road = new Road(canvas.width / 2, canvas.width * 0.9, 3);

const car = new Car(road.getLaneCenter(1), 100, 30, 50,"KEYS", 3);


const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DRIVEFORWARD", 2)
];


animate();

function animate() {


    for (let i = 0; i < traffic.length; i++) {
        
        //giving this update an empty array argument
        //because traffic is not meant to detect other traffic
        //but it is using a general method that does check
        //the traffic objects in this array if there are any
        traffic[i].update(road.borders, []);
    }


    //gets car movement and updates its xy position
    //give it the road borders so the car's sensors can look for them
    //give it the traffic array so it can detect distance to cars
    //and check other cars for collisions
    car.update(road.borders, traffic);

    //putting this in the animation loop
    //allows it to vertically resize to window changes
    //but it also acts like erasing the
    //past locations of the car so it doesn't leave streaks
    //when it moves
    canvas.height = window.innerHeight;

    //make the road move the opposite vertical
    //way that the car moves
    //making the car stay in view and the road appear to go by
    context.save();

    //the canvas moves opposite direction of the car,
    //but is translated so that the car appears to be
    //70% of the way down the canvas viewspace
    context.translate(0, -car.y + canvas.height * 0.7);

    road.draw(context);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(context, "red");
    }    
    //draw car on canvas at new position
    car.draw(context, "blue");

    context.restore();

    //this will cause this animate method 
    //to be run several times per second
    requestAnimationFrame(animate);
}
