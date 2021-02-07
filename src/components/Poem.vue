<template>
  <div class="poem">
    <p v-show="isFinnish">Tuplaklikkaamalla taustakuvaa voit lisätä sanoja. Voit arpoa uuden sanan tai poistaa nykyisiä. Tuplaklikkaamalla sanaa voit muokata sitä kirjoittamalla, jolloin esim. sanan taivutus onnistuu.</p>
    <p v-show="isFinnish">Jos haluat poistaa runosi, ole hyvä ja ota yhteyttä <a href="mailto:ronja@sisuisa.fi">ronja@sisuisa.fi</a></p>
    <p v-show="isFinnish">Taustakuvat: <a href="https://unsplash.com/">Unsplash.com</a></p>
    <p v-show="!isFinnish">You can add new words by double-clicking the background. To select a word, click it once. You can edit the currently selected word via the buttons, by re-rolling a new random word, or by deleting it. You can edit the word and write your own custom words by double-clicking one.</p>

    <canvas id="canvas" width="800" height="600"></canvas>
    <word v-for="item in wordlist" v-bind:type="item" :lang="language" :canvas="canvas"></word>

    <label for="name" >Nimesi (vapaaehtoinen)
    <input id="name" type="text"  v-model="authorName"></label>
    <br>

    <button v-show="!uploading" @click="saveCanvas()"><p v-show="isFinnish">Lähetä galleriaan</p><p v-show="!isFinnish">Upload to gallery</p></button><i v-show="uploading" class="fa fa-spinner fa-spin"></i>

    <button v-show="!changingBG" @click="changeBG()"><p v-show="isFinnish">Vaihda taustakuva</p><p v-show="!isFinnish">Change background image</p></button><i v-show="changingBG" class="fa fa-spinner fa-spin"></i>
    <button @click="saveToPC()"><p v-show="isFinnish">Tallenna koneelle</p><p v-show="!isFinnish">Save locally</p></button>
  </div>
</template>

<script>
import Word from './Word'


export default {
  name: 'poem',
  data () {
    return {
      wordlist: [],
      canvas: {},
      uploading: false,
      changingBG: false,
      authorName: "",
    }
  },

  props: {
    language: String
  },

  computed: {
    isFinnish: function () {
      return this.language === "FI"
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
        var wordclassesFin = ["adjectives", "verbs", "substantives", "misc", "misc"];
        var wordclassesEng = ["adjectivesEng", "verbsEng", "substantivesEng", "miscEng", "miscEng"];
        if(this.isFinnish) {
          var wordclasses = wordclassesFin;
        } else {
          var wordclasses = wordclassesEng;
        }

        var wordType = wordclasses[Math.floor(Math.random()*wordclasses.length)];
        this.wordlist.push({ type: wordType, startPos: coord });
      } else {
        this.wordlist.push({ type: type, startPos: coord });
      }
    },
    askName: function() {
      var self = this;
      self.askName = true;
    },
    saveCanvas: function() {
      var self = this;
      self.uploading = true;
      console.log(this.wordlist);

      var imageData = this.canvas.toDataURL({ format: 'png', multiplier: 0.5, width: 800, height: 600 });
      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'upload', true);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.onload = function () {
        if (xhr.status === 200) {
          alert('Uploaded ok');
        } else {
          alert('An error occurred!');
        }
        self.uploading = false;
      };
      var data = JSON.stringify({ "image": imageData, "langFI": self.isFinnish, "author": self.authorName });
      xhr.send(data);
    },
    saveToPC: function() {
      var self = this;
      var imageData = this.canvas.toDataURL('png');
      window.open(imageData);
    },
    changeBG: function() {
      var self = this;
      this.changingBG = true;
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'bg', true);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.onload = function () {
        if (xhr.status === 200) {
          fabric.Image.fromURL(xhr.response, function(img) {
            self.canvas.backgroundImage = img;
            self.canvas.backgroundImage.width = 800;
            self.canvas.backgroundImage.height = 600;
            self.canvas.renderAll();
            self.changingBG = false;
          }, {crossOrigin: "anonymous"});
        } else {
          self.changingBG = false;
        }
      };
      xhr.send();
    }
  }
}
</script>

<style>
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

.canvas-container {
   margin: 0 auto !important;
   padding-bottom: 2em;
}

a {
  color: #42b983;
}
</style>
