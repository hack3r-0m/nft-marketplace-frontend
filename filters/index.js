import pascal from "./pascal";
import date_human from "./date_human";
import Vue from "vue";
import { fixed } from "./fixed";
import { dollarSymbol } from "./dollar_symbol";

Vue.filter("pascal", pascal);
Vue.filter("dateHuman", date_human);
Vue.filter("fixed", fixed);
Vue.filter("dollarSymbol", dollarSymbol);
