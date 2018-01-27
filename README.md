# Vanilla_neural_network

A feed foreward neural network. 
# Some documentation:
Create a new neural network:
  let n = new neuralNetwork(size_array); 
  Where every place in size_array stands for a different layer. The number represents the amount of nodes 
  in the layer.
  Some functions:
  n.run(input, log = false); //If log is specified as true the outcome will be displayed in the console. (rounded)
  n.train(input, desired); //Input and desired are an array containing numbers. You need to loop through the data outside the network class.
  

