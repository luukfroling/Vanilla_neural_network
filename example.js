let n = new neuralNetwork([3,2,2,2,2,2,3]);

function setup(){
  n.train([1,0,0], [1,0,0]);
}
function keyPressed(){
  for(let i = 0; i < 1000; i++){
    n.train([1,0,0], [1,0,0]);
  }
  console.log(n.error);
}
function draw(){

}
