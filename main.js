const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carContext = carCanvas.getContext("2d");
const networkContext = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, 3);


//const car = new Car(road.getLaneCenter(1), 100, 30, 50,"AI", 3);

const N = 2000;
const cars = generateCars(N);
let bestCar = cars[0];

if(localStorage.getItem("bestBrain")){
    console.log("loading saved car 'bestbrain' as well as creating "+ (N-1) + " other mutated versions based off it")

    for(let i=0; i < cars.length; i++){

        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain")
        );

        if(i != 0){
            NeuralNetwork.mutate(cars[i].brain, 0.1);
        }

    }
}
else{
    console.log("no saved 'bestBrain' found");
}

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DRIVEFORWARD", 2),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DRIVEFORWARD", 2),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DRIVEFORWARD", 2),
    new Car(road.getLaneCenter(0), -500, 30, 50, "DRIVEFORWARD", 2),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DRIVEFORWARD", 2),
    new Car(road.getLaneCenter(1), -700, 30, 50, "DRIVEFORWARD", 2),
    new Car(road.getLaneCenter(2), -700, 30, 50, "DRIVEFORWARD", 2),
    new Car(road.getLaneCenter(0), -900, 30, 50, "DRIVEFORWARD", 2),
    new Car(road.getLaneCenter(2), -900, 30, 50, "DRIVEFORWARD", 2),
    new Car(road.getLaneCenter(1), -1100, 30, 50, "DRIVEFORWARD", 2),
    new Car(road.getLaneCenter(0), -1100, 30, 50, "DRIVEFORWARD", 2),
    new Car(road.getLaneCenter(2), -1300, 30, 50, "DRIVEFORWARD", 2),
    new Car(road.getLaneCenter(0), -1500, 30, 50, "DRIVEFORWARD", 2),
    new Car(road.getLaneCenter(1), -1500, 30, 50, "DRIVEFORWARD", 2),
    new Car(road.getLaneCenter(1), -1700, 30, 50, "DRIVEFORWARD", 2),
    new Car(road.getLaneCenter(2), -1700, 30, 50, "DRIVEFORWARD", 2),
    new Car(road.getLaneCenter(0), -1900, 30, 50, "DRIVEFORWARD", 2),
    new Car(road.getLaneCenter(2), -1900, 30, 50, "DRIVEFORWARD", 2)
];


animate();


function save() {
    localStorage.setItem(
        "bestBrain",
        JSON.stringify(bestCar.brain));
    console.log("saved new 'bestBrain' car");

}

function discard() {
    localStorage.removeItem("bestBrain");
    console.log("cleared 'bestBrain' from save data");
}

function generateCars(N) {
    const cars = [];
    for (let i = 1; i <= N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"))
    }
    return cars;
}


function animate(time) {


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
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }


    //get the best car by finding which one has the
    //lowest y value, indicating it has made it farther down
    //the road than any other
    bestCar = cars.find(
        c => c.y == Math.min(
            ...cars.map(c => c.y)
        )
    )


    //putting this in the animation loop
    //allows it to vertically resize to window changes
    //but it also acts like erasing the
    //past locations of the car so it doesn't leave streaks
    //when it moves
    carCanvas.height = window.innerHeight;

    networkCanvas.height = window.innerHeight;

    //make the road move the opposite vertical
    //way that the car moves
    //making the car stay in view and the road appear to go by
    carContext.save();

    //the canvas moves opposite direction of the car,
    //but is translated so that the car appears to be
    //70% of the way down the canvas viewspace
    carContext.translate(0, -bestCar.y + carCanvas.height * 0.7);

    road.draw(carContext);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carContext, "red");
    }

    //lower the colour alpha of the blue cars
    carContext.globalAlpha = 0.2;
    //draw car on canvas at new position
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carContext, "blue");
    }

    carContext.globalAlpha = 1;

    //draw one car of interest again in full alpha colour
    bestCar.draw(carContext, "blue", true);

    carContext.restore();


    //this makes the connections between the neurons
    //look like moving dashed lines
    networkContext.lineDashOffset = -time / 50;

    //this is supposed to be showing what the neuron
    //on and off states are, but it doesn't seem to be doing that yet,
    //but it does show the outputs being used
    //and it seems to show what the weights of the connections are
    Visualizer.drawNetwork(networkContext, bestCar.brain);

    //this will cause this animate method 
    //to be run several times per second
    requestAnimationFrame(animate);
}
