import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

import {createApp} from 'vue'
import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import store from "./store"
import * as labsComponents from 'vuetify/labs/components'

import VueImageZoomer from 'vue-image-zoomer'
import 'vue-image-zoomer/dist/style.css';


const vuetify = createVuetify({
    components: {
        ...components,
        ...labsComponents
    },
    directives,
    icons: {
        defaultSet: 'mdi'
    }
})


createApp(App).use(router).use(store).use(vuetify).use(VueImageZoomer).mount('#app')
