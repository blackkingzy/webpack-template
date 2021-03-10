import 'core-js/stable'
import 'regenerator-runtime/runtime'
import { createApp } from 'vue'
import axios from 'axios'
import add from '@/other' // es module
import App from './App.vue'

import pic from './logo.png'

import css from './index.css'

const json = import('./index.json')
const img = new Image()
img.src = pic
console.log('src', pic)
img.classList.add('logo')
const app1 = document.getElementById('app')
app1.append(img)

setTimeout(() => {
  import('./async.js').then((module) => {
    console.log(module.default())
  })
}, 5000)
const app = createApp(App)
app.mount('#app')
console.log('ZHANGYUE', process.env.CURRENT_ENV)

const arr = [new Promise(() => {}), new Promise(() => {})]

console.log(json, add(2, 800))
