context('Integration', () => {
  it('should upvote a recommendation', () => {
    cy.visit('http://localhost:3000');
    cy.get('#cy-score')
      .invoke('text')
      .then(parseInt)
      .then((prev) => {
        cy.get('#cy-upvote-btn').click();
        cy.get('#cy-score')
          .invoke('text')
          .then(parseInt)
          .then((next) => {
            expect(next).to.equal(prev + 1);
          });
      });
  });

  it('should downvote a recommendation', () => {
    cy.visit('http://localhost:3000');
    cy.get('#cy-score')
      .invoke('text')
      .then(parseInt)
      .then((prev) => {
        cy.get('#cy-downvote-btn').click();
        cy.get('#cy-score')
          .invoke('text')
          .then(parseInt)
          .then((next) => {
            expect(next).to.equal(prev - 1);
          });
      });
  });
});
