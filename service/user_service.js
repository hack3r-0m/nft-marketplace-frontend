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

    login(payload) {
        const url = this.createUrl_(`login`);
        return this.httpCaller.post(url, payload);
    }

    removeFromFavourite(orderId) {
        const url = this.createUrl_(`favourites/${orderId}`);
        return this.httpCaller.delete(url);
    }

    addToFavourite(orderId) {
        const url = this.createUrl_(`favourites`);
        return this.httpCaller.post(url, {
            orderId: orderId
        });
    }

    fetchActiveOrders(userId) {
        const url = this.createUrl_(`${userId}/activeorders`);
        return this.httpCaller.get(url);
    }

    fetchFavouriteOrders(userId) {
        const url = this.createUrl_(`${userId}/favourites`);
        return this.httpCaller.get(url);
    }

    fetchPendingWithdrawals(userId) {
        const url = `assetmigrate/?user_id=${userId}&type=["WITHDRAW"]&status=[0,1]`;
        return this.httpCaller.get(url);
    }

    fetchNotification({ userId, offset = 0, limit = 0 }) {
        const url = this.createUrl_(`notification/${userId}?offset=${offset}&limit=${limit}`);
        return this.httpCaller.get(url);
    }

    markNotificationAsRead(userId) {
        const url = this.createUrl_(`notification/mark-read/${userId}`);
        return this.httpCaller.get(url);
    }

    fetchDepositAndWithdrawlsNotification(userId) {
        const url = `assetmigrate/?user_id=${userId}&type=["DEPOSIT","WITHDRAW"]&status=[0,1,2,3]`;
        return this.httpCaller.get(url);
    }

    getConfig(){
        return this.httpCaller.get(`config`);
    }
}
