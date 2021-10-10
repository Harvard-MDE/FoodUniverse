import * as THREE from 'three';
import vertShader from '../shaders/texture.vert';
import fragShader from '../shaders/flowNoiseMap.frag';
import Map from './Map.js';

/**
 * This here is the height drawn on the planet
 */
class NoiseMap extends Map {

  constructor() {
    super();
    this.setup();
    super.setup();
  }

  setup() {
    this.mats = [];

    for (let i = 0; i < 6; i++) {
      this.mats[i] = new THREE.ShaderMaterial({
        uniforms: {
          index: {type: "i", value: i},
          seed: {type: "f", value: 0},
          resolution: {type: "f", value: 0},
          res1: {type: "f", value: 0},
          res2: {type: "f", value: 0},
          resMix: {type: "f", value: 0},
          mixScale: {type: "f", value: 0},
          doesRidged: {type: "f", value: 0}
        },
        vertexShader: vertShader,
        fragmentShader: fragShader,
        transparent: true,
        depthWrite: false
      });
    }
  }

  render(props) {

    let resolution = props.resolution;

    for (let i = 0; i < 6; i++) {
      this.mats[i].uniforms.seed.value = props.seed;
      this.mats[i].uniforms.resolution.value = props.resolution;
      this.mats[i].uniforms.res1.value = 3.0; //props.res1; //Defines frequency. If 0, just water. If 0.01, just spots (go up and down 0). If 1, small islands. 3, like earth
      this.mats[i].uniforms.res2.value = 3.0; //props.res2; //Defines frequency. If 0, just water. If 0.01, just spots (go up and down 0). If 5, water + red. (might be same as resmix)
      this.mats[i].uniforms.resMix.value = 3.0; //props.resMix; //Defines frequency. If 0, just water. If 0.01, just spots (go up and down 0). If 5, water + red
      this.mats[i].uniforms.mixScale.value = 1.0; //props.mixScale; //Disabled for base ridged value, otherwise controls height magnification
      this.mats[i].uniforms.doesRidged.value = 3.0; //props.doesRidged; //Controls kind of algorithm. 0 = CloudNoise = boring, 1 = RidgedNoise = boring, 2 = ok, 3 = BaseNoise, best results from all faces
      this.mats[i].needsUpdate = true;
    }

    super.render(props);
  }

}

export default NoiseMap;
