export const initialState = () => {
    return {
        initialized: false,
        token: null,
        user: null,
        address: null,
        userId: null,
        loginStrategy: null
    }
};

export const state = initialState();