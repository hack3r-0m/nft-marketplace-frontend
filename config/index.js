
import Vue from "vue";
const config = require("./default");
console.log("BUILD_ENV", process.env.BUILD_ENV)
if (process.env.BUILD_ENV === "mainnet" || process.env.NODE_ENV === "production") {
    Object.assign(config, require("./mainnet"))
}
else if (process.env.BUILD_ENV === "staging") {
    Object.assign(config, require("./staging"))
} 
else {
    Object.assign(config, require("./testnet"))
}
Vue.appConfig = config;
// export config
export default config;
