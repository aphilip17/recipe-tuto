import { useReducer, useCallback } from "react"
import { apiFetch } from "../Utils/Api";

function reducer(state, action) {
    switch (action.type) {
        case 'FETCHING_INGREDIENTS':
            return {
                ...state,
                loading: true,
            }
        case 'SET_INGREDIENTS':
            return {
                ...state,
                ingredients: action.payload,
                loading: false,
            }
        case 'DELETE_INGREDIENT':
            return {
                ...state,
                ingredients: state.ingredients.filter(i => i !== action.payload),
            }
        case 'ADD_INGREDIENT':
            return {
                ...state,
                ingredients: [action.payload, ...state.ingredients],
            }
        case 'UPDATE_INGREDIENT':
            return {
                ...state,
                ingredients: state.ingredients.map(i => action.target === i ? action.payload : i),
            }
        default:
            break;
    }
}

export function useIngredients() {
    const [state, dispatch] = useReducer(reducer, {
        ingredients: null,
        loading: false
    })

    return { 
        ingredients: state.ingredients,
        fetchIngredients: useCallback(async () => {
            if (state.loading || state.ingredients) {
                return null;
            }
            const data = await apiFetch('ingredients')
            dispatch({type: 'SET_INGREDIENTS', payload: data})
            dispatch({type: 'FETCHING_INGREDIENTS'})
        }, [state]),
        deleteIngredient: useCallback(async (ingredient) => {
            await apiFetch('ingredients/' + ingredient.id, {method: 'DELETE'})
            dispatch({type: 'DELETE_INGREDIENT', payload: ingredient})
        }, []),
        addIngredient: useCallback(async (ingredient) => {
            const newIngredient =  await apiFetch('ingredients/', {
                method: 'POST',
                body: ingredient
            })
            dispatch({type: 'ADD_INGREDIENT', payload: newIngredient})
        }, []),
        updateIngredient: useCallback(async (ingredient, data) => {
            const newIngredient =  await apiFetch('ingredients/' + ingredient.id, {
                method: 'PUT',
                body: data
            })
            dispatch({type: 'UPDATE_INGREDIENT', payload: newIngredient, target: ingredient})
        }, [])
    }
}