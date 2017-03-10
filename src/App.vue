<template>
  <div id="app" class="container">
    <input type="radio" id="FI" value="FI" v-model="lang">
    <label for="FI">FI</label>
    <input type="radio" id="EN" value="EN" v-model="lang">
    <label for="EN">EN</label>
    <br>
    <poem :language="lang"></poem>
  </div>
</template>

<script>
import Poem from './components/Poem'
import normalize from './assets/normalize.css'
import skeleton from './assets/skeleton.css'
import fa from './assets/font-awesome-4.7.0/css/font-awesome.min.css'

export default {
  name: 'app',

  data () {
    return {
      lang: "FI"
    }
  },

  components: {
    Poem
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

label {
  display: inline !important;
}

.menu {
  padding-top: 2em;
}

.pull-right {
  float: right;
}

.m-t {
  margin-top: 1em;
}
</style>
