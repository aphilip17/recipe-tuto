import React, {memo} from "react";
import { Button } from "../../ui/Button";


export function Recipes({recipes, onClick}) {

    if (recipes === null)  {
        return;
    }
    return <div className="row">
            {recipes.map((recipe) => {
                return <div className="col-md-4 md-4" key={recipe.id}>
                    <Recipe recipe={recipe} onClick={onClick}></Recipe>
                </div>

            })}
        </div>

}

const Recipe = memo(function({recipe, onClick}) {
    const handleClick = function() {
        onClick(recipe);
    }

    return <div className="card">
        <div className="card-body">
            <h5 className="card-title">{recipe.title} </h5>
            <p className="card-text">{recipe.content}</p>
        </div>
        <Button type="primary" onClick={handleClick}> Voir la recette </Button>
    </div>
})