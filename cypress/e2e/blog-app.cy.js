describe("Blog app", function() {
  beforeEach(function() {
    cy.request("POST", "http://localhost:3000/api/test/reset");
    cy.createUser({ name: "Pöpö", username: "pöp123", password: "unsecure" });
    cy.visit("http://localhost:5000");
  });

  describe("Login", function() {
    it("succeeds with correct credentials", function() {
      cy.get("#show-login").click();
      cy.get("#username").type("pöp123");
      cy.get("#password").type("unsecure");
      cy.get("#login-button").click();
      cy.contains("Pöpö logged in");
      cy.contains("Login successful");
    });

    it("fails with incorrect credentials", function() {
      cy.get("#show-login").click();
      cy.get("#username").type("pöp123");
      cy.get("#password").type("aoeu");
      cy.get("#login-button").click();
      cy.contains("Incorrect username or password");
      cy.get("html").should("not.contain", "Pöpö logged in");
    })
  });

  describe("when logged in", function() {
    beforeEach(function() {
      cy.login({ username: "pöp123", password: "unsecure" })
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
