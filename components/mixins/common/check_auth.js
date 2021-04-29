import { getDefaultAccount } from '~/helpers/metamask-utils'
export default {
    async beforeRouteEnter(to, from, next) {
        const selectedAddress = await getDefaultAccount();
        next(vm => {
            vm.accountAddressFromMetaMask = selectedAddress;
            debugger;
        })
    },
    mounted() {
        const user = this.$store.state['auth'].user;
        const selectedAddress = this.accountAddressFromMetaMask;
        // is initialized but not authenticated redirect to login
        if (
            !selectedAddress ||
            !user ||
            !user.address ||
            user.address.toLowerCase() !== selectedAddress.toLowerCase()
        ) {
            this.isLoggingOut = true;
            return this.$router.replace({
                name: 'login',
                query: {
                    next: this.$route.fullPath,
                }
            })
        }
    }
}
