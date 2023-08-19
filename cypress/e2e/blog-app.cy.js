describe("Blog app", function() {
  beforeEach(function() {
    cy.request("POST", "http://localhost:3000/api/test/reset");

    const user = {
      name: "Pöpö",
      username: "pöp123",
      password: "unsecure"
    }

    cy.request("POST", "http://localhost:3000/api/users", user);
    cy.visit("http://localhost:5000");
  });

  it("front-page can be opened", function() {
    cy.contains("Blogs");
    cy.contains("List of blogs");
  });

  it("user can log in", function() {
    cy.get("#show-login").click();
    cy.get("#username").type("pöp123");
    cy.get("#password").type("unsecure");
    cy.get("#login-button").click();
    cy.contains("Pöpö logged in");
  });

  describe("when logged in", function() {
    beforeEach(function() {
      cy.get("#show-login").click();
      cy.get("#username").type("pöp123");
      cy.get("#password").type("unsecure");
      cy.get("#login-button").click();
    });

    it("user can create blog", function() {
      console.log("hi lol");
    });

    it("user can like blog", function() {
      console.log("sometime soon this will be done");
    });

    it("user can delete blog", function() {
      console.log("Lol just wait");
    });
  })
});
