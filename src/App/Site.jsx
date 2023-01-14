import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useIngredients } from "../hooks/ingredients";
import { useRecipes } from "../hooks/recipes";
import { useToogle } from "../hooks/index";
import { Ingredients } from "./Ingredients/Ingredients";
import { Recipes } from "./Recipes/Recipes";
import { Recipe } from "./Recipes/Recipe";
import { CreateRecipeForm } from "./Recipes/RecipeForm";
import { Modal } from "./Modal";

export function Site() {
    const [page, setPage] = useState('recipes');
    const [add, setToogle] = useToogle(false);
    const {
        ingredients,
        fetchIngredients,
        deleteIngredient,
        addIngredient,
        updateIngredient,
    } = useIngredients();

    const {
        recipes,
        recipe,
        fetchRecipes,
        addRecipes,
        fetchRecipe,
        deselectRecipe,
        updateRecipe,
        deleteRecipe,
    } = useRecipes();

    let content = null;
    if (page === 'ingredients') {
        content = <Ingredients ingredients={ingredients} onDelete={deleteIngredient} onAdd={addIngredient} onUpdate={updateIngredient}></Ingredients>;
    }

    if (page === 'recipes') {
        content = <Recipes recipes={recipes} onClick={fetchRecipe}/>
    }

    useEffect(() => {
        if (page === 'ingredients' || add) {
            fetchIngredients();
        }

        if (page === 'recipes') {
            fetchRecipes();
            fetchIngredients();
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, add])

    return <>
            <NavBar currentPage={page} onClick={setPage} onButtonClick={setToogle}></NavBar>
            {recipe ? <Recipe
                recipe={recipe}
                ingredients={ingredients}
                onClose={deselectRecipe}
                onEdit={fetchIngredients}
                onUpdate={updateRecipe}
                onDelete={deleteRecipe}>
            </Recipe> : null}
            {add ? <Modal title="Créer une recette" onClose={setToogle}>
                <CreateRecipeForm ingredients={ingredients} onSubmitR={addRecipes}></CreateRecipeForm>
            </Modal> : ''}
            {content}
    </>

}

function NavBar({currentPage, onClick, onButtonClick}) {

    function navClass(page) {
        let navClass = "nav-link";

        if (page === currentPage) {
            return navClass += ' active';
        }
        return navClass;
    }
    return  <nav className="navbar navbar-expand-sm navbar-dark bg-primary mb-4">

        <a href="#recipe" className="navbar-brand">{"Recette"}</a>
        <ul className="navbar-nav mr-auto">
            <li className="nav-item">
                <a href="#recipes" className={navClass('recipes')} onClick={() => onClick('recipes')}>Recettes</a>
            </li>
            <li className="nav-item">
                <a href="#ingredients" className={navClass('ingredients')} onClick={() => onClick('ingredients')}>Ingrédients</a>
            </li>
        </ul>
        <button onClick={onButtonClick} className="btn btn-outline-light">Add recipe</button>
    </nav>
}