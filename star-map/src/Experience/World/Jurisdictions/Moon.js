import * as THREE from 'three'
import Time from '../../Utils/Time'
import Orbit from "../Orbit";


import FoodPlanet from '../../Food/views/FoodPlanet.js';
import BlockLoader from '../../Food/food/BlockLoader.js';
import RenderQueue from '../../Food/views/RenderQueue.js';

export default class Moon {
    constructor(jurisdictionGroup, data, _options) {
        this.experience = window.experience
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.raycaster = this.experience.raycaster
        this.jurisdictionGroup = jurisdictionGroup
        this.data = data
        this.scale = 70000
        this.time = new Time()

        this.setMoon()
        this.setOrbit()
    }

    setMoon() {
        this.moonGroup = new THREE.Group()
        this.moonGroup.name = this.data.name
        this.moonGroup.position.x = this.data.Xposition;
        this.moonGroup.position.y = this.data.Yposition;
        this.moonGroup.position.z = this.data.Zposition;
       
        // Test
        this.moonMesh = new THREE.Mesh(
            new THREE.SphereGeometry(1, 32, 32, 1),
            new THREE.MeshStandardMaterial({
                opacity: 1,
                transparent: true,
            })
        );
        const textureMap = this.data.name.toLowerCase() + 'Texture'
        this.moonMesh.material.map = this.resources.items[textureMap]
        this.moonMesh.name = this.data.name
        this.moonMesh.objectType = 'Moon'
        this.moonMesh.area = this.data.area || ''
        this.moonMesh.scale.set(0.08,0.08,0.08);
        this.moonGroup.add(this.moonMesh)

        
        // console.log('position:', window.experience.camera.position)
        console.log('Start----------------------')
        
        //Create lights ?
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        window.experience.scene.add(this.ambientLight);

        this.directionalLight = new THREE.DirectionalLight( 0xffffff, 1.6 );
        this.directionalLight.position.set( -1, 1.0, 1 );
        window.experience.scene.add(this.directionalLight);
        window.experience.light = this.directionalLight;

        
        window.renderQueue = new RenderQueue();

        // Load example hacked restaurant 
        var blockLoader = new BlockLoader();
        var block = blockLoader.loadDefaultBlock1();
        var restaurant = block.restaurants[0];
        var menu = restaurant.menus[0];
        var item = menu.items[0]; 
        // one dish
        //console.log('item', item) 
        // TODO: udpate item to data
        /////////////////////////////////////

        // Create planet with all features (in sub-classes)
        this.foodplanet = new FoodPlanet(item);
        this.foodplanet.view.position.x += 500;
        this.moonGroup.add(this.foodplanet.view)

        window.experience.scene.add(this.foodplanet.view)
        console.log('Finish!----------------------')

        this.jurisdictionGroup.add(this.moonGroup)
        this.raycaster.objectToTest.push(this.moonMesh)
    }

    setOrbit() {
        this.orbit = new Orbit(this.moonGroup, 1, this.data.Xposition, this.data.Zposition, this.data.color, this.data.focusColor)
    }

    resize() {
    }

    update() {
        window.renderQueue.update();
        this.foodplanet.update() 
    }

    destroy() {
    }
}