import Elements from "../../support/elements";

const e = new Elements;

context("Test the overall app", () => {
  beforeEach(() => {
    cy.visit("");
  });

  describe("initial elements", () => {
    it("verify initial elements load", () => {
      e.getSimulation().should("be.visible");
      e.getNewButton().should("be.visible");
      e.getPlayButton().should("be.visible");
      e.getTrialsTable().should("be.visible");
    });
  });
});
