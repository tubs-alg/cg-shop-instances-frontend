import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";

export default new Vuex.Store({
    modules: {
    },
    plugins: [createPersistedState()]
});