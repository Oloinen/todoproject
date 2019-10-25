var express = require('express');
var router = express.Router();
//const bodyParser = require('body-parser');
const uuid = require('uuidv4').default;
const fs = require('fs');
let app = express();
//app.use(bodyParser.urlencoded({extended:true}));
//app.use(bodyParser());


//array, jotta saadaan json-tiedoston tiedot käyttöön
let tehtavat = [];
let nykyiset = [];
let tehdyt = [];
let tulevat =[];

//lukee json-tiedoston ja parseroi sen, jotta voidaan käyttää
fs.readFile('tehtavat.json', function(err, data) {
  try {
      tehtavat = JSON.parse(data.toString());
  } catch (err) {
    console.error("Ongelma tiedoston 'tehtavat.json' kanssa:", err.message);
  }
});

//Hakee ja renderöi kotisivun, jolle postaa json-tiedostosta tehtävät
router.get('/', function(req, res, next) {
  tulevat = tehtavat.filter(function(e) {
    return e.divide == 1;
  });
  nykyiset = tehtavat.filter(function(e) {
    return e.divide == 2;
  })
  tehdyt = tehtavat.filter(function(e) {
    return e.divide == 3;
  })
  res.render('index', {tulevat:tulevat, nykyiset:nykyiset, tehdyt:tehdyt});
});

//Post-toiminto, jolla voi lisätä tehtäviä listaan -> vastaanottaa käyttäjän syötteen ja lisää olion palvelimella olevaan arrayhyn
//Lisäksi ohjaa selaimen takaisin etusivulle, ettei selain jää roikkumaan /addtask-sivulle
router.post('/addtask', function(req, res, next) {
  req.body.teksti=req.body.teksti || "";
  req.body.urgent=req.body.urgent || false;
  let uusitehtava = req.body;
  uusitehtava.id = uuid();
  tehtavat.push(uusitehtava);
  saveTehtavat();
  res.redirect('/');
})

//Poistaa yhden tehtävän. Eli ensin tunnistaa id:n, vertaa sitä arrayhin, poimii sieltä vastaavan ja ottaa sen pois.
router.get('/delete', function(req, res) {
  console.log('poista' + req.query.id);
  for (let i=0; i<tehtavat.length;i++) {
    if (tehtavat[i].id == req.query.id) {
      tehtavat.splice(i, 1);
      saveTehtavat();
      break;
    }
  }
  if (req.body.divide==1) {
    for (let i=0; i<tulevat.length;i++) {
      if (tulevat[i].id == req.body.id) {
          tulevat.splice(i, 1);;
          break;
      }
    }
  }
  if (req.body.divide==2) {
    for (let i=0; i<tulevat.length;i++) {
      if (nykyiset[i].id == req.body.id) {
          nykyiset.splice(i, 1);;
          break;
      }
    }
  }
  if (req.body.divide==3) {
    for (let i=0; i<tulevat.length;i++) {
      if (tehdyt[i].id == req.body.id) {
          tehdyt.splice(i, 1);;
          break;
      }
    }
  }
  res.redirect('/');
})

//Tehtävän editointi. Lukee syötetyt tiedot ja luo niistä uuden olion -> vertaa saatua id:ta arrayhin -> korvaa arrayssa vastaavan id:n omaavan olion uudella, tässä luodulla oliolla. Ja siirtyy vielä sitten kotisivulle. 
router.post('/edit', function(req, res, next) {
  console.log(req.body)
  let uusitehtava = req.body;
  for (let i=0; i<tehtavat.length;i++) {
    if (tehtavat[i].id == req.body.id) {
      tehtavat[i] = uusitehtava;
      saveTehtavat();
      break;
    }
  }
  if (req.body.divide==1) {
    for (let i=0; i<tulevat.length;i++) {
      if (tulevat[i].id == req.body.id) {
          tulevat[i] = uusitehtava;
          break;
      }
    }
  }
  if (req.body.divide==2) {
    for (let i=0; i<tulevat.length;i++) {
      if (nykyiset[i].id == req.body.id) {
          nykyiset[i] = uusitehtava;
          break;
      }
    }
  }
  if (req.body.divide==3) {
    for (let i=0; i<tulevat.length;i++) {
      if (tehdyt[i].id == req.body.id) {
          tehdyt[i] = uusitehtava;
          break;
      }
    }
  }
  res.redirect('/');
})

router.post('/working', function(req, res, next) {
  let uusitehtava = req.body;
  for (let i=0; i<tehtavat.length;i++) {
    if (tehtavat[i].id == req.body.id) {
      tehtavat[i] = uusitehtava;
      saveTehtavat();
      break;
    }
  }
  res.redirect('/');
  console.log("tehtävän lokaatio muutettu")
})

router.post('/done', function(req, res, next) {
  let uusitehtava = req.body;
  for (let i=0; i<tehtavat.length;i++) {
    if (tehtavat[i].id == req.body.id) {
      tehtavat[i] = uusitehtava;
      saveTehtavat();
      res.redirect('/');
      console.log("tehtävän lokaatio muutettu")
      break;
    }
  }
})
//Tallentaa palvelimella olevan arrayn json-tiedostoon json-muodossa - kommentti
function saveTehtavat() {
  fs.writeFile('tehtavat.json', JSON.stringify(tehtavat), () => {console.log("Tehtävä lisätty luetteloon")});
}

module.exports = router;
