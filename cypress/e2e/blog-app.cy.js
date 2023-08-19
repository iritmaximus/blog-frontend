describe("Blog app", function() {
  beforeEach(function() {
    cy.request("POST", "http://localhost:3000/api/test/reset");
    cy.createUser({ name: "Pöpö", username: "pöp123", password: "unsecure" });
    cy.visit("http://localhost:5000");
  });

  describe("Login", function() {
    it("succeeds with correct credentials", function() {
      cy.contains("login").click();
      cy.get("#username").type("pöp123");
      cy.get("#password").type("unsecure");
      cy.get("#login-button").click();
      cy.contains("Pöpö logged in");
      cy.contains("Login successful");
    });

    it("fails with incorrect credentials", function() {
      cy.contains("login").click();
      cy.get("#username").type("pöp123");
      cy.get("#password").type("aoeu");
      cy.get("#login-button").click();
      cy.contains("Incorrect username or password");
      cy.get("html").should("not.contain", "Pöpö logged in");
    })
  });

  describe("when logged in", function() {
    beforeEach(function() {
      cy.login({ username: "pöp123", password: "unsecure" });
    });

    it("user can create blog", function() {
      cy.contains("create new").click();
      cy.get("#blog-title").type("Somewhere...");
      cy.get("#blog-author").type("me");
      cy.get("#blog-url").type("pumppi.dev");
      cy.get("#create-blog").click();

      cy.contains("Somewhere...");
    });

    it("user can like blog", function() {
      cy.createBlog({ title: "Dvorak", author: "me, still", url: "dvorak.pumppi.dev" });
      cy.contains("Dvorak");

      cy.get("#toggle-blog-visibility").click();
      cy.contains("likes 0");
      cy.get("#like-blog").click();
      cy.contains("likes 1");
    });

    it("user can delete blog", function() {
      console.log("Lol just wait");
    });
  })
});
