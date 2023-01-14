import { useState, useCallback } from 'react';

export function useToogle(initial = false) {
    const [state, setState] = useState(initial);

    return [state, useCallback(() => setState(!state))];

}
