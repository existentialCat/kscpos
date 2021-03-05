import Vue from 'vue'
import VueHtmlToPaper from 'vue-html-to-paper'
const options = {
  name: '_blank',
  specs: ['fullscreen=yes'],
  styles: [
    'https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css',
    'https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css',
    'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900',
  ],
}

Vue.use(VueHtmlToPaper, options)

// or, using the defaults with no stylesheet
// Vue.use(VueHtmlToPaper)
