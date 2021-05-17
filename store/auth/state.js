export const initialState = () => {
    return {
        initialized: false,
        token: null,
        user: null,
        loginStrategy: null
    }
};

export const state = initialState();