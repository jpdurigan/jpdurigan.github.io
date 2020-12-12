function playVideo() {
    const corporeoVideo = document.getElementById('corporeo-video');
    const corporeoQuery = $('#corporeo-video');

    corporeoQuery.attr('controls', '');
    try {
        corporeoVideo.play();

        corporeoVideo.requestFullscreen();
        document.webkitRequestFullscreen();
        document.mozRequestFullscreen();
    } catch(err) {
        print(err);
    }
    
    corporeoQuery.one('ended', (event) => {
        print('video acabou');
        if (document.fullscreenElement) {
            document.webkitExitFullscreen();
            document.mozCancelFullscreen();
            document.exitFullscreen();
        }
        corporeoQuery.removeAttr('controls');
        corporeoVideo.load();
    });
}




// animação do bg

let SEPARATION = 80;
let MOUSE_STRENGTH = 4;
let CHILD_NUMBER = 10;


var pointMatrix = [];
var maxIndex;


function setup() {
    var canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('p5-canvas');
    canvas.position(0, 0);
    canvas.style('z-index', '-1');

    if (windowWidth < 600) {
        SEPARATION = 60;
    }

    pointMatrix = [];
    var x_count = 0;
    var y_count = 0;
    for (var x = - 3 * SEPARATION / 2; x < windowWidth +  3 * SEPARATION / 2; x += SEPARATION) {
        pointMatrix[x_count] = pointMatrix[x_count] || [];
        y_count = 0;
        for (var y = - 3 * SEPARATION / 2; y < windowHeight + 3 * SEPARATION / 2; y += SEPARATION) {
            var point_index = createVector(x_count, y_count);
            var point_position = createVector(x, y);

            pointMatrix[x_count][y_count] = new Point(point_index, point_position);
            y_count++;
        }
        x_count++;
    }

    maxIndex = createVector(x_count - 1, y_count - 1);
}


function draw() {
    background(0);
    for (var x = 0; x < maxIndex.x; x++) {
        for (var y = 0; y < maxIndex.y; y++) {
            pointMatrix[x][y].draw();
        }
    }
}


function updatePoints() {
    for (var x = 0; x < maxIndex.x; x++) {
        for (var y = 0; y < maxIndex.y; y++) {
            pointMatrix[x][y].updatePosition(mouseX, mouseY);
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

        var delta = SEPARATION / CHILD_NUMBER;

        this.childrenX = [];
        for(var i = 0; i <= CHILD_NUMBER; i++) {
            var newPosition = createVector(position.x + (i + 1) * delta, position.y);
            var newChild = new ChildPoint(newPosition);
            this.childrenX.push(newChild);
        }

        this.childrenY = [];
        for(var i = 0; i <= CHILD_NUMBER; i++) {
            var newPosition = createVector(position.x, position.y + (i + 1) * delta);
            var newChild = new ChildPoint(newPosition);
            this.childrenY.push(newChild);
        }
    }

    draw() {
        // point(this.position);
        var neighbour_bottom = pointMatrix[this.index.x + 1][this.index.y];
        var neighbour_right = pointMatrix[this.index.x][this.index.y + 1];

        stroke(100);
        strokeWeight(2);

        var queueX = [];
        queueX.push(this)
        queueX = queueX.concat(this.childrenX);
        queueX.push(neighbour_right);
        for(var i = 0; i <= CHILD_NUMBER; i++) {
            line(queueX[i].position.x, queueX[i].position.y,
                queueX[i+1].position.x, queueX[i+1].position.y);
        }

        var queueY = [];
        queueY.push(this)
        queueY = queueY.concat(this.childrenY);
        queueY.push(neighbour_bottom);
        for(var i = 0; i <= CHILD_NUMBER; i++) {
            line(queueY[i].position.x, queueY[i].position.y,
                queueY[i+1].position.x, queueY[i+1].position.y);
        }
    }

    updatePosition(mouse_x, mouse_y) {
        var mousePos = createVector(mouse_x, mouse_y);
        var direction = getDirection(mousePos, this.position);
        var distance = getDistance(this.position, mousePos);
        var vectorChange = direction.mult(MOUSE_STRENGTH * 20 * pow(1 / MOUSE_STRENGTH, distance / (MOUSE_STRENGTH * 50)));
        this.position = p5.Vector.sub(this.inicialPosition, vectorChange);

        for(var i = 0; i <= CHILD_NUMBER; i++) {
            this.childrenX[i].updatePosition(mouse_x, mouse_y);
            this.childrenY[i].updatePosition(mouse_x, mouse_y);
        }
    }
}


class ChildPoint {
    constructor(position) {
        this.position = position;
        this.inicialPosition = position;
    }

    updatePosition(mouse_x, mouse_y) {
        var mousePos = createVector(mouse_x, mouse_y);
        var direction = getDirection(mousePos, this.position);
        var distance = getDistance(this.position, mousePos);
        var vectorChange = direction.mult(MOUSE_STRENGTH * 20 * pow(1 / MOUSE_STRENGTH, distance / (MOUSE_STRENGTH * 50)));
        this.position = p5.Vector.sub(this.inicialPosition, vectorChange);
    }
}


function getDirection(vec1, vec2) {
    var direction = createVector(vec1.x - vec2.x, vec1.y - vec2.y).normalize();
    return direction;
}


function getDistance(vec1, vec2) {
    return dist(vec1.x, vec1.y, vec2.x, vec2.y);
}