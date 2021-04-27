import { Base } from "./base";

export class Order extends Base {
    constructor(value) {
        super(value);
    }

    get token() {
        return { owner: this.seller_users?.address, ...this.tokens };
    }

    get erc20TokenId() {
        return this.erc20tokens.id;
    }
}
