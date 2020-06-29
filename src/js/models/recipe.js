import axios from 'axios';
//import proxy from '../config'

export default class Recipe {
    constructor(id){
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
            console.log(res);
            console.log('end call');
        } catch(error) {
            alert(error)
        }
    }

    calcTime(){
        //assuming that we need 15mins for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }
    
    calcServings(){
        this.servings = 4;
    }


    parseIngredients(){
        
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units =[...unitsShort, 'kg', 'g']; //using the spread operator to create a bigger array 

        const newIngredients = this.ingredients.map(el => {
            //we want to make all the units uniform on all the ingredients as we display them in the UI
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i])
            })

            //remove parentheses present in the ingredient string
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //parse ingredients into count, unit and ingredient
            //check if there's a unit in the string
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            
            if(unitIndex > -1){
                //there is a unit
                //Ex. 4 1/2 cups, arrCount is [4, 1/2]
                //Ex. 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex);
                let count;
                if (arrCount.length === 1){
                    count = eval(arrIng[0].replace('-', '+'));
                }else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }
                
            }else if(!(isNaN(parseInt(arrIng[0]), 10))){
                //there's no unit, but first element is a number
                objIng = {
                    count: parseInt((arrIng[0]), 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if( unitIndex === -1){
                //there's no unit and no number in first position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient: ingredient
                }
            }

            return objIng;
        });
        
        this.ingredients = newIngredients;
    }

    updateServings(type){
        //servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        //Ingredients
        this.ingredients.forEach(ing =>{
            ing.count *= (newServings / this.servings);
        })

        this.servings = newServings;
    }
}