
import Vue from "vue";
const config = require("./default");
// debugger;
console.log("BUILD_ENV", process.env.BUILD_ENV)
if (process.env.BUILD_ENV === "testnet") {
    Object.assign(config, require("./testnet"))
}
else if (process.env.BUILD_ENV === "staging") {
    Object.assign(config, require("./staging"))
} 
else {
    Object.assign(config, require("./mainnet"))
}
Vue.appConfig = config;
// export config
export default config;
