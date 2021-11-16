function seed() {
  return Array.from(arguments);
}

function same([a, b], [c, d]) {
  return a === c && b === d;
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  for(let i = 0; i < this.length; i++) {
    if(same(this[i], cell)) {
      return true;
    }
  }
  return false;
}

const printCell = (cell, state) => {
  if(contains.call(state, cell)){
    return '\u25A3';
  }
  else{
    return '\u25A2';
  }
};

const corners = (state = []) => {
  if(state.length === 0){
    return {topRight:[0,0], bottomLeft: [0,0]};
  }
  let i = 1;
  let k = 99999;
  let j = 1;
  let l = 99999;

  for(let n = 0; n < state.length; n++){
    i = Math.max(state[n][0],i);
    k = Math.min(state[n][0],k);
    j = Math.max(state[n][1],j);
    l = Math.min(state[n][1],l);
  }
  return {topRight:[i,j], bottomLeft: [k,l]};
};

const printCells = (state) => {
  let edges = corners(state);
  let string = "";
  for(let row = edges.topRight[0]; row >= edges.bottomLeft[0]; row--){
    for(let col = edges.bottomLeft[1]; col <= edges.topRight[1]; col++){
      string  = string + printCell([row, col], state);
    }
    string += "\n";
  }
  return string;
};

const getNeighborsOf = ([a, b]) => {
  return [[a-1,b-1],[a, b-1], [a+1, b-1],[a-1,b],[a+1,b],[a-1,b+1],[a,b+1],[a+1,b+1]];
};

const getLivingNeighbors = (cell, state) => {
  let o = [];
  getNeighborsOf(cell).forEach(a => {
    if(contains.call(state,a)){
      o.push(a)
    }
  });
  return o;
};

const willBeAlive = (cell, state) => {
  let noNeighbor = getLivingNeighbors(cell, state).length;
  return (noNeighbor === 3) || (noNeighbor === 2 & contains.call(state,cell));
};

const calculateNext = (state) => {
  let alive = [];
  const edges = corners(state);

  for(let row = edges.topRight[0]+1; row >= edges.bottomLeft[0]-1; row--){
    for(let col = edges.bottomLeft[1]-1; col <= edges.topRight[1]+1; col++){
      if(willBeAlive([row, col],state)){
        alive.push([row,col])
      }
    }
  }
  return alive;
};

const iterate = (state, iterations) => {
  let numStates = [];
  numStates.push(state);
  while(iterations > 0){
    numStates.push(calculateNext(state));
    state = calculateNext(state);
    iterations--;
  }
  return numStates;
};

const main = (pattern, iterations) => {
  const states = iterate(startPatterns[pattern], iterations);
  states.forEach(x => console.log(printCells(x)));
};

const startPatterns = {
    rpentomino: [
      [3, 2],
      [2, 3],
      [3, 3],
      [3, 4],
      [4, 4]
    ],
    glider: [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 3]
    ],
    square: [
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2]
    ]
  };
  
  const [pattern, iterations] = process.argv.slice(2);
  const runAsScript = require.main === module;
  
  if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
      main(pattern, parseInt(iterations));
    } else {
      console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
  }
  
  exports.seed = seed;
  exports.same = same;
  exports.contains = contains;
  exports.getNeighborsOf = getNeighborsOf;
  exports.getLivingNeighbors = getLivingNeighbors;
  exports.willBeAlive = willBeAlive;
  exports.corners = corners;
  exports.calculateNext = calculateNext;
  exports.printCell = printCell;
  exports.printCells = printCells;
  exports.startPatterns = startPatterns;
  exports.iterate = iterate;
  exports.main = main;