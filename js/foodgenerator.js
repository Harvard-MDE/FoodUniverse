//import * as THREE from '../node_modules/three/build/three.module.js';

let canvas, renderer, camera, scene;

let meals = [];
let mealObjects = [];

let startOrigin = [-50, 0, -50];
let originOffset = 10;
let gapOffset = 0.1;
let lastOrigin = [0, 0, 0];
let endOrigin = [50, 0, 50];

const layerDrawingOrder = {
    0 : [0, 0, 0],
    1 : [1, 0, 0],
    2 : [0, 0, 1],
    3 : [-1, 0, 0],
    4 : [0, 0 -1],
    5 : [1, 0, 1],
    6 : [1, 0, -1],
    7 : [-1, 0, 1],
    8 : [-1, 0, -1]
};

const layerColor = {
    0 : 0x00ffff,
    1 : 0xff00ff,
    2 : 0xffff00,
    3 : 0xa0a0a0,
    4 : 0xe5e5e5
};

function generateMeal(index) {

    var meal = {
        0 : THREE.MathUtils.randInt(1, 9),
        1 : THREE.MathUtils.randInt(1, 9),
        2 : THREE.MathUtils.randInt(1, 9),
        3 : THREE.MathUtils.randInt(1, 9),
        4 : THREE.MathUtils.randInt(1, 9)
    }

    return meal;

}

function generateOrigin(index) {

    var origin = [];

    if(index === 0) {
        
        origin[0] = startOrigin[0];
        origin[1] = startOrigin[1];
        origin[2] = startOrigin[2];

    }

    else {

        origin[0] = lastOrigin[0];
        origin[1] = lastOrigin[1];
        origin[2] = lastOrigin[2];

    }

    var transOrigin = [0, 0, 0];
    var newOrigin = [0, 0, 0];
    
    if(origin[0] < endOrigin[0]) {

        if(origin[2] < endOrigin[2]) {

            transOrigin[2] += originOffset;

        }

        else {

            transOrigin[2] = startOrigin[2];
            transOrigin[0] += originOffset;

        }

    }

    newOrigin[0] = THREE.MathUtils.randInt(-10, 10) + transOrigin[0] + origin[0];
    newOrigin[1] = THREE.MathUtils.randInt(-5, 5) + 0;
    newOrigin[2] = THREE.MathUtils.randInt(-10, 10) + transOrigin[2] + origin[2];

    lastOrigin[0] = newOrigin[0];
    lastOrigin[1] = newOrigin[1];
    lastOrigin[2] = newOrigin[2];

    return newOrigin;

}

function drawMeal(meal, origin) {

    var drawGroup = new THREE.Group();
    var drawOrigin = origin;

    for (var i = 0; i < 5; i++) {

        drawLayer(meal[i], drawOrigin, layerColor[i], drawGroup);
        drawOrigin[1]++;

    }

    meals.push(meal);
    mealObjects.push(drawGroup);

    scene.add(drawGroup);

}

function drawLayer(score, origin, color, group) {

    for (var i = 0; i < score; i++) {

        var transOrigin = layerDrawingOrder[i];
        var drawOrigin = [];

        drawOrigin[0] = transOrigin[0] + origin[0]; 
        drawOrigin[1] = transOrigin[1] + origin[1];
        drawOrigin[2] = transOrigin[2] + origin[2];

        drawBlock(drawOrigin, color, group);

    }

}

function drawBlock(origin, color, group) {

    var block_geo = new THREE.BoxGeometry(1, 1, 1);
    var block_mat = new THREE.MeshStandardMaterial({color: color});

    var block = new THREE.Mesh(block_geo, block_mat);
    block.position.set(origin[0], origin[1], origin[2]);

    group.add(block);

}

function init() {

    //Select canvas from HTML
    canvas = document.querySelector("#c");

    //Create renderer, camera, and scene
    renderer = new THREE.WebGLRenderer({canvas});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    var fov = 75;
    var aspect = window.innerWidth/window.innerHeight;
    var near = 0.1;
    var far = 1000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    
    //Camera Zoom-Out-Start View
    camera.position.set(0, 0, 0);
    camera.rotation.set(0, 1, 0);

    //Camera Side-View
    //camera.position.set(75, 20, 75);
    //camera.rotation.set(0, 0.75, 0);

    //Camera Map-View
    //camera.position.set(0, 25, 0);
    //camera.rotation.set(-1.58, 0, 0);

    scene = new THREE.Scene();

    //Add ambient light 1
    var pointLight1 = new THREE.PointLight(0xffffff);
    pointLight1.position.set(50, 50, 50);
    scene.add(pointLight1);

    //Add ambient light 2
    var pointLight2 = new THREE.PointLight(0xffffff);
    pointLight2.position.set(-200, 10, 0);
    scene.add(pointLight2);

    //Add grid helper
    //var gridHelper = new THREE.GridHelper(200, 50);
    //scene.add(gridHelper);

    //Draw dishes
    for(var i = 0; i < 100; i++) {

        var m = generateMeal(i);
        var o = generateOrigin(i);
        drawMeal(m, o);

    }

}

function animate() {

    requestAnimationFrame(animate);

    //Camera Pan
    camera.position.x += 0.02;
    camera.position.z += 0.02;
    camera.position.y += 0.01;

    //Camera Zoom-In
    //camera.position.y += 0.005;

    //Rotate dishes around y-axis
    for (var i = 0; i < mealObjects.length; i++) {
        mealObjects[i].rotation.y += (meals[i][0]*0.0001);
    }

    renderer.render(scene, camera);

}

//Execute

init();
animate();