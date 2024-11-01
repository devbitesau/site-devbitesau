import './style.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Unicon from 'vue-unicons'
import * as icons from 'vue-unicons/dist/icons'

Object.keys(icons).forEach(key => {
    Unicon.add( icons[key])
})

const app = createApp(App)

app.use(router)
app.use(Unicon, {
    fill: 'deeppink',
    height: 32,
    width: 32
  })
app.mount('#app')

