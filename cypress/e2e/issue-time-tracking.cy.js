describe('Issue create and time track', () => {
    const Reporter = '[data-testid="select:reporterId"]';
    const description = 'This is my time track'
    const title = 'Timetrack';
    const Success = 'Issue has been successfully created.';
    const Submit = 'button[type="submit"]';

    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board?modal-issue-create=true');

            //POM method made 10h estimation disappear 
            //Will create issue manually

            cy.get('.ql-editor').type(description)
            cy.get(Reporter).should('be.visible').and('contain', 'Lord Gaben');
            cy.get('input[name="title"]').type(title).should('exist');

            cy.get(Submit).click();
            cy.get(Submit).should('not.exist');

            cy.get('[data-testid="modal:issue-create"]').should('not.exist');

            cy.contains(Success).should('be.visible');
            cy.reload();
            cy.contains(Success).should('not.exist');

            cy.get('[data-testid="board-list:backlog"]').should('be.visible');
            cy.get('[data-testid="list-issue"]').first().contains(title).click();
            cy.get('[data-testid="modal:issue-details"]').should('be.visible');
        });
    });

    it('Should add, update and remove estimation', () => {
        //Make sure no time is logged yet in Timetrack ticket
        cy.get('[data-testid="modal:issue-details"]').should('contain', 'No time logged');

        //Adding estimated hrs and making sure it is visible
        cy.get('input[placeholder="Number"]').type('10{enter}');
        cy.contains('10h estimated', { timeout: 10000 }).should('be.visible');

        //Close the ticket, open again and make sure time estimation is present
        cy.get('[data-testid="icon:close"]').first().click();
        cy.get('[data-testid="board-list:backlog"]').should('be.visible');
        cy.get('[data-testid="list-issue"]').first().click();

        cy.get('[data-testid="modal:issue-details"]').should('be.visible');
        cy.get('input[placeholder="Number"]').should('have.value', '10').and('be.visible');

        //Updating the estimation
        cy.get('input[placeholder="Number"]').clear().type('20{enter}');
        cy.contains('20h estimated', { timeout: 10000 }).should('be.visible');

        //Closing and reopening updated estimation
        cy.get('[data-testid="icon:close"]').first().click();
        cy.get('[data-testid="board-list:backlog"]').should('be.visible');
        cy.get('[data-testid="list-issue"]').first().click();

        cy.get('[data-testid="modal:issue-details"]').should('be.visible');
        cy.get('input[placeholder="Number"]').should('have.value', '20').and('be.visible');

        //Remove estimation and close the ticket
        cy.get('input[placeholder="Number"]').clear().type('{enter}');
        cy.get('[data-testid="modal:issue-details"]').should('contain', 'No time logged');
        cy.get('[data-testid="icon:close"]').first().click()

        //Open ticket and placeholder "Number" is visible
        cy.contains('Timetrack').click();
        cy.get('[data-testid="modal:issue-details"]').should('be.visible');
        cy.get('input[placeholder="Number"]').should('have.value', "").and('be.visible')

    });

    it('Should check time logging functionality', () => {

        //User fills in Time spent and Time remaining
        cy.get('[data-testid="modal:issue-details"]').should('be.visible');
        cy.get('[data-testid="icon:stopwatch"]').click();
        cy.get('[data-testid="modal:tracking"]').should('be.visible');

        cy.get('input[placeholder="Number"]').eq(1).clear().type('2{enter}');
        cy.get('input[placeholder="Number"]').eq(2).clear().type('5{enter}');

        cy.get('[data-testid="modal:tracking"]').contains('Done').click();

        //Spent time number and time remaining are visible in the time tracking section
        cy.get('[data-testid="icon:stopwatch"]').next().should('contain', '2h logged')
            .should('not.contain', 'No time logged').and('contain', '5h remaining');

        //User opens time track again and removed the time
        cy.get('[data-testid="modal:issue-details"]').should('be.visible');
        cy.get('[data-testid="icon:stopwatch"]').click();
        cy.get('[data-testid="modal:tracking"]').should('be.visible');

        cy.get('input[placeholder="Number"]').eq(1).clear().type('{enter}');
        cy.get('input[placeholder="Number"]').eq(2).clear().type('{enter}');

        cy.get('[data-testid="modal:tracking"]').contains('Done').click();

        //Spent time and time remaining is removed from the issue view
        cy.get('[data-testid="icon:stopwatch"]').next().should('not.contain', '2h logged')
            .should('contain', 'No time logged').and('not.contain', '5h remaining');
    });

});