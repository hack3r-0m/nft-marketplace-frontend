import BigNumber from '~/plugins/bignumber'
import { parseBalance } from '~/helpers/token-utils'
import { Base } from './base'
const ZERO = new BigNumber(0)

export class Bid extends Base {
    getPrice() {
        const price = new BigNumber(this.price)
        if (!price || !this.erc20Token) {
            return ZERO
        }
        return parseBalance(price, this.erc20Token.decimal)
    }
}
