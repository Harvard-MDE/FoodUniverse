import * as THREE from 'three';
import 'three/examples/js/controls/OrbitControls';
import Planet from './views/Planet.js';
import RenderQueue from './views/RenderQueue';
import BlockLoader from './food/BlockLoader.js';

//import Planet from './planet.js';
//import Orbit from "./Orbit";

class Main {

    constructor() {

        //Create camera
        this._camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 100000);
        this._camera.position.z = 2700;
        window.camera = this._camera;

        //Create scene
        this._scene = new THREE.Scene();

        //Create renderer
        this._renderer = new THREE.WebGLRenderer({antialias: false, alpha: true}); //set alpha to true
        this._renderer.setPixelRatio( window.devicePixelRatio );
        this._renderer.sortObjects = false;
        this._renderer.setSize( window.innerWidth, window.innerHeight );
        window.renderer = this._renderer;
        document.body.appendChild( this._renderer.domElement );

        //Create render queue
        //window.renderQueue = new RenderQueue();

        //Create lights ?
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        this._scene.add(this.ambientLight);

        this.directionalLight = new THREE.DirectionalLight( 0xffffff, 1.6 );
        this.directionalLight.position.set( -1, 1.0, 1 );
        this._scene.add(this.directionalLight);
        window.light = this.directionalLight;

        //Create orbit controls
        this._controls = new THREE.OrbitControls( this._camera, this._renderer.domElement );
        this._controls.enableDamping = true;
        this._controls.dampingFactor = 0.1;
        this._controls.rotateSpeed = 0.1;
        this._controls.autoRotate = false;
        this._controls.autoRotateSpeed = 0.01;
        this._controls.zoomSpeed = 0.1;

        window.renderQueue = new RenderQueue();

        //Load example hacked restaurant 
        var blockLoader = new BlockLoader();
        var block = blockLoader.loadDefaultBlock1();
        var restaurant = block.restaurants[0];
        var menu = restaurant.menus[0];
        var item = menu.items[0]; 
        //one dish

        //Create planet with all features (in sub-classes)
        this.planet_0 = new Planet(item);
        this.planet_1= new Planet(item);

        this.jurisdictionGroup = new THREE.Group()
        this.scale = 1
      
        this.jurisdictionGroup.add(this.planet_0.view)
        this.jurisdictionGroup.add(this.planet_1.view)


        this.planet_0.view.position.x = 4000 / this.scale
        this.planet_0.view.position.y = 0 / this.scale
        this.planet_0.view.position.z = 1 / this.scale

        this.jurisdictionGroup.position.x = 1 / this.scale
        this.jurisdictionGroup.position.y = 0 / this.scale
        this.jurisdictionGroup.position.z = 1 / this.scale

        // this.planet = new Planet(this.jurisdictionGroup, this.data)
        // this.orbit = new Orbit(this.jurisdictionGroup, this.scale, this.data.astre.Xposition, this.data.astre.Zposition, this.data.astre.color, this.data.astre.focusColor)

        this.scene.add(this.jurisdictionGroup);
        this.animate();

    }

    get renderer(){
        return this._renderer;
    }

    get camera(){
        return this._camera;
    }

    get scene(){
        return this._scene;
    }

    onWindowResize() {

        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize( window.innerWidth, window.innerHeight );

    }

    animate() {
        
        //this.stats.begin();
        requestAnimationFrame( this.animate.bind(this) );

        this._controls.update();
        this._renderer.render( this._scene, this._camera );
        //this.stats.end();

        window.renderQueue.update();

        this.planet_0.update();
        // this.planet_1.update();

    }

}

export default Main;
