const initialState = () => {
    return {
        initialized: false,
        authToken: null,
        user: null,
        address: null,
        userId: null,
        loginStrategy: null
    }
};

export const state = initialState();