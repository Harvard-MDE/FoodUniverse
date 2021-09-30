//import * as THREE from '../node_modules/three/build/three.module.js';

//Select canvas from HTML
const canvas = document.querySelector("#c");

//Create renderer, camera, and scene
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

var fov = 75;
var aspect = window.innerWidth/window.innerHeight;
var near = 0.1;
var far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(-10, 10, -10);
camera.rotation.set(0, 4, 0);

const scene = new THREE.Scene();

//Create cube
const g_torus = new THREE.TorusGeometry(10, 3, 16, 100);
const m_torus = new THREE.MeshStandardMaterial( {color: 0xFF6347});
const torus = new THREE.Mesh(g_torus, m_torus);
torus.position.set(0, -10, 0);
scene.add(torus);

const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshStandardMaterial({color: 0x0000ff});
const cube = new THREE.Mesh(geometry, material);
cube.position.set(0, 20, 0)
scene.add(cube);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0, 100, -50);
scene.add(pointLight);

const lightHelper = new THREE.PointLightHelper(pointLight, 1);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

const lastTowerCubePosition = [-10, 0, -10];

function animate() {

    requestAnimationFrame(animate);

    torus.rotation.x += 0.01;
    torus.rotation.y += 0.01;

    cube.rotation.x += 0.05;
    cube.rotation.y += 0.05;

    addCube();
    addTowerCube(0, 0, 0);

    camera.position.x -= 0.01;
    camera.position.z -= 0.01;

    renderer.render(scene, camera);

}

function addCube() {

    var size = THREE.MathUtils.randFloat(0.1, 1);
    var [x_rot, y_rot, z_rot] = Array(3).fill().map(() => THREE.MathUtils.randFloat(0, 1));
    var [x_pos, y_pos, z_pos] = Array(3).fill().map(() => THREE.MathUtils.randFloat(-100, 100));

    var mini_cube_geo = new THREE.BoxGeometry(size, size, size);
    var mini_cube_mat = new THREE.MeshStandardMaterial({color: 0xffffff});
    var mini_cube = new THREE.Mesh(mini_cube_geo, mini_cube_mat);

    mini_cube.rotation.set(x_rot, y_rot, z_rot);
    mini_cube.position.set(x_pos, y_pos, z_pos);

    scene.add(mini_cube);

}

function addTowerCube(x_seed, y_seed, z_seed) {

    var tower_cube_geo = new THREE.BoxGeometry(1, 1, 1);
    var tower_cube_mat = new THREE.MeshStandardMaterial({color: 0xff00ff});
    var tower_cube = new THREE.Mesh(tower_cube_geo, tower_cube_mat);

    tower_cube.position.set(lastTowerCubePosition[0]+x_seed, lastTowerCubePosition[1]+y_seed, lastTowerCubePosition[2]+z_seed)
    scene.add(tower_cube);

    var rand = THREE.MathUtils.randFloat(0, 1);
    
    if(rand > 0.75) { //Start new tower if above 10
        
        if(lastTowerCubePosition[0] >= 11) { //Move to next line if full

            if(lastTowerCubePosition[2] >= 11) return; //End if all lines full

            else {

                lastTowerCubePosition[0] = -10;
                lastTowerCubePosition[1] = 0;
                lastTowerCubePosition[2] += 1.1;

            }

        }

        else {
            
            lastTowerCubePosition[0] += 1.1;
            lastTowerCubePosition[1] = 0;

        }
        
    }

    else lastTowerCubePosition[1] += 1.1;

}

animate();