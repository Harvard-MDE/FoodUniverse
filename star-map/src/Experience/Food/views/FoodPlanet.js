import * as THREE from 'three';
import Biome from './Biome.js';
import Atmosphere from './Atmosphere.js';
import AtmosphereRing from './AtmosphereRing.js';
import NoiseMap from './NoiseMap.js'
import TextureMap from './TextureMap.js'
import NormalMap from './NormalMap.js'
import RoughnessMap from './RoughnessMap.js'
import Clouds from './Clouds.js'
import seedrandom from 'seedrandom'
import randomLorem from 'random-lorem'

class FoodPlanet {

  /**
   * This class represents the planet mesh (= geo + 6 materials) to show. The coloring happens in biomes, atmosphere, in all sub-classes. This just brings it together.
   * In general, this constructor just creates the meshes (= geo + material + ) (of the planet, clouds, atmosphere, ...)
   * Does not do any random stuff yet, just initialization of the objects without colors etc
   */
  constructor(menuItem) {

    this.menuItem = menuItem;

    /**
     * Seed
     */
    this.seedString = "Scarlett";
    this.initSeed();

    this.view = new THREE.Object3D(); //Overall planet object with all layers (planet + atmosphere + clouds + ...)

    /**
     * Global planet parameters
     */
    this.size = 100; //Global size of the planet, radius of surface / ground sphere
    this.roughness = 0.8; //Global roughness -> can set specifically
    this.metalness = 0.5; //Global metalness -> can set specifically
    this.resolution = 512; //Global resolution of planetary details -> can set specifically
    this.normalScale = 2.0; //Global normal scale, later gets adapted depending on resolution -> can set height specifically, instead of resolution
    this.waterLevel = 0.0; //Global water level, later gets randomized -> can set specifically

    /**
     * Create materials
     */
     this.materials = []; //Array of 6 materials, initialized with 6 white standard materials -> later each gets applied it's specific height map, normal map, ...?
     this.heightMaps = [];
     this.moistureMaps = [];
     this.textureMaps = [];
     this.normalMaps = [];
     this.roughnessMaps = [];
     this.displayMap = "textureMap";

      /**
       * Biome created, later renders the texture of the biome by calling .texture 
       */
    this.biome = new Biome(this.menuItem); //THIS IS WHAT WE HAVE TO CONTROL -> later, biome.texture is applied and assigned to biome.generateTexture()

    /**
     * Creation of all the meshes (planet, stars, nebula, sun, clouds, atmosphere ring, atmosphere)
     */
    this.createScene(); //Creates planet ground mesh (cube-into-sphere squeeze + 6 materials) + 5 separate maps (texture map, height map, ...)
    this.createClouds(); //Creates cloud background (separate class)
    this.createAtmosphereRing(); //Creates atmosphere ring (separate class)
    this.createAtmosphere(); //Creates atmosphere fog (separate class)

    /**
     * Generating 1 planet specifically from URL seed (can remove later)
     */
    this.loadSeedFromURL();

    /**
     * Global planet parameters 2
     */
    this.rotate = true;
    this.autoGenerate = false;
    this.autoGenCountCurrent = 0;
    this.autoGenTime = 3*60;
    this.autoGenCountMax = this.autoGenTime * 60;

    /**
     * Generate new planet on 'space' hit (can remove later)
     */
    document.addEventListener('keydown', (event) => {
      if (event.keyCode == 32) {
        this.randomize();
      }
    });

    /**
     * Generating 2 planet specifically from URL seed (can remove later)
     */
    window.onpopstate = (event) => {
      this.loadSeedFromURL();
    };

  }

  /**
   * KEY METHOD
   * Gets called every frame by animate function, rotates ground stars etc and updates random generation of elements
   */
  update() {
    console.log('renderQueue:update!')
    if (this.rotate) {
      this.ground.rotation.y += 0.0005;
      this.clouds.view.rotation.y += 0.001; //(this.menuItem.getTotalCo2PerGram()/60)*0.005;
    }

    this.atmosphere.update();
    this.clouds.update();
    this.atmosphereRing.update();

  }

  /**
   * (ignore, can remove later)
   */
  initSeed() {
    window.rng = seedrandom(this.seedString);
  }

  /**
   * (ignore, can remove later)
   */
  loadSeedFromURL() {
    this.seedString = this.getParameterByName("seed");
    if (this.seedString) {
      console.log("Seed provided");
      this.regenerate();
    } else {
      console.log("No seed provided");
      this.randomize();
    }

  }

  /**
   * (ignore, can remove later)
   */
  loadSeedFromTextfield() {
    let url = this.updateQueryString("seed", this.seedString);
    window.history.pushState({seed: this.seedString}, this.seedString, url);
    this.regenerate();
  }

  /**
   * (ignore, can remove later)
   */
  regenerate() {
    this.autoGenCountCurrent = 0;
    this.renderScene();
  }

  /**
   * 
   * Called once for the planet, randomizes the seed string again and then renders the scene
   */
  randomize() {
    // this.seedString = randomString(10);

    let n = Math.random();
    let wordCount = 0;
    if (n > 0.8) wordCount = 1;
    else if (n > 0.4) wordCount = 2;
    else wordCount = 3;

    this.seedString = "";
    for (let i=0; i<wordCount; i++) {
      this.seedString += this.capitalizeFirstLetter(randomLorem({ min: 2, max: 8 }));
      if (i < wordCount-1) this.seedString += " ";
    }

    // this.seedString = randomLorem({ min: 2, max: 8 });
    // this.seedString += " " + randomLorem({ min: 2, max: 8 });
    let url = this.updateQueryString("seed", this.seedString);
    window.history.pushState({seed: this.seedString}, this.seedString, url);
    this.autoGenCountCurrent = 0;
    this.renderScene();
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  /**
   * KEY METHOD
   * Generates the mesh (box into sphere + 6 materials) and maps
   * No random generation so far, just creating empty objects
   */
  createScene() {

    this.heightMap = new NoiseMap();
    this.heightMaps = this.heightMap.maps;

    this.moistureMap = new NoiseMap();
    this.moistureMaps = this.moistureMap.maps;

    this.textureMap = new TextureMap();
    this.textureMaps = this.textureMap.maps;

    this.normalMap = new NormalMap();
    this.normalMaps = this.normalMap.maps;

    this.roughnessMap = new RoughnessMap();
    this.roughnessMaps = this.roughnessMap.maps;

    for (let i=0; i<6; i++) { //Create 6 materials, each with white color
      let material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xFFFFFF)
      });
      this.materials[i] = material;
    }

    let geo = new THREE.BoxGeometry(1, 1, 1, 64, 64, 64); //Creating a box
    let radius = this.size;
    for (var i in geo.vertices) {
  		var vertex = geo.vertices[i];
  		vertex.normalize().multiplyScalar(radius);
  	}
    this.computeGeometry(geo); //Squeezing a box into a sphere

    this.ground = new THREE.Mesh(geo, this.materials); //Create ground mesh with squeezed box sphere and 6 materials
    this.view.add(this.ground);
  }


  /**
   * KEY METHOD
   * Is called once, to generate all the random features on the planet
   * Generates the biome texture + random height map, moisture map, ... with the current random seed
   * --> Here, we can manipulate all variables we want to manipulate! Before, we just created empty objects, here we can manipulate them!
   * ----> Then goes into renderBiomeTexture()
   */
  renderScene() {

    this.initSeed();

    this.seed = this.randRange(0, 1) * 1000.0; //Sets the seed -> manual control
    this.waterLevel = 1-(this.menuItem.getTotalH2oPerGram() / 5);//0.7;//this.randRange(0.1, 0.5); //Sets water level random -> manual control

    //this.updateNormalScaleForRes(this.resolution); //Updates normal for scale -> manual control
    this.renderBiomeTexture(); //Updates biome texture (updates biome.texture) -> manual control in that method

    this.clouds.resolution = this.resolution;

    window.renderQueue.start();

    let resMin = 0.01;
    let resMax = 5.0;

    this.heightMap.render({ //HEIGHT MAP DETERMINES WHAT IS DRAWN TO WHAT BIOME!!!
      seed: this.seed,
      resolution: this.resolution,
      res1: this.randRange(resMin, resMax),
      res2: this.randRange(resMin, resMax),
      resMix: this.randRange(resMin, resMax),
      mixScale: this.randRange(0.5, 1.0),
      doesRidged: Math.floor(this.randRange(0, 4))
    });

    let resMod = this.randRange(3, 10);
    resMax *= resMod;
    resMin *= resMod;

    this.moistureMap.render({
      seed: this.seed + 392.253,
      resolution: this.resolution,
      res1: this.randRange(resMin, resMax),
      res2: this.randRange(resMin, resMax),
      resMix: this.randRange(resMin, resMax),
      mixScale: this.randRange(0.5, 1.0),
      doesRidged: Math.floor(this.randRange(0, 4))
    });

    this.textureMap.render({
      resolution: this.resolution,
      heightMaps: this.heightMaps,
      moistureMaps: this.moistureMaps,
      biomeMap: this.biome.texture //BIOME TEXTURE IS PASSED HERE TO TEXTURE MAP!!!
    });

    this.normalMap.render({
      resolution: this.resolution,
      waterLevel: this.waterLevel,
      heightMaps: this.heightMaps,
      textureMaps: this.textureMaps
    });

    this.roughnessMap.render({
      resolution: this.resolution,
      heightMaps: this.heightMaps,
      waterLevel: this.waterLevel
    });

    this.clouds.render({
       waterLevel: this.waterLevel
     });

    window.renderQueue.addCallback(() => {
      this.updateMaterial();
    });
  }

  /**
   * Updates 6 materials, assigns each the right map. Then, all maps are put onto the object together (so the height map, normal map, moisture map, ...)
   */
  updateMaterial() {
    console.log('renderQueue:updateMaterial!')
    for (let i=0; i<6; i++) {
      let material = this.materials[i];
      material.roughness = this.roughness;
      material.metalness = this.metalness;

      if (this.displayMap == "textureMap") {
        material.map = this.textureMaps[i];
        material.normalMap = this.normalMaps[i];
        material.normalScale = new THREE.Vector2(this.normalScale, this.normalScale);
        material.roughnessMap = this.roughnessMaps[i];
      }
      else if (this.displayMap == "heightMap") {
        material.map = this.heightMaps[i];
        material.normalMap = null;
        material.roughnessMap = null;
      }
      else if (this.displayMap == "moistureMap") {
        material.map = this.moistureMaps[i];
        material.normalMap = null;
        material.roughnessMap = null;
      }
      else if (this.displayMap == "normalMap") {
        material.map = this.normalMaps[i];
        material.normalMap = null;
        material.roughnessMap = null;
      }
      else if (this.displayMap == "roughnessMap") {
        material.map = this.roughnessMaps[i];
        material.normalMap = null;
        material.roughnessMap = null;
      }

      material.needsUpdate = true;
    }
  }

  renderBiomeTexture() {
    this.biome.generateTexture({waterLevel: this.waterLevel});
  }

  createAtmosphere() {
    this.atmosphere = new Atmosphere(this.menuItem);
    this.view.add(this.atmosphere.view);
  }

  createAtmosphereRing() {
    this.atmosphereRing = new AtmosphereRing(this.menuItem);
    this.view.add(this.atmosphereRing.view);
  }

  createClouds() {
    this.clouds = new Clouds(this.menuItem);
    this.view.add(this.clouds.view);
  }

  updateNormalScaleForRes(value) {
    if (value == 256) this.normalScale = 0.25;
    if (value == 512) this.normalScale = 0.5;
    if (value == 1024) this.normalScale = 1.0;
    if (value == 2048) this.normalScale = 1.5;
    if (value == 4096) this.normalScale = 3.0;
  }

  randRange(low, high) {
    let range = high - low;
    let n = window.rng() * range;
    return low + n;
  }

  computeGeometry(geometry) {
  	// geometry.makeGroups();
  	geometry.computeVertexNormals()
  	geometry.computeFaceNormals();
  	// geometry.computeMorphNormals();
  	geometry.computeBoundingSphere();
  	geometry.computeBoundingBox();
  	// geometry.computeLineDistances();

  	geometry.verticesNeedUpdate = true;
  	geometry.elementsNeedUpdate = true;
  	geometry.uvsNeedUpdate = true;
  	geometry.normalsNeedUpdate = true;
  	// geometry.tangentsNeedUpdate = true;
  	geometry.colorsNeedUpdate = true;
  	geometry.lineDistancesNeedUpdate = true;
  	// geometry.buffersNeedUpdate = true;
  	geometry.groupsNeedUpdate = true;
  }

  updateQueryString(key, value, url) {
    if (!url) url = window.location.href;
    var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
        hash;

    if (re.test(url)) {
        if (typeof value !== 'undefined' && value !== null)
            return url.replace(re, '$1' + key + "=" + value + '$2$3');
        else {
            hash = url.split('#');
            url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
            if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                url += '#' + hash[1];
            return url;
        }
    }
    else {
        if (typeof value !== 'undefined' && value !== null) {
            var separator = url.indexOf('?') !== -1 ? '&' : '?';
            hash = url.split('#');
            url = hash[0] + separator + key + '=' + value;
            if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                url += '#' + hash[1];
            return url;
        }
        else
            return url;
    }
  }

  getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

}

export default FoodPlanet;