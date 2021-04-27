import ethjsUtil from 'ethjs-util'
import { toChecksumAddress } from 'ethereumjs-util'
import { Base } from "./base";
import { LOGIN_STRATEGY } from '~/constants'

export class Account extends Base {
    // getters
    get name() {
        return (
            this.label ||
            `Account ${ethjsUtil.stripHexPrefix(this.address).slice(0, 4)}`
        )
    }

    get checksumAddress() {
        return this.address && toChecksumAddress(this.address)
    }

    get shortChecksumAddress() {
        if (!this.address) {
            return null
        }
        const a = toChecksumAddress(this.address)
        return `${a.slice(0, 6)}...${a.slice(38, 42)}`
    }

    get mediumChecksumAddress() {
        if (!this.address) {
            return null
        }
        const a = toChecksumAddress(this.address)
        return `${a.slice(0, 12)}...${a.slice(30, 42)}`
    }

    isMetamaskAccount(currentLoginStrategy) {
        if (currentLoginStrategy && currentLoginStrategy === LOGIN_STRATEGY.metaMask) {
            return true
        }
        return false
    }
}
