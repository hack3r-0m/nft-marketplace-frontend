export class CategoryService {
    constructor(httpCaller) {
        this.httpCaller = httpCaller;
        this.endPoint_ = "categories/";
    }

    createUrl_(url) {
        return this.endPoint_ + url;
    }

    getCategories() {
        const url = this.createUrl_(``);
        return this.httpCaller.get(url);
    }
}