import * as THREE from 'three'
import Block from './Block.js';
import Ingredient from './Ingredient.js';
import IngredientCategory from './IngredientCategory.js';
import MenuItem from './MenuItem.js';
import Restaurant from './Restaurant.js';
import Menu from './Menu.js';

class BlockLoader {

    constructor() {

        this.loadIngredientCategories();

    }

    loadIngredientCategories() {

        IngredientCategory.CAT_VEGETABLES = new IngredientCategory(0, 0.5/1000, 322/1000, new THREE.Color('green'));
        IngredientCategory.CAT_CORD_SAUCES = new IngredientCategory(1, 5/1000, 1500/1000, new THREE.Color('black'));
        IngredientCategory.CAT_SUGARS = new IngredientCategory(2, 3/1000, 2000/1000, new THREE.Color('white'));
        IngredientCategory.CAT_POULTRY = new IngredientCategory(3, 6/1000, 4325/1000, new THREE.Color('pink'));
        IngredientCategory.CAT_BREAD = new IngredientCategory(4, 1.5/1000, 1644/1000, new THREE.Color('yellow'));
        IngredientCategory.CAT_CHEESE = new IngredientCategory(5, 21/1000, 1020/1000, new THREE.Color('violet'));

    }

    loadDefaultBlock1() {

        const block = new Block();

        block.name = "Cambridge";
        block.restaurants = [];
        block.restaurants[0] = this.loadDefaultBlock1Restaurant1();

        return block;

    }

    loadDefaultBlock1Restaurant1() {

        const restaurant = new Restaurant();

        restaurant.name = "Russell House Tavern";
        restaurant.address = "14 Jfk St CAMBRIDGE, MA 02138";
        restaurant.phone = "(617) 500-3055";

        restaurant.menus = [];
        restaurant.menus[0] = this.loadDefaultBlock1Restaurant1Menu1();

        return restaurant;

    }

    loadDefaultBlock1Restaurant1Menu1() {

        const menu = new Menu();

        menu.items = [];
        menu.items[0] = this.loadDefaultBlock1Restaurant1Menu1Item1();

        return menu;

    }

    loadDefaultBlock1Restaurant1Menu1Item1() {

        const item = new MenuItem();

        item.name = "Grilled Chicken Sandwich";
        item.description = "Grilled shishito peppers, pickled grean beans, avocado spread, tomato";
        item.price = 13;
        
        item.ingredients = [];

        item.ingredients[0] = this.loadDefaultBlock1Restaurant1Menu1Item1Ingredient1();
        item.ingredients[1] = this.loadDefaultBlock1Restaurant1Menu1Item1Ingredient2();
        item.ingredients[2] = this.loadDefaultBlock1Restaurant1Menu1Item1Ingredient3();
        item.ingredients[3] = this.loadDefaultBlock1Restaurant1Menu1Item1Ingredient4();
        item.ingredients[4] = this.loadDefaultBlock1Restaurant1Menu1Item1Ingredient5();
        item.ingredients[5] = this.loadDefaultBlock1Restaurant1Menu1Item1Ingredient6();
        item.ingredients[6] = this.loadDefaultBlock1Restaurant1Menu1Item1Ingredient7();
        item.ingredients[7] = this.loadDefaultBlock1Restaurant1Menu1Item1Ingredient8();

        return item;

    }

    loadDefaultBlock1Restaurant1Menu1Item1Ingredient1() {

        const ingredient = new Ingredient();

        ingredient.name = "1 large bunch radishes, (1 cup radishes, cut into wedges + 1/2 cup radish greens)";
        ingredient.weight = 12;
        ingredient.category = IngredientCategory.CAT_VEGETABLES;

        return ingredient;

    }

    loadDefaultBlock1Restaurant1Menu1Item1Ingredient2() {

        const ingredient = new Ingredient();

        ingredient.name = "2 tablespoons white-wine vinegar";
        ingredient.weight = 29.8;
        ingredient.category = IngredientCategory.CAT_CORD_SAUCES;

        return ingredient;

    }

    loadDefaultBlock1Restaurant1Menu1Item1Ingredient3() {

        const ingredient = new Ingredient();

        ingredient.name = "1 teaspoon sugar";
        ingredient.weight = 4.2;
        ingredient.category = IngredientCategory.CAT_SUGARS;

        return ingredient;

    }

    loadDefaultBlock1Restaurant1Menu1Item1Ingredient4() {

        const ingredient = new Ingredient();

        ingredient.name = "4 chicken cutlets (1 1/2 pounds)";
        ingredient.weight = 680.388555;
        ingredient.category = IngredientCategory.CAT_POULTRY;

        return ingredient;

    }

    loadDefaultBlock1Restaurant1Menu1Item1Ingredient5() {

        const ingredient = new Ingredient();

        ingredient.name = "Kosher salt and freshly ground black pepper";
        ingredient.weight = 7.62833133;
        ingredient.category = IngredientCategory.CAT_CORD_SAUCES;

        return ingredient;

    }

    loadDefaultBlock1Restaurant1Menu1Item1Ingredient6() {

        const ingredient = new Ingredient();

        ingredient.name = "Kosher salt and freshly ground black pepper";
        ingredient.weight = 3.814165665;
        ingredient.category = IngredientCategory.CAT_CORD_SAUCES;

        return ingredient;

    }

    loadDefaultBlock1Restaurant1Menu1Item1Ingredient7() {

        const ingredient = new Ingredient();

        ingredient.name = "1 loaf ciabatta, split lengthwise and cut into 4 pieces";
        ingredient.weight = 320;
        ingredient.category = IngredientCategory.CAT_BREAD;

        return ingredient;

    }

    loadDefaultBlock1Restaurant1Menu1Item1Ingredient8() {

        const ingredient = new Ingredient();

        ingredient.name = "1 cup farmer’s cheese";
        ingredient.weight = 225;
        ingredient.category = IngredientCategory.CAT_CHEESE;

        return ingredient;

    }

}

export default BlockLoader;