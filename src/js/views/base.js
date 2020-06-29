//accessing the html elements from the DOM
export const elements = {
    searchInput: document.querySelector('.search__field'),
    searchForm: document.querySelector('.search'),
    searchResList: document.querySelector('.results__list'),
    searchRes: document.querySelector('.results'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
} 


//we couldnt select the loader at elements because by the time that code runs the loader wont be on the DOM yet!
export const elementStrings = {
    loader: 'loader', //`loader` is the name of the class we will add to the spinner element when we create it on the fly
}


//renders a spinner in a parent element
export const renderLoader = parent => {
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
}


//clears the spinner off the parent element when the results of the API calls returns
export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if (loader){
        loader.parentElement.removeChild(loader);
    }
}