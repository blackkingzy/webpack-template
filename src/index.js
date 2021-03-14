import 'core-js/stable'
import 'regenerator-runtime/runtime'

import { createApp } from 'vue'
import router from '@/router'
import i18n from '@/i18n'
// import vuex from '@/store'

import App from '@/App.vue'

import '@/styles/index.css'

const app = createApp(App)

app.use(router).use(i18n).mount('#app')

// .use(vuex)
