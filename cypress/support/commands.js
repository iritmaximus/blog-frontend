// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("login", ({ username, password }) => {
  cy.request("POST", "http://localhost:3000/api/login", {
    username,
    password,
  }).then(({ body }) => {
    console.log("Response:", body);
    localStorage.setItem("token", JSON.stringify(body));
    cy.visit("http://localhost:5000");
  });
});

Cypress.Commands.add("createUser", ({ name, username, password }) => {
  const { body } = cy.request("POST", "http://localhost:3000/api/users", {
    name: name,
    username: username,
    password: password,
  });
});

Cypress.Commands.add("createBlog", ({ title, author, url }) => {
  const token = JSON.parse(localStorage.getItem("token")).token;
  console.log("token:", token);

  cy.request({
    method: "POST",
    url: "http://localhost:3000/api/blogs",
    headers: {
      Authorization: "Bearer " + token,
    },
    body: {
      title: title,
      author: author,
      url: url,
    },
  });
  cy.reload();
});
