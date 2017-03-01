<template>
  <div id="app" class="container">
    <div class="row">
      <div class="two columns"></div>
      <div class="eight columns"><poem></poem></div>
      <div class="two columns"></div>
    </div>
  </div>
</template>

<script>
import Poem from './components/Poem'
import normalize from './assets/normalize.css'
import skeleton from './assets/skeleton.css'

export default {
  name: 'app',

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
</style>
