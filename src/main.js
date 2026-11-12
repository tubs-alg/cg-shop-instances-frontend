import '@mdi/font/css/materialdesignicons.css'
import '@fontsource-variable/inter'

import {createApp} from 'vue'
import App from './App.vue'
import router from './router'

// Vuetify (components and directives are imported on demand by vite-plugin-vuetify)
import 'vuetify/styles'
import {createVuetify} from 'vuetify'

import VueImageZoomer from 'vue-image-zoomer'
import 'vue-image-zoomer/dist/style.css';

import 'katex/dist/katex.min.css';

import './styles/main.css'

const vuetify = createVuetify({
    theme: {
        defaultTheme: 'cgshop',
        themes: {
            cgshop: {
                dark: false,
                colors: {
                    primary: '#2e506c',
                    secondary: '#e8784e',
                    accent: '#3fa7a0',
                    background: '#fbfbfa',
                    surface: '#ffffff',
                    'surface-variant': '#2e506c',
                    'on-surface-variant': '#ffffff',
                    'surface-muted': '#f4f1ef',
                    'brand-dark': '#1d3446',
                },
            },
        },
    },
    icons: {
        defaultSet: 'mdi'
    },
    defaults: {
        VBtn: {
            rounded: 'lg',
        },
        VCard: {
            rounded: 'lg',
        },
        VChip: {
            rounded: 'lg',
        },
        VTextField: {
            variant: 'outlined',
            density: 'comfortable',
        },
        VSelect: {
            variant: 'outlined',
            density: 'comfortable',
        },
    },
})


createApp(App).use(router).use(vuetify).use(VueImageZoomer).mount('#app');
