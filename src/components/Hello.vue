<template>
  <div class="hello">
    <canvas id="canvas" width="600" height="300"></canvas>

    <word v-for="item in wordlist" v-bind:type="item" :canvas="canvas"></word>

    <button @click="addWord('verbs')">Add verb</button>
    <button @click="addWord('adjectives')">Add adjective</button>
    <button @click="addWord('substantives')">Add substantive</button>
    <button @click="addWord('misc')">Add misc</button>

    <button @click="saveCanvas()">Save</button>
    <button @click="changeBG()">New BG image</button>
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
    var self = this;
    this.canvas = new fabric.Canvas('canvas');
    this.canvas.backgroundColor = 'white';
    this.changeBG();
    // this.bgImage = new fabric.Image.fromURL('../static/1.jpg', function(oImg) {
    //   oImg.scale(0.5);
    // });
    // this.canvas.setBackgroundImage('../static/1.jpg', this.canvas.renderAll.bind(this.canvas));
    // this.canvas.setBackgroundImage(this.bgImage, this.canvas.renderAll.bind(this.canvas));



  },

  methods: {
    addWord: function(type) {
      this.wordlist.push(type);
    },
    saveCanvas: function() {
      window.open(this.canvas.toDataURL('png'));
    },
    changeBG: function() {
      var randomImage = '../static/' + Math.floor(1 + Math.random()*10) + '.jpg';
      console.log(randomImage);
      var self = this;
      fabric.Image.fromURL(randomImage, function(img) {
        self.canvas.backgroundImage = img;
        self.canvas.backgroundImage.width = 600;
        self.canvas.backgroundImage.height = 400;
        self.canvas.renderAll();
      });
    }
  }
}
</script>

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
