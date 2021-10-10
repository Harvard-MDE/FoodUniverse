import * as THREE from 'three';
import CloudMap from './CloudMap.js';

class Clouds {

  constructor(menuItem) {
    this.view = new THREE.Object3D();
    this.menuItem = menuItem;

    this.cloudThreshhold1 = 10/1000;
    this.cloudThreshhold2 = 15/1000;
    this.cloudThreshhold3 = 50/1000;

    this.materials = [];
    this.cloudMaps = [];
    this.roughness = 0.9;
    this.metalness = 0.5;
    this.normalScale = 5.0;

    this.resolution = 1024;
    this.size = 1001;

    this.drawClouds();

    this.setup();

  }

  update() {
    //
  }

  drawClouds() {

    var co2PerGram = this.menuItem.getTotalCo2PerGram();

    this.clouds = Math.min((co2PerGram/this.cloudThreshhold2), 1);
    this.color = this.drawCloudColor();

  }

  drawCloudColor() {

    //Start with white, go to black
    var color = new THREE.Color(0xffffff);
    var co2PerGram = this.menuItem.getTotalCo2PerGram();

    if(co2PerGram > this.cloudThreshhold2) {

      color.r -= Math.min((co2PerGram/this.cloudThreshhold3)*255, 255);
      color.g -= Math.min((co2PerGram/this.cloudThreshhold3)*255, 255);
      color.b -= Math.min((co2PerGram/this.cloudThreshhold3)*255, 255);

    }

    return color;

  }

  setup() {

    this.cloudMap = new CloudMap();
    this.cloudMaps = this.cloudMap.maps;

    for (let i=0; i<6; i++) {
      let material = new THREE.MeshStandardMaterial({
        color: this.color,
        transparent: true,
      });
      this.materials[i] = material;
    }

    let geo = new THREE.BoxGeometry(1, 1, 1, 64, 64, 64);
    let radius = this.size;
    for (var i in geo.vertices) {
  		var vertex = geo.vertices[i];
  		vertex.normalize().multiplyScalar(radius);
  	}
    this.computeGeometry(geo);
    this.sphere = new THREE.Mesh(geo, this.materials);
    this.view.add(this.sphere);
  }

  render(props) {
    this.seed = this.randRange(0, 1000);
    let cloudSize = this.randRange(0.5, 1.0);

    let mixScale = this.map_range(props.waterLevel*props.waterLevel, 0, 0.8, 0.0, 3.0);


    this.cloudMap.render({
      seed: this.seed,
      resolution: this.resolution,
      res1: this.randRange(0.1, 1.0),
      res2: this.randRange(0.1, 1.0),
      resMix: this.randRange(0.1, 1.0),
      mixScale: this.randRange(0.1, 1.0)
    });

    this.updateMaterial();
  }

  map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }

  updateMaterial() {
    for (let i=0; i<6; i++) {
      let material = this.materials[i];
      material.roughness = this.roughness;
      material.metalness = this.metalness;
      material.opacity = this.clouds;
      material.map = this.cloudMaps[i],
      // material.alphaMap = this.cloudMaps[i],
      // material.bumpMap = this.cloudMaps[i],
      // material.bumpScale = 1.0,
      material.color = this.color
    }
  }

  randomizeColor() {

    this.color.r = this.randRange(0.7, 1.0);
    this.color.g = this.randRange(0.7, 1.0);
    this.color.b = this.randRange(0.7, 1.0);

    this.updateMaterial();
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
  	geometry.computeMorphNormals();
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

}

export default Clouds;
