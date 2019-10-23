const request = require('supertest');
const app = require('../app');
const tehtava = require('../routes/index').tehtava

test("POST lisää tehtävän listaan", () => {
  const uusi = {task: "Tanssi ripaskaa"};
  return request(app)
  .post("/")
  .type('form')
  .send(uusi)
  .then(response => {
    expect(response.text).toMatch(/Tanssi ripaskaa/);
  });
});

test("hakee ja renderöi kotisivun", () => {
  return request(app)
  .get("/").then(response => {
   expect(response.statusCode).toBe(200); 
  });
});
