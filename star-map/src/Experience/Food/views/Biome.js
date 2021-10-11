import * as THREE from 'three';

class Biome {

  /**
   * This class creates the 2D image that will define what the planet will look like -> we will just draw all nutrition gradients on top here
   * Just creates a white plain 2D image, nothing interesting here, it gets drawn in generateTexture()
   */
  constructor(menuItem) {

    this.menuItem = menuItem;

    //Create plain 2D canvas
    this.canvas = document.createElement("canvas");
    this.canvas.id = "biomeCanvas";
    this.canvas.width = 512; //2D texture width
    this.canvas.height = 512; //2D texture height
    this.canvas.style.width = "200px";
    this.canvas.style.height = "200px";
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.ctx = this.canvas.getContext("2d");

    document.body.appendChild(this.canvas);
    this.toggleCanvasDisplay(false);

  }

  /**
   * KEY METHOD
   * This method generates a new 2D texture to generate the texture map that is one of the materials of the planet mesh!
   * So here, the 2D image gets drawn that is just drawn onto the planet. We have to take full control of this!
   * (props is an object (properties), and it has passed the water level)
   */
  generateTexture(props) {

    this.waterLevel = props.waterLevel; //Sets the water level accordingly

    //Detail parameters, for creation of random colors
    this.baseColor = new THREE.Color('white'); //Base color = white -> manual, set to main ingredient (to highlight in structural details) //Have to change this!
    this.colorAngle = 0;//this.randRange(0.01, 0.05) //Random starting value for color angle offset
    this.satRange = this.randRange(0.01, 0.1); //Random starting value for color saturation offset
    this.lightRange = this.randRange(0.01, 0.1); //Random starting value for color light offset

    this.drawGround(); //Draws the base, based on the food
    this.drawDetail(); //Draws random detail features
    this.drawInland(); //Draws random inland features
    this.drawBeach(); //Draws random beaches
    if(this.waterLevel > 0.5) this.drawRivers(); //Draws rivers
    if(this.waterLevel > 0) this.drawWater(); //Draws water level / oceans

    //Load canvas to texture
    this.texture = new THREE.CanvasTexture(this.canvas);

  }

  toggleCanvasDisplay(value) {
    if (value) {
      this.canvas.style.display = "block";
    } else {
      this.canvas.style.display = "none";
    }
  }

  /**
   * KEY METHOD
   * Draws the planet ground, based on the meal given
   */
  drawGround() {

    //Parameters for the gradients drawn
    let falloff = 1.2;
    let falloff2 = 1.0;
    let falloff3 = 0.8;
    let opacity = 1.0;

    //Get ingredients for food
    let ingredients = this.menuItem.ingredients;

    //Sum up weights to get total weight = 100%
    let totalWeight = this.menuItem.getTotalWeight();

    //Sort from highest to lowest weight
    ingredients.sort(function(a, b) {
      var valA = a.weight;
      var valB = b.weight;
      return (valA < valB) ? -1 : (valA > valB) ? 1 : 0;
    });

    //Set base color to dominant ingredient
    this.baseColor = ingredients[0].category.color;

    //Fill array with x-values with appropriate proportion
    let xes = [];
    xes[0] = 0;
    let currentWeightPixels = 0;
    for(var i = 0; i < ingredients.length; i++) {
      var weightPixels = (ingredients[i].weight/totalWeight)*this.width;
      xes[i+1] = currentWeightPixels+weightPixels;
      currentWeightPixels += weightPixels;
    }

    //Fill array with y-values with y=0
    let yes = [];
    yes[0] = 0;
    for(var i = 0; i < ingredients.length; i++) {
      yes[i+1] = 0;
    }

    //Fill array with colors for each gradient and randomize
    let colors = [];
    for(var i = 0; i < ingredients.length; i++) {
      colors[i] = this.randomColor(ingredients[i].category.color);
      //console.log('color at', i + ' == ', colors[i])
    }

    //Fill array of gradients
    let gradients = [];
    for(var i = 0; i < ingredients.length; i++) {
      gradients[i] = this.ctx.createLinearGradient(xes[i], yes[i], xes[i+1], yes[i+1]);
    }

    //Create color gradients
    for(var i = 0; i < ingredients.length; i++) {
      gradients[i].addColorStop(0.0, "rgba("+Math.round(colors[i].r*falloff)+", "+Math.round(colors[i].g*falloff)+", "+Math.round(colors[i].b*falloff)+", "+opacity+")");
      gradients[i].addColorStop(0.7, "rgba("+Math.round(colors[i].r*falloff2)+", "+Math.round(colors[i].g*falloff2)+", "+Math.round(colors[i].b*falloff2)+", "+opacity+")");
      gradients[i].addColorStop(1.0, "rgba("+Math.round(colors[i].r*falloff3)+", "+Math.round(colors[i].g*falloff3)+", "+Math.round(colors[i].b*falloff3)+", "+opacity+")");
    }

    //Draw color gradient for each ingredient
    for(var i = 0; i < ingredients.length; i++) {
      this.ctx.fillStyle = gradients[i];
      this.ctx.fillRect(xes[i], yes[i], xes[i+1], this.height);
    }

  }

  /**
   * KEY METHOD
   * Draws water level
   */
  drawWater() {
    //ocean water
    let x0 = 0;
    let y0 = this.height - (this.height * this.waterLevel);
    let x0_0 = 0;
    let y0_0 = this.height;
    let gradient0 = this.ctx.createLinearGradient(x0, y0, x0_0, y0_0);

    let c0 = this.randomWaterColor();

    let falloff = 1.3;
    let falloff2 = 1.0;
    let falloff3 = 0.5;
    let opacity = 0.9;

    gradient0.addColorStop(0.0, "rgba("+Math.round(c0.r*falloff)+", "+Math.round(c0.g*falloff)+", "+Math.round(c0.b*falloff)+", "+opacity+")");
    gradient0.addColorStop(0.8, "rgba("+Math.round(c0.r*falloff2)+", "+Math.round(c0.g*falloff2)+", "+Math.round(c0.b*falloff2)+", "+opacity+")");
    gradient0.addColorStop(1.0, "rgba("+Math.round(c0.r*falloff3)+", "+Math.round(c0.g*falloff3)+", "+Math.round(c0.b*falloff3)+", "+opacity+")");

    this.ctx.fillStyle = gradient0;
    this.ctx.fillRect(x0, y0, this.width, y0_0);

  }

  /**
   * Other drawing metods from here
   */
  drawDetail() {
    // land detail
    let landDetail = Math.round(this.randRange(0, 5));
    // landDetail = 20;
    for (let i=0; i<landDetail; i++) {
      let x1 = this.randRange(0, this.width);
      let y1 = this.randRange(0, this.height);
      let x2 = this.randRange(0, this.width);
      let y2 = this.randRange(0, this.height);
      let width = x2-x1;
      let height = y2-y1;

      // this.randomGradientStrip(0, 0, this.width, this.height);
      this.randomGradientStrip(x1, y1, width, height);
    }
  }

  drawRivers() {
    // rivers
    let c = this.randomWaterColor();
    this.ctx.strokeStyle = "rgba("+c.r+", "+c.g+", "+c.b+", 0.5)";

    let x = this.randRange(0, this.width);
    let y = this.randRange(0, this.height);
    let prevX = x;
    let prevY = y;

    for (let i=0; i<5; i++) {
      x = this.randRange(0, this.width);
      y = this.randRange(0, this.height);

      this.ctx.moveTo(prevX, prevY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();

      prevX = x;
      prevY = y;
    }
  }

  drawBeach() {
    this.beachSize = 7;

    let x1 = 0;
    let y1 = this.height - (this.height * this.waterLevel) - this.beachSize;
    let x2 = 0;
    let y2 = this.height - (this.height * this.waterLevel);

    let gradient = this.ctx.createLinearGradient(x1, y1, x2, y2);

    let c = this.randomColor(this.baseColor);
    let falloff = 1.0;
    let falloff2 = 1.0;
    // gradient.addColorStop(0.0, "rgba("+cr+", "+cg+", "+cb+", "+0+")");
    gradient.addColorStop(0.0, "rgba("+Math.round(c.r*falloff)+", "+Math.round(c.g*falloff)+", "+Math.round(c.b*falloff)+", "+0.0+")");
    gradient.addColorStop(1.0, "rgba("+Math.round(c.r*falloff2)+", "+Math.round(c.g*falloff2)+", "+Math.round(c.b*falloff2)+", "+0.3+")");

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(x1, y1, this.width, this.beachSize);
  }

  drawInland() {
    this.inlandSize = 100;

    let x1 = 0;
    let y1 = this.height - (this.height * this.waterLevel) - this.inlandSize;
    let x2 = 0;
    let y2 = this.height - (this.height * this.waterLevel);

    let gradient = this.ctx.createLinearGradient(x1, y1, x2, y2);

    let c = this.randomColor(this.baseColor);
    let falloff = 1.0;
    let falloff2 = 1.0;
    // gradient.addColorStop(0.0, "rgba("+cr+", "+cg+", "+cb+", "+0+")");
    gradient.addColorStop(0.0, "rgba("+Math.round(c.r*falloff)+", "+Math.round(c.g*falloff)+", "+Math.round(c.b*falloff)+", "+0.0+")");
    gradient.addColorStop(1.0, "rgba("+Math.round(c.r*falloff2)+", "+Math.round(c.g*falloff2)+", "+Math.round(c.b*falloff2)+", "+0.5+")");

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(x1, y1, this.width, this.inlandSize);
  }

  /**
   * Helper methods coming down from here
   */
  randomGradientRect(x, y, width, height) {
    let x1 = this.randRange(0, this.width);
    let y1 = this.randRange(0, this.height);
    let x2 = this.randRange(0, this.width);
    let y2 = this.randRange(0, this.height);

    let gradient = this.ctx.createLinearGradient(x1, y1, x2, y2);

    let c = this.randomColor(this.baseColor);
    gradient.addColorStop(0, "rgba("+c.r+", "+c.g+", "+c.b+", 0.0)");
    gradient.addColorStop(1, "rgba("+c.r+", "+c.g+", "+c.b+", 1.0)");

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(x, y, width, height);
  }

  randomGradientStrip(x, y, width, height) {
    let x1 = this.randRange(0, this.width);
    let y1 = this.randRange(0, this.height);
    let x2 = this.randRange(0, this.width);
    let y2 = this.randRange(0, this.height);

    let gradient = this.ctx.createLinearGradient(x1, y1, x2, y2);

    let c = this.randomColor(this.baseColor);
    gradient.addColorStop(this.randRange(0, 0.5), "rgba("+c.r+", "+c.g+", "+c.b+", 0.0)");
    gradient.addColorStop(0.5, "rgba("+c.r+", "+c.g+", "+c.b+", 0.8)");
    gradient.addColorStop(this.randRange(0.5, 1.0), "rgba("+c.r+", "+c.g+", "+c.b+", 0.0)");

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(x, y, width, height);
  }

  randomColor(startingColor) {

    let newColor = startingColor.clone();
    // console.log('newColor', newColor)

    let hOffset = 0.0;
    let range = 0.0; //Set range for random coloring to 0
    let n = this.randRange(0,1);
    if (n < 0.33) {
      hOffset = 0.0 + this.randRange(-range, range);
    } else if (n < 0.66) {
      hOffset = this.colorAngle + this.randRange(-range, range);
    } else {
      hOffset = -this.colorAngle + this.randRange(-range, range);
    }

    let sOffset = this.randRange(-this.satRange, this.satRange);
    let lOffset = this.randRange(-this.lightRange, this.lightRange);

    // let c = newColor.getHSL();
    // c.h += hOffset;
    // c.s += sOffset;
    // c.l += lOffset;

    newColor = newColor.offsetHSL ( hOffset,  sOffset, lOffset )

    return {r: Math.round(newColor.r*255),
            g: Math.round(newColor.g*255),
            b: Math.round(newColor.b*255)};

  }

  randomWaterColor() {
    let newColor = this.baseColor.clone();

    let hOffset = 0.0;
    let range = 0.1;
    let n = this.randRange(0,1);
    if (n < 0.33) {
      hOffset = 0.0 + this.randRange(-range, range);
    } else if (n < 0.66) {
      hOffset = this.colorAngle + this.randRange(-range, range);
    } else {
      hOffset = -this.colorAngle + this.randRange(-range, range);
    }

    // let sOffset = this.randRange(-this.satRange, this.satRange);
    // let lOffset = this.randRange(-this.lightRange, this.lightRange);

    // let c = newColor.getHSL();
    // c.h += hOffset;
    // c.s = this.randRange(0.0, 0.6);
    // c.l = this.randRange(0.1, 0.4);

    // newColor.setHSL(c.h, c.s, c.l);

    // newColor.offsetHSL(hOffset, sOffset, lOffset);

    newColor = new THREE.Color(0x003C5F);

    return {r: Math.round(newColor.r*255),
            g: Math.round(newColor.g*255),
            b: Math.round(newColor.b*255)};
  }

  toCanvasColor(c) {
    return "rgba("+Math.round(c.r*255)+", "+Math.round(c.g*255)+", "+Math.round(c.b*255)+", 1.0)";
  }

  randRange(low, high) {
    let range = high - low;
    let n = window.rng() * range;
    return low + n;
  }

  mix(v1, v2, amount) {
    let dist = v2 - v1;
    return v1 + (dist * amount);
  }

}

export default Biome;
