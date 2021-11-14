const { thisExpression } = require("jscodeshift");

function seed() {
  return Array.from(arguments);
}

function same([x, y], [j, k]) {
  return x === j && y === k;
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
  let a = 1;
  let b = 99999;
  let a2 = 1;
  let b2 = 99999;

  for(let i = 0; i < state.length; i++){
    a = Math.max(state[i][0],a);
    b = Math.min(state[i][0],b);
    a2 = Math.max(state[i][1],a2);
    b2 = Math.min(state[i][1],b2);
  }
  return {topRight:[a,a2], bottomLeft: [b,b2]};
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

const getNeighborsOf = ([x, y]) => {
  return [[x-1,y-1],[x, y-1], [x+1, y-1],[x-1,y],[x+1,y],[x-1,y+1],[x,y+1],[x+1,y+1]];
};

const getLivingNeighbors = (cell, state) => {
  let l = [];
  getNeighborsOf(cell).forEach(x => {
    if(contains.call(state,x)){
      l.push(x)
    }
  });
  return l;
};

const willBeAlive = (cell, state) => {
  let no_neigh = getLivingNeighbors(cell, state).length;
  return (no_neigh === 3) || (no_neigh === 2 & contains.call(state,cell));
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
  let num_states = [];
  num_states.push(state);
  while(iterations > 0){
    num_states.push(calculateNext(state));
    state = calculateNext(state);
    iterations--;
  }
  return num_states;
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