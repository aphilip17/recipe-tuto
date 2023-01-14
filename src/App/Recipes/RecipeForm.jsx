import React, { useState, useCallback } from "react";
import { Field } from "../../ui/Field";
import { Trash } from "../../ui/Icons";
import { Loader } from "../../ui/Loader";
import { Button } from "../../ui/Button";
import { ApiErrors } from "../../Utils/Api";

export function CreateRecipeForm({ingredients, onSubmitR}) {
    return <RecipeForm ingredients={ingredients} onSubmitR={onSubmitR} button={'Ajouter'}></RecipeForm>
}

export function EditRecipeForm({ingredients, onSubmitR, recipe}) {
    console.log(ingredients, 'ingredients')
    return <RecipeForm
        ingredients={ingredients}
        onSubmitR={onSubmitR}
        recipe={recipe}
        button={'Editer'}>
    </RecipeForm>
}

export function RecipeForm({ingredients, onSubmitR, recipe = {}, button, children = null}) {
    const {
        ingredients: ingredientsRecipe,
        addIngredient,
        updateQuantity,
        deleteIngredient,
        resetIngredients,
    } = useIngredients(recipe.ingredients);

    const [errors, setErrors] = useState({});

    const handleSelectIngredient = function(i) {

        addIngredient(i);
    }

    const filteredIngredients = ingredients.filter((ing) => {
        return !ingredientsRecipe.some(i => i === ing);
    })

    const handleSubmit = async function(e) {
        e.preventDefault();
        const form = e.target;
        const data = Object.fromEntries(new FormData(form));
        data.ingredients = ingredientsRecipe;
        setErrors({});
        try {
            await onSubmitR(data);
            form.reset();
            resetIngredients();
        } catch (error) {
            if (error instanceof ApiErrors) {
                setErrors(error.errorsPerField);
            }
            throw error;
        }
    }

    return (
        <form className="row" onSubmit={handleSubmit}>
            <div className="col-md-6">
                <Field required name="title" error={errors.title} defaultValue={recipe.title}> Titre</Field>
                <Field required name="short" error={errors.short} defaultValue={recipe.short} type='text-area'> Description courte</Field>
                <Field required name="content" error={errors.content} defaultValue={recipe.content} type='text-area'> Description</Field>
            </div>
            <div className="col-md-6">
                <h5>Ingrédients</h5>
                {ingredientsRecipe.map(i => <IngredientRow
                    ingredient={i}
                    key={i.id}
                    onChange={updateQuantity}
                    onDelete={deleteIngredient}>
                </IngredientRow>)}
                <div className="d-flex">
                {ingredients ? <Select ingredients={filteredIngredients} onChange={handleSelectIngredient}></Select> : <Loader></Loader>}
                </div>
            </div>
            <div className="col-md-12">
                <Button className='btn btn-primary'> {button}</Button>
            </div>
            {children}
        </form>)
}

function IngredientRow({ingredient, onChange, onDelete}) {
    const handleChange = function(e) {
        onChange(ingredient, e.target.value)
    }
    const handleDelete = function(e) {
        onDelete(ingredient);
    }

    return (
        <div className="d-flex mb-3 align-items-center">
            <div className="ml-2">{ingredient.title}</div>
            <Field className="mb-0" defaultValue={ingredient.quantity} placeholder="quantité" onChange={handleChange} required type="number"></Field>
            <div className="ml-2">{ingredient.unit}</div>
            <Button type="danger" onClick={handleDelete}><Trash/></Button>
        </div>
    )
}

function Select({ingredients, onChange}) {
    const handleChange = function(e) {
        onChange(ingredients[parseInt(e.target.value, 10)]);
    }

    return (
        <select className="form-control" onChange={handleChange}>
            <option>Sélectionner un ingrédient</option>
            {ingredients.map((ing, k) => {
                return <option value={k} key={ing.id}>{ing.title}</option>
            })}
        </select>
    )
}

function useIngredients(initial) {
    const [ingredients, setIngredient] = useState(initial || []);

    return {
        ingredients: ingredients,
        addIngredient: useCallback(function(ingredient) {
            setIngredient(state => [...state, ingredient]);
        }, []),
        updateQuantity: useCallback(function(ing, quantity) {
            setIngredient(state => state.map(i => i === ing ? {...i, quantity} : i))
        }, []),
        deleteIngredient: useCallback(function(ing) {
            setIngredient(state => state.filter(i => i !== ing))
        }, []),
        resetIngredients: useCallback(function() {
            setIngredient([])
        }, [])
    }

}