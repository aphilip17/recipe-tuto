import React from 'react';
import { useState } from 'react';
import { ApiErrors, apiFetch } from '../Utils/Api';

export function LoginForm({onConnect}) {

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async function(e) {
        setError(null);
        setLoading(true);
        e.preventDefault();
        try {

            const data = new FormData(e.target);
            const user = await apiFetch('login', {method: 'POST',
                                body: data,});
            onConnect(user);

            } catch (error) {
                if (error instanceof ApiErrors) {

                    setError(error.errors[0].message);
                    setLoading(false);
                }
        }
    }

    return(
        <form className='container mt-4' onSubmit={handleSubmit}>
            {error && <Alert>{error}</Alert>}
            <h2>Se connecter</h2>
            <div className="form-group">
                <label htmlFor="username"> Nom d'utilisateur</label>
                <input type="text" name="email" id="username" className='form-control' required/>
            </div>

            <div className="form-group">
                <label htmlFor="password"> Mot de passe</label>
                <input type="password" name="password" id="password" className='form-control' required/>
            </div>

        <button type="submit" disabled={loading} className='btn btn-primary'> Se connecter</button>
        </form>
    )
}

function Alert({children}) {
    return <div className="alert alert-danger">
        {children}
    </div>
}