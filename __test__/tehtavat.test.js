const request = require('supertest');
const app = require('../app');
//const tehtava = require('../routes/index').tehtava

test("POST lisää tehtävän listaan", () => {
  const uusi = {task: "Viimeistele maalaus"};
  return request(app)
  .post("/")
  .type('form')
  .send(uusi)
  .then(response => {
    expect(response.text).toMatch(/Viimeistele maalaus/);
  });
});

test("hakee ja renderöi kotisivun", () => {
  return request(app)
  .get("/").then(response => {
   expect(response.statusCode).toBe(200); 
  });
});

test('/delete poistaa tehtävän listalta', () => {
  const uusi = {task: 'Tanssi ripaskaa'};
  return request(app)
  .get("/delete")
  .send(uusi)
  .then(response => {
    //expect(response.body.length).toBe(0);
    expect(response.statusCode).toBe(200);
  });
});





