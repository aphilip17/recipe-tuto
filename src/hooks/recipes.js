import { useReducer, useCallback } from "react"
import { apiFetch } from "../Utils/Api";


function reducer(state, action) {
    switch (action.type) {
        case 'FETCHING_RECIPES':
            return {
                ...state,
                loading: true

            }
        case 'SET_RECIPES':
            return {
                ...state,
                recipes: action.payload,
                loading: false,
            }
        case 'ADD_RECIPE':
            if (state.recipes === null) {
                return state
            }
            return {
                ...state,
                recipes: [action.payload, ...state.recipes],
            }
        case 'SET_RECIPE':
            return {
                ...state,
                recipes: state.recipes.map(r => r.id === action.payload.id ? action.payload : r)
            }
        case 'FETCHING_RECIPE':
            return {
                ...state, recipeId: action.payload
            }
        case 'DESELECT_RECIPE':
            return {
            ...state,
            recipeId: null
        }
        case 'UPDATE_RECIPE':
            return {
                ...state,
                recipes: state.recipes.map(r => r.id === action.payload.id ? action.payload : r)
            }

        case 'DELETE_RECIPE':
            return {
                ...state,
                recipes: state.recipes.filter(r => r.id !== action.payload.id)
            }
        default:
            break;
    }

}

export function useRecipes() {
    const [state, dispatch] = useReducer(reducer,  {
        recipes: null,
        loading: false,
        recipeId: null,
    });

    const recipe = state.recipes ? state.recipes.find(r => r.id === state.recipeId) : null;

    return  {
        recipes: state.recipes,
        recipe: recipe,
        fetchRecipes: useCallback(async () => {
            if (state.loading || state.recipes) {
                return null;
            }
            dispatch({type: 'FETCHING_RECIPES'})
            const data = await apiFetch('recipes')
            dispatch({type: 'SET_RECIPES', payload: data})
        }, [state]),
        addRecipes: useCallback(async function(data) {
            const recipe = await apiFetch('recipes', {
                method: 'POST',
                body: data
            });
            dispatch({type: 'ADD_RECIPE', payload: recipe})
        }, []),
        updateRecipe: useCallback(async function(recipe, data) {
            recipe = await apiFetch('recipes/' + recipe.id, {
                method: 'PUT',
                body: data
            });
            dispatch({type: 'UPDATE_RECIPE', payload: recipe})
        }, []),
        fetchRecipe: useCallback(async function(recipe) {
            dispatch({type: 'FETCHING_RECIPE', payload: recipe.id})
            if (!recipe.content) {
                recipe = await apiFetch('recipes/' + recipe.id);
                dispatch({type: 'SET_RECIPE', payload: recipe})
            }
        }, []),
        deleteRecipe: useCallback(async function(recipe) {
            await apiFetch('recipes/' + recipe.id, {
                method: 'DELETE',
            });
            dispatch({type: 'DELETE_RECIPE', payload: recipe})
        }, []),
        deselectRecipe: function() {
            dispatch({type: 'DESELECT_RECIPE'})
        }
    }
}