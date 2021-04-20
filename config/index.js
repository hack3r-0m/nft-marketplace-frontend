
import Vue from "vue";
const config = require("./default");
// debugger;
// if (process.env.NODE_ENV === "production") {
    Object.assign(config, require("./production"))
// }
// else {
//     Object.assign(config, require("./development"))
// }
Vue.appConfig = config;
// export config
export default config;
