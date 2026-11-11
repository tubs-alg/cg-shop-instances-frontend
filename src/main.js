import '@mdi/font/css/materialdesignicons.css'

import {createApp} from 'vue'
import App from './App.vue'
import router from './router'

// Vuetify (components and directives are imported on demand by vite-plugin-vuetify)
import 'vuetify/styles'
import {createVuetify} from 'vuetify'

import VueImageZoomer from 'vue-image-zoomer'
import 'vue-image-zoomer/dist/style.css';

import 'katex/dist/katex.min.css';


const vuetify = createVuetify({
    theme: {
        defaultTheme: 'light'
    },
    icons: {
        defaultSet: 'mdi'
    }
})


createApp(App).use(router).use(vuetify).use(VueImageZoomer).mount('#app');
