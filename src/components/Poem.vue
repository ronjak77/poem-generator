<template>
  <div class="poem twelve columns">
    <canvas id="canvas" width="800" height="600"></canvas>
    <word v-for="item in wordlist" v-bind:type="item" :canvas="canvas"></word>

    <button @click="saveCanvas()">Tallenna koneelle</button>
    <button @click="exportCanvas()">Lähetä galleriaan</button>
    <button @click="changeBG()">Vaihda taustakuva</button>

  </div>
</template>

<script>
import Word from './Word'
export default {
  name: 'poem',
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

    this.canvas.on('mouse:down', function(options) {
      if(options.target === null) {
        var now = new Date().getTime();
        var lastTouch = self.lastTouch || now + 1;
        var delta = now - lastTouch;
        if (delta < 300 && delta > 0) {
            self.lastTouch = null;
            self.addWord("random", self.canvas.getPointer(options.e));
        } else {
            self.lastTouch = now;
        }
      }
    });
  },

  methods: {
    addWord: function(type, coord) {
      if(type === "random") {
        var wordclasses = ["adjectives", "verbs", "substantives", "misc"];
        var wordType = wordclasses[Math.floor(Math.random()*wordclasses.length)];
        this.wordlist.push({ type: wordType, startPos: coord });
      } else {
        this.wordlist.push({ type: type, startPos: coord });
      }
    },
    saveCanvas: function() {
      window.open(this.canvas.toDataURL('png'));
    },
    exportCanvas: function() {
      var s = JSON.stringify(this.canvas)
      console.log(s);
    },
    changeBG: function() {
      var randomImage = '../static/' + Math.floor(1 + Math.random()*10) + '.jpg';
      var self = this;
      fabric.Image.fromURL(randomImage, function(img) {
        self.canvas.backgroundImage = img;
        self.canvas.backgroundImage.width = 800;
        self.canvas.backgroundImage.height = 600;
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
