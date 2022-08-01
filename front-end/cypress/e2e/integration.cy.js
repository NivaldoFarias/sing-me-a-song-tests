/* eslint-disable cypress/no-unnecessary-waiting */
context('Populate tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('should create a new recommendation', () => {
    cy.get('#cy-form-name').type('CyPress New Recommendation');
    cy.get('#cy-form-link').type('https://youtu.be/7N63cMKosIE');
    cy.get('#cy-form-submit').click();

    cy.wait(1000);

    cy.visit('http://localhost:3000');
    cy.get('#cy-title').should('contain', 'CyPress New Recommendation');
  });
});

context('Unit tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('should upvote a recommendation', () => {
    cy.get('#cy-score')
      .invoke('text')
      .then(parseInt)
      .then((prev) => {
        cy.get('#cy-upvote-btn').click();
        cy.wait(1000);
        cy.get('#cy-score')
          .invoke('text')
          .then(parseInt)
          .then((next) => {
            expect(next).to.equal(prev + 1);
          });
      });
  });

  it('should downvote a recommendation', () => {
    cy.get('#cy-score')
      .invoke('text')
      .then(parseInt)
      .then((prev) => {
        cy.get('#cy-downvote-btn').click();
        cy.wait(1000);
        cy.get('#cy-score')
          .invoke('text')
          .then(parseInt)
          .then((next) => {
            expect(next).to.equal(prev - 1);
          });
      });
  });

  it('should display youtube video', () => {
    cy.get('#cy-videoplayer')
      .find('iframe')
      .should('have.attr', 'title', 'Cypress End-to-End Testing');
  });
});

context('Navigation menu tests', () => {
  it('should navigate to home page', () => {
    cy.visit('http://localhost:3000/top');
    cy.get('#cy-home-btn').click();
    cy.url().should('include', '/');
  });

  it('should navigate to trending page', () => {
    cy.visit('http://localhost:3000');
    cy.get('#cy-trending-btn').click();
    cy.url().should('include', '/top');
  });

  it('should navigate to a random recommendation', () => {
    cy.visit('http://localhost:3000');
    cy.get('#cy-shuffle-btn').click();
    cy.url().should('include', '/random');
  });
});
