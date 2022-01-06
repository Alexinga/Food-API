'use strict';
const foodContainer = document.querySelector('.food-container');
const searchBtn = document.querySelector('i');
const mealRecipe = document.querySelector('.meal-recipe');


searchBtn.addEventListener('click', getMeal);
foodContainer.addEventListener('click', getMealRecipe);

function getMeal() {
    let searchInput = document.querySelector('#input').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInput}`)
    .then(response => {
        if(!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.json()
    })
    .then(data => {
        if (data.meals) {
            data.meals.forEach(meal => {
                renderMeal(meal);
            });
        } else {
            renderError(searchInput);
        }
        searchInput = document.querySelector('#input');
        searchInput.value = '';
    })
    .catch(error => renderApiError(error));
}

function getMealRecipe(e) {
    e.preventDefault();
    if(e.target.classList.contains('btn')) {
        let foodBox = e.target.parentElement
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${foodBox.dataset.id}`)
        .then(response => response.json())
        .then(data => renderMealRecipe(data.meals))
        .catch(err => renderApiError(err))
    }
} 

function renderMeal(meals) {
    const html = `
    <div class="food-box" data-id="${meals.idMeal}">
        <img class="img" src="${meals.strMealThumb}">
        <h2>${meals.strMeal}</h2>
        <button class="btn">Get Recipe</button>
    </div>`;
    foodContainer.insertAdjacentHTML('beforeend', html);
}
function renderError(input) {
    const htmlError = `
    <div class="error">
        <h2>Sorry, we didn't find any meal with ${input}</h2>
    </div>`;
    foodContainer.insertAdjacentHTML('afterend', htmlError);
}
function renderMealRecipe(meals) {
    //Displaying the recipe with our API. 
    const [meal] = meals;
    const html = 
    `
    <div class="overlay">
        <div class="overlay-box">
            <button class="close-btn">&#10006</button>
            <h2 class="box-heading">${meal.strMeal}</h2>
            <h3 class="box-main"><span>${meal.strCategory}</span></h3>
            <h2 class="box-instructions">Instructions:</h2>
            <p>${meal.strInstructions}</p>
            <img src="${meal.strMealThumb}" alt="food-item">
            <a href="${meal.strYoutube}">Watch Video</a>
        </div>
    </div>
    `;
    mealRecipe.insertAdjacentHTML('beforeend', html);

    //Closing the btn from the modal
    const closeRecipeBtn = document.querySelector('.close-btn');
    const overlay = document.querySelector('.overlay');
    closeRecipeBtn.addEventListener('click', () => {
        closeRecipeBtn.parentElement.remove();
        overlay.remove();
    });
}

function renderApiError(err) {
    const html = 
    `
    <div class="error">
        <h2>Sorry, there is an error: ${err}. Try again later!</h2>
    </div>
    `;
    foodContainer.insertAdjacentHTML('afterend', html);
}