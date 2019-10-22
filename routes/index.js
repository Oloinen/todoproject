var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
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
  res.render('index', { title: 'Express', tehtavat: tehtavat});
});

//Post-toiminto, jolla voi lisätä tehtäviä listaan -> vastaanottaa käyttäjän syötteen ja lisää olion palvelimella olevaan arrayhyn
router.post('/addtehtava', function(req, res, next) {
  res.render('tehtava', {tehtavat: tehtavat})
  let uusitehtava = req.body;
  tehtavat.push(uusitehtava);
  saveTehtavat();
  console.log("luodaan tehtävää");
  res.status(201);
  //res.json(uusitehtava);
  res.end();
})

//Tallentaa palvelimella olevan arrayn json-tiedostoon json-muodossa
function saveTehtavat() {
  fs.writeFile('tehtavat.json', JSON.stringify(tehtavat), () => {console.log("Tehtävä lisätty luetteloon")});
}

module.exports = router;
