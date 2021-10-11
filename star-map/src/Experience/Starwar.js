import * as THREE from 'three'

export default class Starwar {
    // constructor(systemGroup, data, _options) {
    //     this.experience = window.experience
    //     this.config = this.experience.config
    //     this.resources = this.experience.resources
    //     this.scene = this.experience.scene
    //     this.debug = this.experience.debug
    //     this.infoElements = this.experience.infoElements
    //     this.system = systemGroup
    //     this.data = data
    //     this.setGalexy()
    // }


    go() {
		
		var title = document.getElementById('title');
		title.style.opacity = 1;
		var content = document.getElementById('text')
	  
		setTimeout(function(){
			fadeOutTitle();
			animateContent();
		}, 1000)

		var fadeOutTitle = function(){
		  setTimeout(function(){
			setInterval(function(){
			  if(title.style.opacity >= 0.1){
				title.style.opacity -= 0.1
			  } else {
				title.style.opacity = 0;
			  }
			}, 10)
		  }, 3000)
		}
	  
		var animateContent = function(){
		  setTimeout(function(){
			content.className += 'animated'
		  }, 3000)
		}
    }

    resize() {
    }

    update() {
    }

    destroy() {
    }
}