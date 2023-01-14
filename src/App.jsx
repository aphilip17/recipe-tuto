import React, {useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ApiErrors, apiFetch } from './Utils/Api';

import { LoginForm } from './App/LoginForm';
import { Site } from './App/Site';

export default function App() {

    const [user, setUser] = useState(null);
    useEffect(function() {
        apiFetch('me').then((user) => {
            if (user instanceof ApiErrors) {
                setUser(false);
            } else {
                setUser(user);
            }

    }).catch(() => {
            setUser(false)
    });
    }, [])

    if (user === null) {
        return null;
    }
    return (
        user ? <Site></Site> : <LoginForm onConnect={setUser}/>
    );
}

LoginForm.propTypes = {
    onConnect : PropTypes.func.isRequired

}
