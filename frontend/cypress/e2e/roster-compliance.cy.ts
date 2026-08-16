describe('Roster-Compliance-Check', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/trainers', { fixture: 'trainers.json' }).as('getTrainers');
    cy.intercept('GET', '**/rules', { fixture: 'rules.json' }).as('getRules');
    cy.visit('/check');
    cy.wait(['@getTrainers', '@getRules']);
  });

  it('zeigt Verstöße an, wenn das Team nicht regelkonform ist', () => {
    cy.intercept('POST', '**/compliance/check', { fixture: 'violation-result.json' }).as('checkRoster');

    cy.get('select').eq(0).select('t1');
    cy.get('select').eq(1).select('r1');
    cy.contains('button', 'Prüfen').click();

    cy.wait('@checkRoster');
    cy.contains('Verstoß/Verstöße gefunden').should('be.visible');
    cy.contains('Charizard').should('be.visible');
  });

  it('zeigt eine Erfolgsmeldung an, wenn das Team regelkonform ist', () => {
    cy.intercept('POST', '**/compliance/check', { isCompliant: true, violations: [] }).as('checkRoster');

    cy.get('select').eq(0).select('t2');
    cy.get('select').eq(1).select('Legendary Showdown');
    cy.contains('button', 'Prüfen').click();

    cy.wait('@checkRoster');
    cy.contains('Regelkonform').should('be.visible');
  });

  // --- Übungsaufgabe (Stage 5b in EXERCISE.md) --------------------------------
  // Schreibe einen weiteren Test, der prüft, dass der "Prüfen"-Button deaktiviert
  // ist, solange kein Trainer und keine Regel ausgewählt wurden.
  it("deaktiviert den Prüfen-Button ohne Auswahl", ()=>{
    cy.contains("button", "Prüfen").should("be.disabled")
  })
});
