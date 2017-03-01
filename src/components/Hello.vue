<template>
  <div class="hello">
    <canvas id="canvas" width="600" height="300"></canvas>

    <word v-for="item in wordlist" v-bind:type="item" :canvas="canvas"></word>

    <button @click="addWord('verbs')">Add verb</button>
    <button @click="addWord('adjectives')">Add adjective</button>
    <button @click="addWord('substantives')">Add substantive</button>
    <button @click="addWord('misc')">Add misc</button>

    <button @click="saveCanvas()">Save</button>
  </div>
</template>

<script>
import Word from './Word'
export default {
  name: 'hello',
  data () {
    return {
      wordlist: [],
      canvas: {}
    }
  },

  components: {
    Word
  },

  mounted () {
    // fabric.Canvas.prototype.getAbsoluteCoords = function(object) {
    //   return {
    //     left: object.left + this._offset.left,
    //     top: object.top + this._offset.top
    //   };
    // }

    this.canvas = new fabric.Canvas('canvas');
    this.canvas.backgroundColor = 'white';



    // var rect = new fabric.Rect({
    //     top : 100,
    //     left : 100,
    //     width : 60,
    //     height : 70,
    //     fill : 'red'
    // });

    // this.canvas.add(rect);
  },

  methods: {
    addWord: function(type) {
      this.wordlist.push(type);

    //   var rect = new fabric.IText(type, {
    //       top : 100,
    //       left : 100,
    //       width : 60,
    //       height : 70,
    //       textBackgroundColor: 'rgb(0,0,0)',
    //       fill: 'rgb(255,255,255)',
    //       fontFamily: 'Courier',
    //       angle: (10-(Math.random()*20))
    //   });

    // this.canvas.add(rect);

    },
    saveCanvas: function() {
      window.open(this.canvas.toDataURL('png'));
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
