class neuralNetwork {
  //Construct the network with specified sizes.
  constructor(sizes){
    this.layers = new Array(); //We wnt this lib to be as dinamic as possible, so we need to store all the layers in an array.
    this.biases = new Array(sizes.length-1);
    this.biases.fill(1); //We start of with every bias being 1.
    this.weights = new Array();
    this.temp = new Array();
    this.output = new Array(sizes[sizes.length -1]);
    this.netconfig = sizes; //Just so we can later see what the network looks like in the console.
    for(let i = 0; i < sizes.length; i++){ //Loop through every layer.
      //Create layers.
      this.layers.push(new Array(sizes[i])); //Put an array with the size of the layer inside the bigger array containing all the layers
      //Create Weights
      for(let j = 0; j < sizes[i + 1]; j++){
        this.temp.push(new Array(sizes[i]));
        this.temp[j].fill(Math.random() * 2 -1);
      }
      this.weights.push(this.temp);
      this.temp = new Array();
    }
    delete this.temp;
    this.weights.pop();
  }
  //Activation function for the network, simple feed foreward, input is an array.
  activate(input){
    //copy input
    this.layers[0] = input;
    //Loop through all the layers.
    for(let i = 1; i < this.layers.length; i++){
      for(let j = 0; j < this.layers[i].length; j++){
        var sum = 0;
        for(let k = 0; k < this.layers[i - 1].length; k++){ //-1 because we need the previous element. This does not bug because we start i at 1. 1 - 1 = 0, VALID.
          sum += this.layers[i-1][k] * this.weights[i-1][j][k];
        }
        sum += this.biases[i-1];
        this.layers[i][j] = sigmoid(sum);
      }
    }
    this.output = this.layers[this.layers.length-1];
  }
  //Train the network. Backpropagation.
  train(input, desired){
    this.activate(input);
    this.error = new Array(this.output.length);
    for(let i = 0; i < this.error.length; i++){
      this.error[i] = desired[i] - this.output[i];
    }
    this.backPropagation();
  }
  //A run function to run the network once fully trained.
  run(input, log = false){
    this.activate(input);
    if(log){
      for(let i = 0; i < this.output.length; i++){
        this.output[i] = Math.round(this.output[i]);
      }
      console.log(this.output);
    }
  }
  /* So we want to create an array, storing every path through the network we have already seen.
  *  We creat a 'changes' array which is the size of the current layer. in every spot in that array is another array containing the derivatives of all the paths from that node on.
  *  So every weight connected to the specific node gets an array of every possible path.
  *  We can reuse a lot so that reduces the runtime as well. It will be resource consuming for larger networks.
  */
  backPropagation(){
    this.changes = new Array(this.output.length);
    this.changes.fill(new Array());
    this.errorZ = new Array(this.output.length);
    this.biaschanges;

      //Fill up the array.
      for(let i = 0; i < this.output.length; i++){
       this.errorZ[i] = [this.error[i] * sigmoidD(this.output[i])];
      }
      this.changes = this.errorZ;

      //Loop through all the layers backwards
      for(let i = this.layers.length - 2; i > -1; i--){ //Starting at the last hidden layer layer
        //change weights corresponding to that layers
        for(let j = 0; j < this.weights[i].length; j++){
          for(let k = 0; k < this.weights[i][j].length; k++){
            for(let l = 0; l < this.changes[j].length; l++){
              this.weights[i][j][k] += this.changes[j][l] * this.layers[i][k];
            }
          }
        }
        //Update changes, 1st create new array:
        var nchanges = new Array(this.layers[i].length); //New array with all the spots of the layer we want to calculate the paths for. I feel this needs way more comments, sorry future Luuk...
        // We do not need this for now // TODO in case of error decomment// nchanges.fill(new Array(this.change[0].length * this.layers[i+1].length)); //So we need the existing size * the last Dsigmoid layers size. not tested but just say this is right.
        //Now we need to fill the new array:
        for(let j = 0; j < nchanges.length; j++){ //Size of layer after taget weights.
          nchanges[j] = new Array();
          for(let k = 0; k < this.changes.length; k++){ //Size of layer after target layer.
            for(let l = 0; l < this.changes[k].length; l++){ //Number of paths from specified node
              nchanges[j].push(this.changes[k][l] * sigmoidD(this.layers[i][j]) * this.weights[i][k][j]);
              //k: the size of the right layer around the weights,
              //j: the size of the left layer.
              //l: the number of paths already excisting. so now we have a size of l*k
            }
          }
        }
        this.changes = nchanges;
      }
  }
}
//All the functions used. Don't mind those, just 'simple' maths.
function sigmoid(t) {
    return 1/(1+Math.pow(Math.E, -t)); // Go from any number to number from 0 to 1. sigmoid(0) = 0.5
}
function sigmoidD(t){
  return sigmoid(t) * (1-sigmoid(t)); //Sigmoid derivative
}
function rsigmoid(y){
  return log(y/(1-y)) //Reverse the sigmoid. Go from number between 0 and 1 to normal number.
}
