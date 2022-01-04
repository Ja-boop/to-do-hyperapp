describe("Todo App", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8081");
  });

  it("Should display a list of persons", () => {
    cy.get("div.person").should("have.length", 5);
  });

  it("Selecting a person displays a bio", () => {
    cy.get(".person").first().click();
    cy.get(".bio").should("have.text", "harness real-time e-markets");
  });

  it("Checking an input highlight the person", () => {
    cy.get(".checkbox-test").first().check();
    cy.get("#app").children().first().should("have.class", "highlight");
  });

  it("Checking a person should not select them", () => {
    cy.get(".checkbox-test").first().check();
    cy.get("div.person").first().should("not.have.class", "selected");
  });

  it("The person selected should change when the user use the arrows keys", () => {
    cy.get(".person").first().click();
    cy.get("body").type("{downarrow}");
    cy.get(".person").first().should("not.have.class", "selected");
    cy.contains("div.person", "Ervin Howell").should("have.class", "selected");
    cy.wait(500);
    cy.get("body").type("{uparrow}");
    cy.get(".person").first().should("have.class", "selected");
  });
});
