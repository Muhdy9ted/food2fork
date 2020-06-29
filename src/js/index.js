// Global app controller
import Search from './models/Search';
import Recipe from './models/recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';


/** Global state of the app 
 * - Search object
 * - current recipe object
 * - shopping list object
 * - Liked recipes
*/
const state = {
    //state of our app at a given moment in time

};


/**
 * SEARCH CONTROLLER
 */

//get users' search input
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});


//eventlistener callback function
const controlSearch = async () => {
    
    //1. Get query from the view
    const query = searchView.getInput();

    if(query){
        
        //2. Create new search object and add to state
        state.search = new Search(query);

        //3. Prepare UI for Result
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try{
             //4. Search for recipe
            await state.search.getResults();

            //5. Render result on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        }catch(error){
            alert("oops!");
            clearLoader();
        }
    }
}

//add event listener to the pagination buttons div since the button doesn't appear on the DOM till later
elements.searchResPages.addEventListener('click', e => {

    //event delegation for the pagination buttons
    //using element.closest to capture all click events happing in the searchRespages element(pagination div) 
    //to act as the button click 
    const btn = e.target.closest('.btn-inline');

    if(btn){
    
        //getting the page set in the data-goto attribute on the button element
        const goToPage = parseInt(btn.dataset.goto, 10); //convert to base 10
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/**
 * RECIPE CONTROLLER
 */

const controlRecipe = async () => {

    //get id from url
    const id = window.location.hash.replace('#', '');

    if (id){
        //prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //highlight selected item
        if (state.search) searchView.highLightedSelected(id);

        //create new recipe object
        state.recipe = new Recipe(id);

        try{
            //get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            
            //calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id)); //check if the recipe is already liked by the user
        }catch (error) {
            console.log(error);
            alert("Error processing Recipe");
        }
        
    }
}

//call an event when the hash id in url changes
// window.addEventListener('hashchange', controlRecipe);

//for when the page reloads or its loaded and the hash dosent change we force it to load the function for hash url again
// window.addEventListener('load', controlRecipe);

//add thesame eventlistener to different events
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/**
 * LIST CONTROLLER
 */
const controlList = () => {
    //create a new list if there's non yet
    if (!state.list) state.list = new List();

    //add each ingredients to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    })
}

//handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //handle the delete button
    if( e.target.matches('.shopping__delete, .shopping__delete *')){
        //delete from state
        state.list.deleteItem(id);
        listView.deleteItem(id);

        //handle the count update
    }else if(e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
})



/**
 * LIKE CONTROLLER
 */
const controlLike = () => {
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    //user has NOT yet liked current recipe
    if(!state.likes.isLiked(currentID)){
        //add like to the state
        const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img);
        
        //toggle the like button
        likesView.toggleLikeBtn(true);

        //add like to the UI list
        likesView.renderLike(newLike);
        console.log(state.likes);
   
    //user HAS liked the current recipe
    }else {
        //remove like to the state
        state.likes.deleteLike(currentID);
        
        //toggle the like button
        likesView.toggleLikeBtn(false);

        //remove like to the UI list
        likesView.deleteLike(currentID);
        console.log(state.likes);
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes())
}

//restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    //restore likes
    state.likes.readStorage();

    //toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    //render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
})


//handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')){
        if (state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    }else if (e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        console.log('test');
        //add ingredient to shopping list
        controlList();
    }else if(e.target.matches('.recipe__love, .recipe__love *')){
        //like controller
        controlLike();
    }
})

