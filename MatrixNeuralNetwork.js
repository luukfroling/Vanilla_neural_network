class neuralNetwork2 {
  constructor(sizes){
    //Create layers:
    this.layers = new Array();
    for(let i = 0; i < sizes.length; i++){
      this.layers.push(new Matrix(sizes[1]));
    }
    //Create weights:
    this.weights = new Array();
    for(let i = 0; i < this.layers.length - 1; i++){
      this.weights.push(new Matrix(sizes[i+1],sizes[i]));
    }
  }
  /* An activation function for the network.
  *  Go through all the layers and dot multiply. We also need to apply the sigmoid function over every element.
  */
  activate(input){
    this.layers[0] = Matrix.fromArray(input);
    for(let i = 0; i < this.weights.length; i++){
      let w = this.weights[i];
      let x = this.layers[i];
      this.layers[i+1] = Matrix.product(w, x);
      this.layers[i+1].func(sigmoid);
    }
    this.output = this.layers[this.layers.length - 1];
  }

  run(input){
    this.activate(input);
    this.output.show();
  }
  /* A training fucntion using backpropagation.
  *  We need to loop through every layer, and we need to do the following:
  * -Transpose The weight matrix so we can dot product the matrix with the errors to get the errors of the
  * previous layer.
  * -Transpose the layer so we can dot multiply the error.
  * - Calculate the dot product of error * input so we get the change
  * - Calculate the dot product of the transposed weight * error so we get the next error.
  * - Add the calculated change to the weight matrix we are currently in.
  */
  train(input, des){
    this.activate(input);
    let error = Matrix.substract(Matrix.fromArray(des), this.output);
    error.show();
    for(let i = this.weights.length - 1; i > -1; i--){
      //Transpose:
      let inT = Matrix.transpose(this.layers[i]);
      let wT = Matrix.transpose(this.weights[i]);
      //Product:
      let change = Matrix.product(error, inT);
      error = Matrix.product(wT, error);
      //Update weights:
      this.weights[i].add(change);
    }
  }
}

function sigmoid(x) {
    return 1/(1+Math.pow(Math.E, -x));
}
