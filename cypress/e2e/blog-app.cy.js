describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3000/api/test/reset");
    cy.createUser({ name: "Pöpö", username: "pöp123", password: "unsecure" });
    cy.visit("http://localhost:5000");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.contains("login").click();
      cy.get("#username").type("pöp123");
      cy.get("#password").type("unsecure");
      cy.get("#login-button").click();
      cy.contains("Pöpö logged in");
      cy.contains("Login successful");
    });

    it("fails with incorrect credentials", function () {
      cy.contains("login").click();
      cy.get("#username").type("pöp123");
      cy.get("#password").type("aoeu");
      cy.get("#login-button").click();
      cy.contains("Incorrect username or password");
      cy.get("html").should("not.contain", "Pöpö logged in");
    });
  });

  describe("when logged in", function () {
    beforeEach(function () {
      cy.login({ username: "pöp123", password: "unsecure" });
    });

    it("user can create blog", function () {
      cy.contains("create new").click();
      cy.get("#blog-title").type("Somewhere...");
      cy.get("#blog-author").type("me");
      cy.get("#blog-url").type("pumppi.dev");
      cy.get("#create-blog").click();

      cy.contains("Somewhere...");
    });

    it("user can like blog", function () {
      cy.createBlog({
        title: "Dvorak",
        author: "me, still",
        url: "dvorak.pumppi.dev",
      });
      cy.contains("Dvorak");

      cy.get(".toggle-blog-visibility").click();
      cy.contains("likes 0");
      cy.get(".like-blog").click();
      cy.contains("likes 1");
    });

    it("user that created the blog can delete it", function () {
      cy.createBlog({
        title: "Colemak",
        author: "Guess it lol",
        url: "colemak.pumppi.dev",
      });
      cy.get(".toggle-blog-visibility").click();
      cy.contains("Colemak");
      cy.get(".remove-blog").click();
      cy.contains("Colemak").should("not.exist");
    });

    it("other users' blogs don't display delete button", function () {
      cy.createBlog({
        title: "DAS",
        author: "Still asking..?",
        url: "das.pumppi.dev",
      });
      cy.get(".toggle-blog-visibility").click();
      cy.contains("remove").should("be.visible");
      cy.createUser({
        name: "HIIH",
        username: "hih",
        password: "totallysecure",
      });
      cy.login({ username: "hih", password: "totallysecure" });
      cy.get(".toggle-blog-visibility").click();
      //cy.get("#remove-blog").should("not.exist");
      cy.contains("remove").should("not.be.visible");
    });

    it("blogs should be sorted by likes", function () {
      cy.createBlog({
        title: "Dvorak",
        author: "me, still",
        url: "dvorak.pumppi.dev",
      });
      cy.createBlog({
        title: "Colemak",
        author: "Guess it lol",
        url: "colemak.pumppi.dev",
      });
      cy.createBlog({
        title: "DAS",
        author: "Still asking..?",
        url: "das.pumppi.dev",
      });
      cy.get(".toggle-blog-visibility").each((button, index, list) => {
        cy.wrap(button).click();
      });
      cy.get(".like-blog").each((button, index, list) => {
        console.log(button, index, list);
        for (let i = 0; i < index; i++) {
          cy.wrap(button).click();
          cy.wrap(button)
            .parent()
            .should("contain", "likes " + (i + 1));
        }
      });
      cy.reload();
      cy.get(".blog").eq(0).should("contain", "Dvorak");
      cy.get(".blog").eq(1).should("contain", "Colemak");
      cy.get(".blog").eq(2).should("contain", "DAS");
    });
  });
});
