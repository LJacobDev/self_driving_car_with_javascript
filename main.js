const canvas = document.getElementById("myCanvas");
canvas.width = 200;

const context = canvas.getContext("2d");

const car = new Car(100,100,30,50);

animate();

function animate(){

    //putting this in the animation loop
    //allows it to vertically resize to window changes
    //but it also acts like erasing the
    //past locations of the car so it doesn't leave streaks
    //when it moves
    canvas.height = window.innerHeight;


    //gets movement and updates xy position
    car.update();

    //draw car on canvas at new positoin
    car.draw(context);

    //this will cause this animate method 
    //to be run several times per second
    requestAnimationFrame(animate);
}
