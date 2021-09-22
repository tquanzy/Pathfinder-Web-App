//Pathfinder App
const gridheight = 30;
const gridwidth = 73;

let StartNodeRow = 14;
let StartNodeCol = 18;

let EndNodeRow = 14;
let EndNodeCol = 56;

//Webpage states
moveStart = false;
moveEnd = false;
buildWall = false;

let algorithm = bfs;

//Timeout vars
var w;
var p;

//Struct for cell path
function nodeCell() {
    this.index = 0,
    this.prev = null,
    this.distance = Infinity,
    this.visited = false
}

var curr = new nodeCell;

//Grid generation
//Start and end cell generation

const grid = document.getElementById("grid");

function makeGrid(rows, cols) {
    grid.style.setProperty('--grid-rows', rows);
    grid.style.setProperty('--grid-cols', cols);
    //defining cells
    for (i = 0; i < (rows * cols); i++) {
        let cell = document.createElement("div");
        grid.appendChild(cell).className = "node";
    }
}

makeGrid(gridheight, gridwidth);
resetGrid(false);

//Mouse functionality
$(".node").mousedown(function(){
    let index = $(".node").index(this);
    let startindex = StartNodeRow * gridwidth + StartNodeCol;
    let endindex = EndNodeRow * gridwidth + EndNodeCol;

    console.log("Current:", index);
    console.log(startindex, endindex);

    if (index == startindex){
        moveStart = true;
    }
    else if (index == endindex) {
        moveEnd = true;
    }
    else {
        buildWall = true;
        $(this).toggleClass("wall");
    }
});

$(".node").mouseup(function(){
    moveStart = false;
    moveEnd = false;
    buildWall = false;
});

$(".node").mouseenter(function(){
    let startindex = StartNodeRow * gridwidth + StartNodeCol;
    let endindex = EndNodeRow * gridwidth + EndNodeCol;

    if (!moveStart && !moveEnd && !buildWall) {
        return;
    }
    let index = $(".node").index(this);

    if (moveStart && index != startindex)
        movePrimary(index, "start");
    else if (moveEnd && index != endindex)
        movePrimary(index, "end");
    else if (buildWall && index != startindex && index != endindex)
        $(this).toggleClass("wall");
});

//Adjustments
function movePrimary(newIndex, type){
    let newY = Math.floor(newIndex/gridwidth);
    let newX = newIndex % gridwidth;

    if (type == "start") {
        StartNodeCol = newX;
        StartNodeRow = newY;
    }
    else if (type == "end") {
        EndNodeCol = newX;
        EndNodeRow = newY;
    }
    resetGrid(KeepWalls = true);
    return;
}

//Function to reset grid lines
function resetGrid(keepWall){
    let doc = document.getElementById("grid");
    //console.log(grid);

    startindex = StartNodeRow * gridwidth + StartNodeCol;
    endindex = EndNodeRow * gridwidth + EndNodeCol;

    //Child nodes start at 1
    for (i = 1; i < doc.childNodes.length; i++) {
        if (doc.childNodes[i].className == "node wall" && keepWall) {
            doc.childNodes[i].className = "node wall";
        }

        else {
            doc.childNodes[i].className = "node";
        }

        if (i == startindex + 1) {
            console.log("i:", i);
            doc.childNodes[i].className = "node start";
        }
        else if (i == endindex + 1) {
            doc.childNodes[i].className = "node end";
        }
    }
}

//Create a node array for walkable cells
function arrNode(){
    let doc = document.getElementById("grid");
    let nodes = [];

    for (i = 1; i < doc.childNodes.length; i++) {
        if (doc.childNodes[i].className == "node wall") {
            nodes.push(1);
        }
         else {
            nodes.push(0);
        }
    }
    return nodes;
}

//Algorithm flag
document.getElementById("astar").onclick = function(){
    algorithm = astar;
}
document.getElementById("dijk").onclick = function(){
    algorithm = dijk;
}
document.getElementById("bfs").onclick = function(){
    algorithm = bfs;
}
document.getElementById("dfs").onclick = function(){
    algorithm = dfs;
}

function runSearchAlgo(nodes, start, end, algorithm){
    switch(algorithm){
        case bfs:
            var walk = runBFS(nodes, start, end);
            break;
        case dfs:
            var walk = runDFS(nodes, start, end);
            break;
        case astar:
            var walk = runASTAR(nodes, start, end);
            break; 
        case dijk:
            var walk = runDIJK(nodes, start, end);
            break;
        default:
            alert("No algorithm selected.");
    }
    return walk;
}

function updateNeighbours(current, visited, queue) {
    let n = current.index;
    let row = Math.floor(n / gridwidth);
    let col = n % gridwidth;

    if (row < 0 || row > 29) {
        console.log("Out of bounds error");
    }
    if (col < 0 || col > 72){
        console.log("Out of bounds error");
    }

    let next;
    
    if (row > 0) {
        let next = new nodeCell;
        next.index = n - gridwidth;
        if (!visited[next.index]) {
            queue.push(next);
            next.prev = current;
        }
    }
    if (col > 0) {
        let next = new nodeCell;
        next.index = n - 1;
        if (!visited[next.index]) {
            queue.push(next);
            next.prev = current;
        }
    }
    
    if (row < gridheight - 1) {
        let next = new nodeCell;
        next.index = n + gridwidth;
        if (!visited[next.index]) {
            queue.push(next);
            next.prev = current;
        }
    }

    if (col < gridwidth - 1) {
        let next = new nodeCell;
        next.index = n + 1;
        if (!visited[next.index]) {
            queue.push(next);
            next.prev = current;
        }
    }
}

function runBFS(nodes, start, end){
    if (start == end){
        return false;
    }
    var visited = new Array(nodes.length).fill(false);
    const walkOrder = [];

    let queue = [];
    let st = new nodeCell;
    st.index = start;

    queue.push(st);
    while (queue.length) {
        curr = queue.shift();
        if (curr.index == end) {
            return walkOrder;
        }

        if (nodes[curr.index] != 1 && (curr.index == start || visited[curr.index] == false)) {
            visited[curr.index] = true;
            walkOrder.push(curr.index);

            updateNeighbours(curr, visited, queue);
        }
    }
}

function runDFS(nodes, start, end){
    if (start == end){
        return false;
    }
    var visited = new Array(nodes.length).fill(false);
    const walkOrder = [];

    let stack = [];
    
    let st = new nodeCell;
    st.index = start;

    stack.push(st);
    while (stack.length) {
        curr = stack.pop();
        if (curr.index == end) {
            return walkOrder;
        }

        if (nodes[curr.index] != 1 && (curr.index == start || visited[curr.index] == false)) {
            visited[curr.index] = true;
            walkOrder.push(curr.index);

            updateNeighbours(curr, visited, stack);
        }
    }
}

function runDIJK(nodes, start, end) {
    const walkOrder = [];

    let st = new nodeCell;
    st.index = start;
    st.distance = 0;

    let allNodes = [];
    for (i = 0; i < gridheight; i++){
        for (j = 0; j < gridwidth; j++){
            let node = new nodeCell;
            node.index = i * gridwidth + j;
            allNodes.push(node);
        }
    }

    while (!!allNodes.length){
        allNodes.sort((x, y) => x.distance - y.distance);
        current = allNodes.shift();

        if (nodes[current.index] == 1){
            continue;
        }

        if (current.distance == Infinity)
            return walkOrder;
        
        current.visited = true;
        allNodes.push(current);
        if (current.index = end)
            return walkOrder;
        
        updateVisit(current, allNodes);
    }
}

function updateVisit(current, allNodes) {
    const adjacent = [];
    let n = current.index;
    let row = Math.floor(n / gridwidth);
    let col = n % gridwidth;
    
    if (row > 0) {
        let next = new nodeCell;
        next.index = n - gridwidth;
        adjacent.push(next)
    }
    if (col > 0) {
        let next = new nodeCell;
        next.index = n - 1;
        adjacent.push(next)
    }
    
    if (row < gridheight - 1) {
        let next = new nodeCell;
        next.index = n + gridwidth;
        adjacent.push(next)
    }

    if (col < gridwidth - 1) {
        let next = new nodeCell;
        next.index = n + 1;
        adjacent.push(next)
    }
    adjacent = adjacent.filter(x => !x.visited);

    for (const x of adjacent){
        x.distance = current.distance + 1;
        x.prev = current;
    }
}

//Build walking path
function animate(len, counter1, walk, plen, counter2, path) {
    if(counter1 < len){
        w = setTimeout(function(){
            i = counter1;
            ind = walk[i] + 1;
            let doc = document.getElementById("grid");

            if (walk[i] != startindex && walk[i] != endindex && doc.childNodes[ind].className != "node wall")
                doc.childNodes[ind].className = "node search";
            counter1++;
            animate(len, counter1, walk, plen, counter2, path);
        }, 5);
    }
    else if (counter2 < plen){
        p = setTimeout(function(){
            i = counter2;
            ind = path[i] + 1;
            let doc = document.getElementById("grid");

            if (path[i] != startindex && path[i] != endindex && doc.childNodes[ind].className != "node wall")
                doc.childNodes[ind].className = "node path";
            counter2++;
            animate(len, counter1, walk, plen, counter2, path);
        }, 20);
    }
}

/*function buildPath(len, counter, path){
    if(counter < len){
        p = setTimeout(function(){
            i = counter;
            ind = path[i] + 1;
            let doc = document.getElementById("grid");

            if (path[i] != startindex && path[i] != endindex && doc.childNodes[ind].className != "node wall")
                doc.childNodes[ind].className = "node path";
            counter++;
            buildPath(len, counter, path);
        }, 100);
    }
}*/

//Reset grid function
var resetB = document.getElementById("reset");
resetB.addEventListener('click', function() {
    moveStart = false;
    moveEnd = false;
    buildWall = false;

    clearTimeout(w);
    clearTimeout(p);

    resetGrid(false);
});

//Start pathfinding function
var startB = document.getElementById("start");
startB.addEventListener('click', function() {
    startI = StartNodeRow * gridwidth + StartNodeCol;
    endI = EndNodeRow * gridwidth + EndNodeCol;
    nodes = arrNode();

    let walk = runSearchAlgo(nodes, startI, endI, algorithm);

    let path = [];
    while (curr.prev != null) {
        path.push(curr.index);
        curr = curr.prev;
    }
    path.push(curr.index);
    path.reverse();

    animate(walk.length, 0, walk, path.length, 0, path);

    //buildPath(path.length, 0, path);
    //console.log(walk);
});

