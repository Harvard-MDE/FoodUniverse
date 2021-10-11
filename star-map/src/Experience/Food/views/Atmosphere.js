import * as THREE from 'three';
import shaderVert from '../shaders/planet.vert';
import shaderFrag from '../shaders/atmos.frag';

class Atmosphere {

  constructor(menuItem) {

    this.view = new THREE.Object3D();
    this.menuItem = menuItem;

    this.size = 130;
    this.time = 0.0;

    this.atmosphereTreshhold1 = 10/1000;
    this.atmosphereTreshhold2 = 15/1000;
    this.atmosphereTreshhold3 = 30/1000;
    this.atmosphereTreshhold4 = 50/1000;

    this.drawAtmosphere();

    this.mat = new THREE.ShaderMaterial({
      vertexShader: shaderVert,
      fragmentShader: shaderFrag,
      uniforms: {
        "time" : {type: "f", value: this.time},
        "atmo1" : {type: "f", value: this.atmo1},
        "atmo2" : {type: "f", value: this.atmo2},
        "atmo3" : {type: "f", value: this.atmo3},
        "atmo4" : {type: "f", value: this.atmo4},
        "atmo5" : {type: "f", value: this.atmo5},
        "alpha" : {type: "f", value: this.atmosphere},
        "color" : {type: "c", value: this.color}
      }
    });

    this.mat.transparent = true;
    this.mat.blending = THREE.AdditiveBlending;
    //this.mat.side = THREE.DoubleSide;

    this.geo = new THREE.IcosahedronBufferGeometry(1, 6);
    this.sphere = new THREE.Mesh(this.geo, this.mat);
    this.sphere.scale.set(this.size, this.size, this.size);
    this.view.add(this.sphere);
  }

  update() {
    this.time += this.speed;
    this.mat.uniforms.time.value = this.time;
    this.mat.uniforms.atmo1.value = this.atmo1;
    this.mat.uniforms.atmo2.value = this.atmo2;
    this.mat.uniforms.atmo3.value = this.atmo3;
    this.mat.uniforms.atmo4.value = this.atmo4;
    this.mat.uniforms.atmo5.value = this.atmo5;
    this.mat.uniforms.alpha.value = this.atmosphere;
    this.mat.uniforms.color.value = this.color;
  }

  drawAtmosphere() {

    var co2PerGram = this.menuItem.getTotalCo2PerGram();

    if(co2PerGram <= this.atmosphereTreshhold1) {
      this.size = 130;
    }

    else {
      this.size = Math.min(130+((co2PerGram/this.atmosphereTreshhold4)*70), 110);
    }

    this.atmosphere = Math.min(co2PerGram/this.atmosphereTreshhold3, 0.8);
    this.atmo1 = 1.25;
    this.atmo2 = 0.5;
    this.atmo3 = 1.0;
    this.atmo4 = 0.5;
    this.atmo5 = 0.1;

    this.color = this.drawAtmosphereColor();

  }

  drawAtmosphereColor() {

    //Start with white, shift to yellow and red the worse it gets
    var color = new THREE.Color(0xffffff);
    var co2PerGram = this.menuItem.getTotalCo2PerGram();

    if(co2PerGram > this.atmosphereTreshhold4) {

      color.g -= Math.min((co2PerGram/this.atmosphereTreshhold4)*255, 100);
      color.b -= Math.min((co2PerGram/this.atmosphereTreshhold4)*255, 255);

    }

    else if(co2PerGram > this.atmosphereTreshhold2) {

      color.b -= Math.min((co2PerGram/this.atmosphereTreshhold4)*255, 255);

    }

    else if(co2PerGram <= this.atmosphereTreshhold1) {

      color.b = 255;
      color.r = Math.max((co2PerGram/this.atmosphereTreshhold4)*255, 200);
      color.g = Math.max((co2PerGram/this.atmosphereTreshhold4)*255, 200);

    }

    return color;

  }

  randomize() {
    this.randomizeColor();

  }

  randomizeColor() {
    this.color = new THREE.Color();

    this.color.r = this.randRange(0.5, 1.0);
    this.color.g = this.randRange(0.5, 1.0);
    this.color.b = this.randRange(0.5, 1.0);

    this.mat.uniforms.color.value = this.color;
  }

  randRange(low, high) {
    let range = high - low;
    let n = window.rng() * range;
    return low + n;
  }
}

export default Atmosphere;
