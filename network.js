class NeuralNetwork {
    constructor(neuronCounts) {

        //this network consists of an array of network levels
        this.levels = [];

        //neuronCounts is an array of neuron numbers, like
        //[5, 6, 4] in the case of having 5 sensor inputs, 
        //6 neurons in the middle,
        //and 4 neurons as final outputs

        for (let i = 0; i < neuronCounts.length - 1; i++) {
            this.levels.push(new Level(
                neuronCounts[i], neuronCounts[i + 1]
            ));
        }

    }

    static feedForward(givenInputs, network) {
        let outputs = Level.feedForward(
            givenInputs, network.levels[0]
        );

        for (let i = 1; i < network.levels.length; i++) {
            outputs = Level.feedForward(
                outputs, network.levels[i]
            );
        }
        return outputs;
    }
}


class Level {
    constructor(inputCount, outputCount) {

        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);

        //there is going to be one bias per each output neuron
        this.biases = new Array(outputCount);

        //each input will be connected to all of the outputs
        //and their connections will each have its own -1 to 1 weight
        this.weights = [];

        //the weights main indices will identify an input neuron
        //and then each value at those indices will be an array
        //of each output neuron,
        //so a connection for input 1 to output 1 would be weights[0][0]
        //and a connection for input 1 to output 2 would be weights[0][1]
        for (let i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount);
        }


        Level.#randomize(this);

    }

    //this private method is made as a static method
    //so that it can be serialized
    static #randomize(level) {

        console.log(level.inputs.length, level.outputs.length);

        //set the weights of each connection
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
                //console.log(i,j);
                level.weights[i][j] = Math.random() * 2 - 1;  //this sets each weight to something between -1 and 1
            }
        }

        //set a bias for each output that is also going to be -1 to 1
        for (let i = 0; i < level.biases.length; i++) {
            level.biases[i] = Math.random() * 2 - 1;
        }
    }


    static feedForward(givenInputs, level) {

        //set this layer's input to the given ones
        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i];
        }


        //get this layer's output values by adding up its weighted inputs
        for (let i = 0; i < level.outputs.length; i++) {
            let sum = 0;
            for (let j = 0; j < level.inputs.length; j++) {

                sum += level.inputs[j] * level.weights[j][i];

            }

            //if this output neuron's weighted sum is higher than its bias
            //it will activate with a full 1 output value
            //this results in switches that are discretely on or off
            if (sum > level.biases[i]) {
                level.outputs[i] = 1;
            }
            else {
                level.outputs[i] = 0;
            }
        }

        return level.outputs;
    }

}