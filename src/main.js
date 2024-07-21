import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/custom/default.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css'

import i18n from './i18n'

createApp(App).use(router).use(i18n).mount('#app')
