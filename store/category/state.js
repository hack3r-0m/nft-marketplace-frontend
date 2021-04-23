const defaultCategory = {
    name: 'All Categories',
    img_url: require('~/static/img/category.svg'),
    isAll: true,
    count: 0,
};
export const initialState = () => {
    return {
        categories: [],
        allCategory: defaultCategory,
    }
};

export const state = initialState();
