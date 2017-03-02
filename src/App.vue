<template>
  <div id="app" class="container">
    <poem></poem>
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
