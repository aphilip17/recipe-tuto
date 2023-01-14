import React from "react"
import { useToogle } from "../../hooks";
import { Loader } from "../../ui/Loader";
import { Button } from "../../ui/Button";
import { Modal } from "../Modal"
import { EditRecipeForm } from "./RecipeForm";

export function Recipe({recipe, ingredients, onClose, onEdit, onUpdate, onDelete}) {
    const handleDelete = function() {
        onDelete(recipe);
    }

    return <Modal title={recipe.title} onClose={onClose}>
        {!recipe.content ? <Loader></Loader>:
            <RecipeDetail
                recipe={recipe}
                ingredients={ingredients}
                onEdit={onEdit}
                onUpdate={onUpdate}
                onDelete={onDelete}>
            </RecipeDetail>
        }
        <Button type="danger" onClick={handleDelete}>Supprimer</Button>
    </Modal>
}

function RecipeDetail({recipe, ingredients, onEdit, onUpdate}) {
    const html = {__html: recipe.content.split('\n').join('<br/>')}
    const [editMode, toogleEdition] = useToogle(false);

    const handleEdit = function() {
        toogleEdition();
        onEdit();
    }

    const handleUpdate = async function(data) {
        await onUpdate(recipe, data);
        toogleEdition();
    }
    if (!recipe) {
        return;
    }
    return editMode ? <EditRecipeForm
        recipe={recipe}
        ingredients={ingredients}
        onSubmitR={handleUpdate}></EditRecipeForm> : <>
        <div dangerouslySetInnerHTML={html}></div>
        <h4>Ingredients</h4>
        <ul>
            {recipe.ingredients ? recipe.ingredients.map(i => <IngredientRow ingredient={i} key={i.id}></IngredientRow>): null}
        </ul>
        <Button onClick={handleEdit}>Editer</Button>
    </>
}

function IngredientRow({ingredient}) {
    return <li>
        <strong> {ingredient.quantity} {ingredient.unit} </strong>
        {ingredient.title}
        </li>
}
