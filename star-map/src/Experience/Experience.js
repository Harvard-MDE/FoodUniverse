import * as THREE from 'three'
import Time from './Utils/Time.js'
import Sizes from './Utils/Sizes.js'
import Stats from './Utils/Stats.js'
import Debug from './Utils/Debug.js'

import Resources from './Resources.js'
import Renderer from './Renderer.js'
import Camera from './Camera.js'
import Lights from './Lights.js'
import World from './World.js'
import Lightspeed from './Lightspeed.js'
import Starwar from './Starwar.js'
import Raycaster from './Raycaster'

import assets from './assets.js'
import gsap from "gsap";



export default class Experience {
    constructor(_options = {}) {
        window.experience = this

        this.targetElement = _options.targetElement

        if(!this.targetElement) {
            console.warn('Missing \'targetElement\' property')
            return
        }

        this.time = new Time()
        this.sizes = new Sizes()
        this.objectSelected = null
        this.setConfig()
        this.setStats()
        this.setDebug()
        this.setScene()
        this.setCamera()
        this.setLights()
        this.setRenderer()
        this.setResources()
        this.setWorld()
        this.setLightspeed()
        this.setStarwar()
        this.setInfo()
        this.setScreenLoader()
        this.setRaycaster()

        this.sizes.on('resize', () => {
            this.resize()
        })

        this.update()
    }

    setConfig() {
        this.config = {}

        // Debug
        this.config.debug = window.location.hash === '#debug'

        // Pixel ratio
        this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)

        // Width and height
        const boundings = this.targetElement.getBoundingClientRect()
        this.config.width = boundings.width
        this.config.height = boundings.height || window.innerHeight
    }

    setStats() {
        if(this.config.debug) {
            this.stats = new Stats(true)
        }
    }

    setDebug() {
        if(this.config.debug) {
            this.debug = new Debug(true)
        }
    }

    setScene() {
        this.scene = new THREE.Scene()
        this.sceneSun = new THREE.Scene();
    }

    setCamera() {
        this.camera = new Camera()
    }

    setLights() {
        this.lights = new Lights()
    }

    setRenderer() {
        this.renderer = new Renderer({ rendererInstance: this.rendererInstance })

        this.targetElement.appendChild(this.renderer.instance.domElement)

    }

    setResources() {
        this.resources = new Resources(assets)
    }

    setWorld() {
        this.world = new World()
    }

    setLightspeed() {
        this.lightspeed = new Lightspeed()
    }

    setStarwar() {
        this.starwar = new Starwar()
    }

    setInfo() {
        this.containerInfo = document.createElement('div')
        this.containerInfo.setAttribute('id', 'containerInfo')
        document.body.appendChild(this.containerInfo);

        this.elements = [{name: 'type', type: 'p'},{name: 'systemName', type: 'p'},{name: 'coords', type: 'p'},{name: 'area', type: 'p'}]
        this.infoElements = []
        for(const element of this.elements){
            this.newelement = document.createElement(element.type)
            this.newelement.setAttribute('id', element.name)
            this.newelement.setAttribute('class', element.name)
            this.containerInfo.appendChild(this.newelement);
            this.infoElements.push(this.newelement)
        }
    }

    setScreenLoader() {
        this.screenLoader = document.querySelector('.screenLoader')
        this.starfield = document.querySelector('#starfield')
        this.starwars = document.querySelector('.starwars')
        this.fTab = document.querySelector('.fTab') // footer explore
        this.xTab = document.querySelector('.xTab') // close footer
        this.dTab = document.querySelector('.dTab') // 2D toggle
        this.oTab = document.querySelector('.oTab') // 3D side by side toggle
        this.footer = document.querySelector('#foot')
        this.enterButton = document.querySelector('#enterButton')
        this.container = document.querySelector('.container')
        this.audioNape = new Audio('../sounds/nape_space.mp3');
        this.starwarsSound = new Audio('../sounds/starwars.mp3');
        this.lightspeedSound = new Audio('../sounds/lightspeed.mp3');
        this.ressourcesLoader = false

        // When ressources loaded display "Entrer" button
        this.resources.on('end', () => {
            this.ressourcesLoader = true
            this.enterButton.style.display = 'block'

            // TODO: Load the unverse in background - Lightspeed instead 
            this.starwarsSound.play()
            this.starwarsSound.volume = 0.1
            this.lightspeed.go(0)
            this.starwar.go()
        })

        // Footer open
        this.fTab.addEventListener('click', ()=> {
            this.footer.style['max-height'] = '150px'
        })

        // Footer close
        this.xTab.addEventListener('click', ()=> {
            this.footer.style['max-height'] = '0px'
        })

        // 2D toggle
        this.dTab.addEventListener('click', ()=> {
            if(this.dTab.innerHTML=='2D'){
                gsap.to(this.camera.modes.debug.instance.position, {
                    duration: 1,
                    delay: 0.6,
                    // x: 0,
                    // y: 150,
                    z: 0,
                })
                this.dTab.innerHTML='3D'
            }else{
                gsap.to(this.camera.modes.debug.instance.position, {
                    duration: 1,
                    delay: 0.6,
                    // x: 0, 
                    // y: 150,
                    z: 750,
                })
                // TODO: Fix toggle 2D 
                this.dTab.innerHTML='2D'
                this.dTab.style.display = 'none'
            }
        })

        // 3D side by side toggle
        this.oTab.addEventListener('click', ()=> {
            this.footer.style['max-height'] = '0px'
        })

        // Entrer Button Click
        this.enterButton.addEventListener('click', ()=> {

            this.footer.style['max-height'] = '0px'

            this.starwarsSound.pause()
            this.audioNape.pause()

            this.lightspeedSound.play()
            this.lightspeedSound.volume = 0.1

            this.lightspeed.go()
            this.unfade(this.starfield)

            // this.container.style.opacity = 0
            // this.screenLoader.style.opacity = 0
            this.containerInfo.style.opacity = 1


            // remove star war text
            setTimeout(()=>{
                this.starwars.style.display = 'none'
            }, 500);

            // light speed!
            setTimeout(()=>{
                this.lightspeed.go(4)
            }, 1000);
            setTimeout(()=>{
                this.lightspeed.go(8)
            }, 2000);
            setTimeout(()=>{
                this.lightspeed.go(16)
            }, 2500);
            setTimeout(()=>{
                this.lightspeed.go(32)
            }, 3000);
            setTimeout(()=>{
                this.lightspeed.go(64)
            }, 3500);
            setTimeout(()=>{
                this.lightspeed.go(128)
            }, 4000);
            // setTimeout(()=>{
            //     this.lightspeed.go(256)
            // }, 4500);
            setTimeout(()=>{
                this.lightspeed.go(512)
            }, 5000);

            // remove light speed layer
            setTimeout(()=>{
                this.fade(this.starfield)
                // start sound
                this.audioNape.play()
                this.audioNape.volume = 0.1

                // Move camera on start
                gsap.to(this.camera.modes.debug.instance.position, {
                    duration: 1,
                    delay: 0.6,
                    x: 0,
                    y: 550,
                    z: 750,
                })
                this.dTab.style.display = 'block'
                this.oTab.style.display = 'block'

            }, 6500);
           
        })
    }

    setRaycaster() {
        this.raycaster = new Raycaster()
    }

    update() {
        if(this.stats)
            this.stats.update()

        this.camera.update()

        if(this.world)
            this.world.update()

        if(this.lightspeed)
            this.lightspeed.update()

        if(this.starwar)
            this.starwar.update()

        if(this.renderer)
            this.renderer.update()

        
        window.requestAnimationFrame(() =>
        {
            this.update()
        })
    }

    resize() {
        // Config
        const boundings = this.targetElement.getBoundingClientRect()
        this.config.width = boundings.width
        this.config.height = boundings.height

        this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)

        if(this.camera)
            this.camera.resize()

        if(this.renderer)
            this.renderer.resize()

        if(this.world)
            this.world.resize()

        if(this.lightspeed)
            this.lightspeed.resize()

        if(this.starwar)
            this.starwar.resize()

        if(this.navigation)
            this.navigation.resize()
    }

    destroy() {

    }

    fade(element) {
        var op = 1;  // initial opacity
        var timer = setInterval(function () {
            if (op <= 0.1){
                clearInterval(timer);
                element.style.display = 'none';
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op -= op * 0.1;
        }, 50);
    }

    unfade(element) {
        var op = 0.1;  // initial opacity
        element.style.display = 'block';
        var timer = setInterval(function () {
            if (op >= 1){
                clearInterval(timer);
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op += op * 0.1;
        }, 10);
    }
}
