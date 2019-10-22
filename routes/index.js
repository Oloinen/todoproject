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
  console.log('Tehtävät luettu');
  tehtavat = JSON.parse(data);
  console.log(tehtavat);
})
/* GET home page. */
//Hakee ja renderöi kotisivun, jolle postaa json-tiedostosta tehtävät
router.get('/', function(req, res, next) {
  res.render('index', { title: 'To Do -lista', tehtavat: tehtavat});
});

//Post-toiminto, jolla voi lisätä tehtäviä listaan -> vastaanottaa käyttäjän syötteen ja lisää olion palvelimella olevaan arrayhyn
router.post('/', function(req, res, next) {
  let uusitehtava = req.body;
  uusitehtava.id = uuid();
  tehtavat.push(uusitehtava);
  res.render('index', {title: 'To Do -lista', tehtavat: tehtavat})
  saveTehtavat();
  console.log("luodaan tehtävää");
  console.log(req.query.id)
  //res.json(uusitehtava);
  //res.render('index', {tehtavat: tehtavat})
})

router.get('/delete', function(req, res) {
  console.log('poista' + req.query.id);
  for (let i=0; i<tehtavat.length;i++) {
    if (tehtavat[i].id == req.query.id) {
      tehtavat.splice(i, 1);
      saveTehtavat();
      return;
    }
  }
  res.render('index', {title: 'To Do -lista', tehtavat: tehtavat})
})

//Tallentaa palvelimella olevan arrayn json-tiedostoon json-muodossa
function saveTehtavat() {
  fs.writeFile('tehtavat.json', JSON.stringify(tehtavat), () => {console.log("Tehtävä lisätty luetteloon")});
}

module.exports = router;
