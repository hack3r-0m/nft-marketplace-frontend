import pascal from "./pascal";
import date_human from "./date_human";
import Vue from "vue";

Vue.filter("pascal", pascal);
Vue.filter("dateHuman", date_human);
