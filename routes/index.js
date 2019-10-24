var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const uuid = require('uuidv4').default;
const fs = require('fs');
let app = express();
app.use(bodyParser.json());

//array, jotta saadaan json-tiedoston tiedot käyttöön
let tehtavat = [];

//lukee json-tiedoston ja parseroi sen, jotta voidaan käyttää
fs.readFile('tehtavat.json', function(err, data) {
  try {
      tehtavat = JSON.parse(data.toString());
  } catch (err) {
    console.error("Ongelma tiedoston 'tehtavat.json' kanssa:", err.message);
  }
  console.log(tehtavat);
});

//Hakee ja renderöi kotisivun, jolle postaa json-tiedostosta tehtävät
router.get('/', function(req, res, next) {
  res.render('index', {tehtavat: tehtavat});
});

//Post-toiminto, jolla voi lisätä tehtäviä listaan -> vastaanottaa käyttäjän syötteen ja lisää olion palvelimella olevaan arrayhyn
//Lisäksi ohjaa selaimen takaisin etusivulle, ettei selain jää roikkumaan /addtask-sivulle
router.post('/addtask', function(req, res, next) {
  console.log(req.body)
  let uusitehtava = req.body;
  uusitehtava.id = uuid();
  tehtavat.push(uusitehtava);
  res.redirect('/');
  saveTehtavat();
})

//Poistaa yhden tehtävän. Eli ensin tunnistaa id:n, vertaa sitä arrayhin, poimii sieltä vastaavan ja ottaa sen pois.
router.get('/delete', function(req, res) {
  console.log('poista' + req.query.id);
  for (let i=0; i<tehtavat.length;i++) {
    if (tehtavat[i].id == req.query.id) {
      tehtavat.splice(i, 1);
      res.redirect('/');
      saveTehtavat();
      break;
    }
  }
})

//Tehtävän editointi. Lukee syötetyt tiedot ja luo niistä uuden olion -> vertaa saatua id:ta arrayhin -> korvaa arrayssa vastaavan id:n omaavan olion uudella, tässä luodulla oliolla. Ja siirtyy vielä sitten kotisivulle. 
router.post('/edit', function(req, res, next) {
  let uusitehtava = req.body;
  for (let i=0; i<tehtavat.length;i++) {
    if (tehtavat[i].id == req.body.id) {
      tehtavat[i] = uusitehtava;
      res.redirect('/');
      saveTehtavat();
      console.log("tehtävä vaihdettu")
      break;
    }
  }
})

//Tallentaa palvelimella olevan arrayn json-tiedostoon json-muodossa - kommentti
function saveTehtavat() {
  fs.writeFile('tehtavat.json', JSON.stringify(tehtavat), () => {console.log("Tehtävä lisätty luetteloon")});
}

// Lisäää textarea nappiiin jotenkin näin??
// //function addVal(obj) {
//   Object.keys(obj).forEach(function(name) {
//     document.querySelector('input[name="' + name + '"]').value = obj[name];    
//   });
// }

module.exports = router;
