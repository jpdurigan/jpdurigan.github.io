let SEPARATION = 40;
let MOUSE_STRENGTH = 4;
let CHILD_NUMBER = 4;


var point_matrix = [];
var max_index;


function setup() {
    var canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('p5-canvas');
    canvas.position(0, 0);
    canvas.style('z-index', '-1');

    if (windowWidth < 600) {
        SEPARATION = 25;
    }

    point_matrix = [];
    var x_count = 0;
    var y_count = 0;
    for (var x = - 3 * SEPARATION / 2; x < windowWidth +  3 * SEPARATION / 2; x += SEPARATION) {
        point_matrix[x_count] = point_matrix[x_count] || [];
        y_count = 0;
        for (var y = - 3 * SEPARATION / 2; y < windowHeight + 3 * SEPARATION / 2; y += SEPARATION) {
            var point_index = createVector(x_count, y_count);
            var point_position = createVector(x, y);

            point_matrix[x_count][y_count] = new Point(point_index, point_position);
            y_count++;
        }
        x_count++;
    }

    max_index = createVector(x_count - 1, y_count - 1);

}


function draw() {
    background(0);
    for (var x = 0; x < max_index.x; x++) {
        for (var y = 0; y < max_index.y; y++) {
            point_matrix[x][y].draw();
        }
    }
}


function updatePoints() {
    for (var x = 0; x < max_index.x; x++) {
        for (var y = 0; y < max_index.y; y++) {
            point_matrix[x][y].updatePosition(mouseX, mouseY);
        }
    }
}

function mouseMoved() {
    updatePoints();
}


function mouseDragged() {
    updatePoints();
}


function windowResized() {
    setup();
}


class Point {
    constructor(index, position) {
        this.index = index;
        this.position = position;
        this.inicialPosition = position;
    }

    draw() {
        point(this.position);
        var neighbour_bottom = point_matrix[this.index.x + 1][this.index.y];
        var neighbour_right = point_matrix[this.index.x][this.index.y + 1];

        stroke(100);
        strokeWeight(2);
        line(this.position.x, this.position.y,
            neighbour_bottom.position.x, neighbour_bottom.position.y);
        line(this.position.x, this.position.y,
            neighbour_right.position.x, neighbour_right.position.y);
    }

    updatePosition(mouse_x, mouse_y) {
        var mousePos = createVector(mouse_x, mouse_y);
        var direction = getDirection(mousePos, this.position);
        var distance = getDistance(this.position, mousePos);
        var vectorChange = direction.mult(MOUSE_STRENGTH * 20 * pow(1 / MOUSE_STRENGTH, distance / (MOUSE_STRENGTH * 50)));
        var positionUpdated = p5.Vector.sub(this.inicialPosition, vectorChange);

        this.position = constrainVector(positionUpdated, this.inicialPosition);
    }
}


function getDirection(vec1, vec2) {
    var direction = createVector(vec1.x - vec2.x, vec1.y - vec2.y).normalize();
    return direction;
}


function getDistance(vec1, vec2) {
    return dist(vec1.x, vec1.y, vec2.x, vec2.y);
}


function constrainVector(vec, initial) {
    var vecX = constrain(vec.x, initial.x - 2 * SEPARATION, initial.x + 2 * SEPARATION);
    var vecY = constrain(vec.y, initial.y - 2 * SEPARATION, initial.y + 2 * SEPARATION);
    return createVector(vecX, vecY);
}