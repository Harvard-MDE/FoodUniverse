class IngredientCategory {

    constructor(rank, co2, h2o, color) {

        this.rank = rank;
        this.co2 = co2; //co2 per gram
        this.h2o = h2o; //h2o per gram
        this.color = color; //color

    }

}

/**
 * This here serves just as an index!
 * Weirdly enough, these have to be loaded by a loader method in BlockLoader before working. I have no idea why...
 */
export let CAT_VEGETABLES; // = new IngredientCategory(0, 0.5/1000, 322/1000, new THREE.Color('green'));
export let CAT_CORD_SAUCES; // = new IngredientCategory(1, 5/1000, 1500/1000, new THREE.Color('black'));
export let CAT_SUGARS; // = new IngredientCategory(2, 3/1000, 2000/1000, new THREE.Color('white'));
export let CAT_POULTRY; // = new IngredientCategory(3, 6/1000, 4325/1000, new THREE.Color('pink'));
export let CAT_BREAD; // = new IngredientCategory(4, 1.5/1000, 1644/1000, new THREE.Color('yellow'));
export let CAT_CHEESE; // = new IngredientCategory(5, 21/1000, 1020/1000, new THREE.Color('violet'));

export default IngredientCategory;