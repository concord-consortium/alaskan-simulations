class Elements {

  getSimulation() {
    return cy.get(".simulation-view-simulationView");
  }
  getNewButton() {
    return cy.get(".button-buttonContainer").contains("New");
  }
  getPlayButton() {
    return cy.get(".button-buttonContainer").contains("Play");
  }
  getTrialsTable() {
    return cy.get(".table-tableContainer");
  }
}

export default Elements;
