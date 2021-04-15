export class UserService {
    constructor(httpCaller) {
        this.httpCaller = httpCaller;
        this.endPoint_ = "users/";
    }

    createUrl_(url) {
        return this.endPoint_ + url;
    }

    getDetails() {
        const url = this.createUrl_(`details`);
        return this.httpCaller.get(url);
    }
}