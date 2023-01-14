import React, { useState, memo } from "react";
import PropTypes from 'prop-types';
import { Loader } from "../../ui/Loader";
import { Button } from "../../ui/Button";
import { Trash, Update } from "../../ui/Icons";
import { Field } from "../../ui/Field";
import { ApiErrors } from "../../Utils/Api";

export function Ingredients ({ingredients, onDelete, onAdd, onUpdate}) {

    return <div>
        <h1>Ingredients</h1>
        <IngredientForm onSubmit={onAdd}></IngredientForm>
        {ingredients === null ? <Loader></Loader> : <IngredientsList ingredients={ingredients} onDelete={onDelete} onUpdate={onUpdate}></IngredientsList>}
    </div>

}

export function IngredientForm({onSubmit}) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async function (event) {
        setLoading(true);
        const form = event.target;
        const data = new FormData(event.target);
        await onSubmit(data);
        form.reset();
    }

    return  <form className="d-flex align-items-start" onSubmit={handleSubmit}>
        <Field placeholder="titre" name="title" className='mr-2' required/>
        <Field placeholder="unité" name="unit" className='mr-2' required/>
        <Button loading={loading} className='btn btn-primary'> Créer </Button>
    </form>
}


export function IngredientsList({ingredients, onDelete, onUpdate}) {
    return <div>
        <div>
            {ingredients.map((ingredient) => {
                return <Ingredient key={ingredient.id} ingredient={ingredient} onDelete={onDelete} onUpdate={onUpdate}></Ingredient>
            })}
        </div>
    </div>
}

const Ingredient = memo(function({ingredient, onDelete, onUpdate}) {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);

    const handleDelete = async function(event) {

        event.preventDefault();
        setLoading(true);
        await onDelete(ingredient)
        setLoading(false);
    }

    const handleUpdate = async function(event) {
        event.preventDefault();
        setLoading(true);
        setErrors([]);
        try {
            await onUpdate(ingredient, new FormData(event.target))
        } catch (error) {
            if(error instanceof ApiErrors) {
                setErrors(error.errors);
            }
        }

        setLoading(false);
    }

    const errorFor = function(field) {
        const error = errors.find(e => e.field === field)
        if (error) {
            return error.message;
        }

        return null
    }

    return <form className="d-flex align-items-start" onSubmit={handleUpdate}>
            <Field defaultValue={ingredient.title} name="title" className='mr-2' error={errorFor('title')}/>
            <Field defaultValue={ingredient.unit} name="unit" className='mr-2' error={errorFor('unit')}/>
            <Button type='danger' onClick={handleDelete} loading={loading}> <Trash/> </Button>
            <Button type='primary' loading={loading}><Update/></Button>
       </form>
})

Ingredients.propTypes = {
    ingredients: PropTypes.array
}