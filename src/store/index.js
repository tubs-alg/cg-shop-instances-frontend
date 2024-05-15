import Vuex from 'vuex';
import { auth } from "./auth.module";
import createPersistedState from "vuex-persistedstate";

export default new Vuex.Store({
    modules: {
        auth
    },
    plugins: [createPersistedState()]
});