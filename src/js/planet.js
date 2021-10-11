import * as THREE from 'three'

export default class Planet {
    constructor(jurisdiction, data, _options) {
        // this.experience = window.experience
        // this.config = this.experience.config
        // this.scene = this.experience.scene
        // this.resources = this.experience.resources
        // this.debug = this.experience.debug
        // this.raycaster = this.experience.raycaster
        this.jurisdiction = jurisdiction
        this.data = data
        // this.time = new Time()
        this.setPlanet()
    }

    setPlanet() {
        this.astreMesh = new THREE.Mesh(
            new THREE.SphereGeometry(1, 64, 64, 1),
            new THREE.MeshPhongMaterial() //.MeshStandardMaterial({ opacity: 1, transparent: true})
        );

        if(this.data){
            const textureMap = this.data.astre.astreName.toLowerCase() + 'Texture'
            this.astreMesh.material.map = this.resources.items[textureMap]
        }else{
            // instantiate a loader & load a resource
            new THREE.TextureLoader().load(
                // resource URL
                'https://www.theallineed.com/wp-content/uploads/2015/09/ocean_ice_1170.jpg',

                // onLoad callback
                ( texture )=> {
                    // in this example we create the material when the texture is loaded
                    var material = new THREE.MeshBasicMaterial( {
                        map: texture
                    } )
                    this.astreMesh.material.map = material
                },

                // onProgress callback currently not supported
                undefined,

                // onError callback
                ( err )=> {
                    console.error( 'An error happened during loading texture.' )
                }
            )

      }
        

        this.astreMesh.name = this.data ? this.data.astre.astreName : 'Test Name'
        this.astreMesh.objectType = 'Planet'
        this.astreMesh.area = this.data ? this.data.area : "Test area"
        this.astreMesh.scale.set(10,10,10);
        
        this.jurisdiction.add(this.astreMesh)

        // this.raycaster.objectToTest.push(this.astreMesh)

        //return this.astreMesh
    }

    resize() {
    }

    update() {
    }

    destroy() {
    }
}