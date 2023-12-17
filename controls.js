class Controls
{

    constructor()
    {
        this.forward = false;
        this.reverse = false;
        this.left = false;
        this.right = false;

        this.#addKeyboardListeners();
        
        //counter shows that onkeydown event
        //fires many times per second and not just once
        //whenever holding it down after one press
        //this.counter = 0;
    }

    #addKeyboardListeners()
    {
        document.onkeydown = (event) => {
            
            switch(event.key){
                case "ArrowLeft":
                    this.left = true;
                    break;
                case "ArrowRight":
                    this.right = true;
                    break;
                case "ArrowUp":
                    this.forward = true;
                    break;
                case "ArrowDown":
                    this.reverse = true;
                    break;
            }
            //console.log(this.counter++)
            //console.table(this);
        }

        document.onkeyup = (event) => {
            
            switch(event.key){
                case "ArrowLeft":
                    this.left = false;
                    break;
                case "ArrowRight":
                    this.right = false;
                    break;
                case "ArrowUp":
                    this.forward = false;
                    break;
                case "ArrowDown":
                    this.reverse = false;
                    break;
            }
            //console.log(this.counter++);
            //console.table(this);
        }

    }
}