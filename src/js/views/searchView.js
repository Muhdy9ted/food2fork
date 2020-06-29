import { elements } from './base';

//get users' search query
export const getInput = () => elements.searchInput.value;


//renders the results of the API call to the UI page by page using pagination (called in the Controller)
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
   
    //the start and end variables for the pagination function, using the recipes array elements position
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
   
    //render individual item to the DOM
    recipes.slice(start, end).forEach(renderRecipe);

    //render pagination buttons
    renderButtons(page, recipes.length, resPerPage);
} 

export const highLightedSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    })
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active')
}

//renders individual recipe from the API call to the UI
const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
}


//creates the pagination buttons
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>    
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`


//renders the pagination buttons dynamically to the DOM
const renderButtons = (page , numResults, resPerPage) => {

    //check how many pages we going to have in total depending on the number of returned items and number of items per page
    const pages = Math.ceil(numResults / resPerPage); //always round up to next integer
    let button;

    if( page === 1 && pages > 1){
        //only button to go to next page, page is current page number
        button = createButton(page, 'next');

    } else if( page < pages){
        // both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `
    } else if (page === pages && pages > 1){
        //only button to go the previous page
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button)
}


//clears the input search field after the users' search
export const clearInput = () => elements.searchInput.value = "";


//clear the result-list of previous results
export const clearResults = () => {
    elements.searchResList.innerHTML = "";
    elements.searchResPages.innerHTML = "";
}


//limits the characters shown for the title of a result in the UI
export const limitRecipeTitle = (title, limit = 17) => {

    const newTitle = [];
    //check if the length of the title is greater than limit before we editl
    if(title.length > limit) {
        //get the individual words in the title (#split()) then formulate (#reduce()) a new title lesser than the specified limit
        title.split(' ').reduce((acc, cur) => {
            if(acc + cur.length <= limit){
                newTitle.push(cur);
            }
            return acc + cur.length; //update the accumulator for the next iteration
        }, 0);

        //return the result
        return `${newTitle.join(' ')} ...` 
    }
    return title;
}