class MenuItem {

    constructor() {

    }

    /*
    ingredient.name = "1 cup farmer’s cheese";
    ingredient.weight = 225;
    ingredient.category = IngredientCategory.CAT_CHEESE;
    */

    getTotalWeight() {

        //Sum up weights to get total weight
        var totalWeight = 0;

        for (var i = 0; i < this.ingredients.length; i++) {
            totalWeight += this.ingredients[i].weight;
        }

        return totalWeight;

    }

    getTotalH2o() {

        //Sum up grams to get total h2o per gram
        var totalH2o = 0;

        for (var i = 0; i < this.ingredients.length; i++) {
            totalH2o += this.ingredients[i].category.h2o * this.ingredients[i].weight;
        }

        return totalH2o;

    }

    getTotalH2oPerGram() {

        return this.getTotalH2o() / this.getTotalWeight();

    }

    getTotalCo2() {

        //Sum up grams to get total co2 per gram
        var totalCo2 = 0;

        for (var i = 0; i < this.ingredients.length; i++) {
            totalCo2 += this.ingredients[i].category.co2 * this.ingredients[i].weight;
        }

        return totalCo2;

    }

    getTotalCo2PerGram() {
        
        return this.getTotalCo2() / this.getTotalWeight();

    }

}

export default MenuItem;