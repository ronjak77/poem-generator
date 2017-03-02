<template>
</template>

<script>
var words = {
"adjectives": [
 "kaunis",
 "vihreä",
 "runsas",
 "kuulas",
 "viileä",
 "kultainen",
 "synkkä",
 "herkkä",
 "rehevä",
 "kellertävä",
 "kuulas",
 "herkkä",
 "elegantti",
 "multainen",
 "erityinen",
 "ainutlaatuinen",
 "energinen",
 "tuoksuva",
 "kasvava",
 "elävä",
 "voimakas",
 "rehevä",
 "räjähtävä",
 "hiuksenhieno",
 "tummanvihreä",
 "keväänvihreä",
 "taivaansininen",
 "hämärä",
 "synkkä",
 "musta",
 "tumma",
 "kylmä",
 "viileä",
 "kostea",
 "multaisa",
 "huojuva",
 "karhea",
 "ainutlaatuinen",
 "miehekäs",
 "naisellinen",
 "koskettava",
 "pistelevä",
 "kasvava",
 "kuhiseva",
 "kirkas",
 "ainoa",
 "ajankohtainen",
 "kahiseva",
 "riipaiseva",
 "runollinen",
 "uskalias",
 "ujo",
 "satumainen",
 "aavemainen",
 "autio",
 "yksinäinen",
 "tyhjä",
 "punertava",
 "maukas",
 "kypsyvä",
 "ikivanha",
 "aava",
 "aakea",
 "hiljainen",
 "koskematon",
 "hengellinen",
 "antoisa",
 "kallisarvoinen",
 "suomalainen",
 "kotimainen",
 "luonnollinen",
 "terveellinen",
 "kaiho",
 "surullinen",
 "uupunut",
 "vilkas",
 "nöyrä"
],
"verbs": [
 "poimia",
 "paistaa",
 "kaatua",
 "kasvaa",
 "herätä",
 "nousta",
 "koittaa",
 "uskaltaa",
 "mennä",
 "antaa",
 "joustaa",
 "elää",
 "nukkua",
 "painautua",
 "koskettaa",
 "kuulla",
 "unohtaa",
 "muistaa",
 "kasvattaa",
 "juosta",
 "kuultaa",
 "paistaa",
 "mennä",
 "laulaa",
 "kuulla",
 "rentoutua",
 "nauttia",
 "syödä",
 "kerätä",
 "kulkea",
 "vaeltaa",
 "hengähtää",
 "tuntea",
 "katsoa",
 "tarkkailla",
 "kuunnella",
 "huutaa",
 "piiloutua",
 "kadota",
 "hämärtyä",
 "kadottaa",
 "piilottaa",
 "löytää",
 "poimia",
 "kurottaa",
 "käpertyä",
 "istahtaa",
 "istua",
 "kulkea",
 "taivaltaa",
 "lipua",
 "hidastella",
 "kiiruhtaa",
 "hiljentyä",
 "jäljittää",
 "tuudittaa",
 "irroittaa",
 "havista",
 "visertää",
 "ulvoa",
 "kohista",
 "sataa",
 "myrskytä"
],
"substantives": [
 "koivu",
 "mänty",
 "metsä",
 "honka",
 "petäjä",
 "kangas",
 "sammal",
 "oksa",
 "käpy",
 "sieni",
 "lehti",
 "marja",
 "luonto",
 "elämä",
 "syksy",
 "kevät",
 "kesä",
 "talvi",
 "hanki",
 "lumi",
 "jälki",
 "orava",
 "eläin",
 "jänis",
 "hirvi",
 "poro",
 "karhu",
 "otso",
 "kallio",
 "kivi",
 "ravinto",
 "henki",
 "kehto",
 "lapsi",
 "poikanen",
 "susi",
 "muurahainen",
 "kanto",
 "eväät",
 "termospullo",
 "neulanen",
 "korpi",
 "metso",
 "teeri",
 "karpalo",
 "puolukka",
 "mustikka",
 "kukka",
 "nuppu",
 "aromi",
 "auringonvalo",
 "sade",
 "usva",
 "halla",
 "tihku",
 "sumu",
 "kumisaappaat",
 "kyy",
 "lintu",
 "eläin",
 "tiainen",
 "korppi",
 "sammal",
 "koski",
 "pelto",
 "laakso",
 "vaara",
 "pesä",
 "koti",
 "kolo",
 "vuori",
 "muisto",
 "hetki",
 "tuoksu",
 "savi",
 "kangas",
 "aurinko",
 "kuu",
 "tähdet",
 "taivas",
 "pilvet",
 "suo",
 "räme",
 "oja"
],
"misc": [
 "jos",
 "joskus",
 "kerran",
 "aina",
 "missä",
 "siellä",
 "kenet",
 "miksi",
 "emme",
 "voi",
 "minut",
 "sinut",
 "meidät",
 "teidät",
 "heidät",
 "kenen",
 "ainoa",
 "mennyt",
 "tuleva",
 "ken",
 "vaikka",
 "kuin",
 "kunnes",
 "asti",
 "joku",
 "jonkun",
 "jotain",
 "jollei",
 "minne",
 "milloin",
 "silloin",
 "siellä",
 "sinne",
 "siksi",
 "miksi",
 "miksei",
 "on",
 "eilinen",
 "tänään",
 "ikuinen",
 "aina",
 "ehkei",
 "ei",
 "kyllä",
 "ehkä",
 "jopa",
 "kuin"
]
};

export default {
  name: 'word',
  data () {
    return {
      word: "init",
      textElement: {},
      controlElement: {},
      elementGroup: {}
    }
  },

  props: ['type', 'canvas'],

  created: function () {
    var self = this;
    this.word = words[this.type.type][Math.floor(Math.random()*words[this.type.type].length)];

    this.textElement = new fabric.IText(this.word, {
      left: self.type.startPos.x,
      top: self.type.startPos.y,
      textBackgroundColor: 'rgb(0,0,0)',
      fill: 'rgb(255,255,255)',
      fontFamily: 'Courier',
      angle: (10-(Math.random()*20))
    });

    this.controlElement = new fabric.Text('Uusi\narvo', {
      fill: '#28b',
      fontSize: 25,
      fontFamily: 'Courier',
      textBackgroundColor: '#FFF',
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true,
      selectable: false,
      hoverCursor: 'pointer',
      visible: false
    });

    this.removalElement = new fabric.Text('Poista\nsana', {
      fill: '#F00',
      fontSize: 25,
      fontFamily: 'Courier',
      textBackgroundColor: '#FFF',
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true,
      selectable: false,
      hoverCursor: 'pointer',
      visible: false
    });

    this.canvas.add(this.textElement);
    this.canvas.add(this.controlElement);
    this.canvas.add(this.removalElement);
    this.moveControlElementsTo(this.textElement);
    this.canvas.renderAll();

    this.canvas.on('object:moving', function(evt) {
      if (evt.target === self.textElement) {
        self.moveControlElementsTo(evt.target);
      }
    });

    this.canvas.on('object:rotating', function(evt) {
      if (evt.target === self.textElement) {
        self.controlElement.setVisible(false);
        self.removalElement.setVisible(false);
      }
    });

    this.canvas.on('mouse:down', function(options) {
      if (options.target === self.controlElement) {
        self.refresh();
      } else if (options.target === self.removalElement) {
        self.textElement.remove();
        self.controlElement.remove();
        self.removalElement.remove();
      } else if (options.target === self.textElement) {
        self.controlElement.setVisible(true);
        self.removalElement.setVisible(true);
      } else {
        self.controlElement.setVisible(false);
        self.removalElement.setVisible(false);
      }
    });

    this.canvas.on('object:selected', function(options) {
      if (options.target === self.textElement) {
        self.controlElement.setVisible(true);
        self.removalElement.setVisible(true);
      }
    });
  },

  methods: {
    refresh: function() {
      var wordclasses = ["adjectives", "verbs", "substantives", "misc"];
      var wordType = wordclasses[Math.floor(Math.random()*wordclasses.length)];
      this.word = words[wordType][Math.floor(Math.random()*words[wordType].length)];
      this.textElement.setText(this.word);
      this.canvas.renderAll()
    },
    moveControlElementsTo: function(el) {
      this.controlElement.setLeft(el.getLeft() - 80);
      this.controlElement.setTop(el.getTop() - 40);
      this.controlElement.setCoords();

      this.removalElement.setLeft(el.getLeft() - 80);
      this.removalElement.setTop(el.getTop() + 40);
      this.removalElement.setCoords();

      this.canvas.renderAll()
    }
  }
}



</script>
