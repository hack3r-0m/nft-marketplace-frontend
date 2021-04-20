export default {
    install(Vue, bus) {
        const toast = {
            show(title, body, options = {}) {
                const toastId = Date.now();
                options.id = toastId;
                options.details = body
                bus.$emit('toast:show', title, options)
                return toastId;
            },
            hide(id) {
                bus.$emit('toast:hide', id)
            }
        };
        Vue.toast= toast;
        Vue.mixin({
            beforeCreate() {
                this.$toast = toast
            },
        })
    },
}
