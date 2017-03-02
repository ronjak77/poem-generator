<template>
  <div class="poem">
    <p>Tuplaklikkaamalla taustakuvaa voit lisätä sanoja. Voit arpoa uuden sanan tai poistaa nykyisiä. Tuplaklikkaamalla sanaa voit muokata sitä kirjoittamalla, jolloin esim. sanan taivutus onnistuu.</p>
    <canvas id="canvas" width="600" height="400"></canvas>
    <word v-for="item in wordlist" v-bind:type="item" :canvas="canvas"></word>

    <p>Valokuvaaja: <a :href="backgroundInfo.url">{{ backgroundInfo.author }}</a></p>
    <button v-show="!uploading" @click="saveCanvas()">Lähetä galleriaan</button><i v-show="uploading" class="fa fa-spinner fa-spin"></i>
    <button @click="changeBG()">Vaihda taustakuva</button>

  </div>
</template>

<script>
import Word from './Word'

var credits = {"arr": [
    {"id": "1", "url": "https://www.flickr.com/photos/juhoholmi/30118947266/", "title": "Jylkynoja 2", "author": "Juho Holmi"},
    {"id": "2", "url": "https://www.flickr.com/photos/67135676@N04/32462123610/", "title": "Forest", "author": "Minna Halonen"},
    {"id": "3", "url": "https://www.flickr.com/photos/80429160@N07/7879988542/", "title": "Forest", "author": "Daniela"},
    {"id": "4", "url": "https://www.flickr.com/photos/105637782@N04/10327378784/", "title": "Forest", "author": "Mariya Chorna"},
    {"id": "5", "url": "https://www.flickr.com/photos/a-herzog/15253502399/", "title": "autumn forest", "author": "Stiller Beobachter"},
    {"id": "6", "url": "https://www.flickr.com/photos/andrewmalone/6965495286/", "title": "Forest", "author": "Andrew Malone"},
    {"id": "7", "url": "https://www.flickr.com/photos/davidstrom/15516370872/", "title": "Forest", "author": "David Strom"},
    {"id": "8", "url": "https://www.flickr.com/photos/zsoolt/3545650978/", "title": "Forest", "author": "zsoolt"},
    {"id": "9", "url": "https://www.flickr.com/photos/neil_roger/3087249891/", "title": "Forest", "author": "neil roger"},
    {"id": "10", "url": "https://www.flickr.com/photos/foto-kouba/6299871278/", "title": "Primeval forest", "author": "Jaroslav Kuba"},
    {"id": "11", "url": "https://www.flickr.com/photos/three_if_by_bike/3063055501/", "title": "The Woods", "author": "ThreeIfByBike"},
    {"id": "12", "url": "https://www.flickr.com/photos/craigcloutier/3140160186/", "title": "deep dark forest", "author": "craig Cloutier"},
    {"id": "13", "url": "https://www.flickr.com/photos/damienz/7682053216/", "title": "Forest moment", "author": "Daniel Sjöström"},
    {"id": "14", "url": "https://www.flickr.com/photos/mladjenovic_n/8594411923/", "title": "1232 Forest", "author": "nebojsa mladjenovic"},
    {"id": "15", "url": "https://www.flickr.com/photos/miguelvirkkunen/10889431856/", "title": "Birch Forest", "author": "Miguel Virkkunen Carvalho"},
    {"id": "16", "url": "https://www.flickr.com/photos/andrein/2811470968/", "title": "woods", "author": "Andrei Niemimäki"},
    {"id": "17", "url": "https://www.flickr.com/photos/miguelvirkkunen/6280958247/", "title": "Forest Path", "author": "Miguel Virkkunen Carvalho"},
    {"id": "18", "url": "https://www.flickr.com/photos/villoks/6572345877/", "title": "Luminen metsä", "author": "Ville Oksanen"},
    {"id": "19", "url": "https://www.flickr.com/photos/villoks/6575100589/", "title": "metsä 029", "author": "Ville Oksanen"},
    {"id": "20", "url": "https://www.flickr.com/photos/alessandrogrussu/28330491011/", "title": "FIN_189 - Pyhä-Luosto", "author": "Alessandro Grussu"},
    {"id": "21", "url": "https://www.flickr.com/photos/david_e_smith/3240592407/", "title": "Winter forest, January 2009", "author": "Dave_S."},
    {"id": "22", "url": "https://www.flickr.com/photos/jannefoo/3242177422/", "title": "Lujabetonilta etelään", "author": "Janne"},
    {"id": "23", "url": "https://www.flickr.com/photos/jannefoo/4568614299/", "title": "Aurinko laskee harjun taakse", "author": "Janne"},
    {"id": "24", "url": "https://www.flickr.com/photos/miguelvirkkunen/11385819296/", "title": "Koli National Park", "author": "Miguel Virkkunen Carvalho"}
], "total": 24 }


export default {
  name: 'poem',
  data () {
    return {
      wordlist: [],
      canvas: {},
      backgroundInfo: {author: "placeholder", url: "www.site.com"},
      uploading: false
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
      var self = this;
      var imageData = this.canvas.toDataURL('png');
      var xhr = new XMLHttpRequest();
      this.uploading = true;
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
      var data = JSON.stringify({ "image": imageData });

      xhr.send(data);

    },
    changeBG: function() {
      var totalNum = credits.total;
      var randNum = Math.floor(1 + Math.random()*totalNum);
      var randomImage = '../static/' + randNum + '.jpg';
      this.backgroundInfo.author = credits.arr[randNum - 1].author;
      this.backgroundInfo.url = credits.arr[randNum - 1].url;
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
