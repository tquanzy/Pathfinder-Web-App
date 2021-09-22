/*
A node class declared for the pathfinding grid.
The class holds basic information about the node and attributes
required for pathfinding algorithms.
 */

class Node{
    //a constructor for node class
    constructor(x, y, status) {
        //The x coordinate of the node
        this.x = x;

        //The y coordinate of the node
        this.y = y;

        //The status of the node indicates if it is walkable
        //Node is default created as walkable
        this.status = (status === undefined ? true : status);
    }
}

module.exports = Node;