describe('Issue create', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', 'https://jira.ivorreic.com/project').then((url) => {
      //System will already open issue creating modal in beforeEach block  
      cy.visit(url + '/board?modal-issue-create=true');
    });
  });

  //Task 1

  it('Should create an issue and validate it successfully', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {

      //Open issue type dropdown, write "Bug" in text box and click
      cy.get('[data-testid="select:type"]').click();
      cy.get('input[class="sc-Rmtcm gJIJXg"]').first().click()
        .type('Bug')
      cy.get('[data-testid="select-option:Bug"]')
        .trigger('click');
      cy.get('[data-testid="select:type"]').should('contain', 'Bug');

      //Set new priority by typing Highest to the text box
      cy.get('[data-testid="select:priority"]').click();
      cy.get('input[class="sc-Rmtcm gJIJXg"]').last().click()
        .type('Highest')
      cy.get('[data-testid="select-option:Highest"]').click();
      cy.get('[data-testid="select:priority"]').should('have.text', 'Highest');

      //Type value to description input field
      cy.get('.ql-editor').type('My bug description');

      //Type value to title input field
      //Order of filling in the fields is first description, then title on purpose
      //Otherwise filling title first sometimes doesn't work due to web page implementation
      cy.get('input[name="title"]').type('Bug');

      //Select Pickle Rick from reporter dropdown
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:reporterId"]').should('contain', 'Pickle Rick');

      //Add new assignee Pickle Rick - for practice purposes
      cy.get('[data-testid="select:userIds"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:userIds"]').should('contain', 'Pickle Rick');

      //Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    //Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');

    //Reload the page to be able to see recently created issue
    //Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    //Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
      //Assert that this list contains 5 issues and first element with tag p has specified text
      cy.get('[data-testid="list-issue"]')
        .should('have.length', '5')
        .first()
        .find('p')
        .contains('Bug');
      //Assert that correct avatar and type icon are visible
      cy.get('[data-testid="avatar:Pickle Rick"]').should('be.visible');
      cy.get('[data-testid="icon:bug"]').should('be.visible');
    });
  });

  it('Should validate title is required field if missing', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      //Try to click create issue button without filling any data
      cy.get('button[type="submit"]').click();

      //Assert that correct error message is visible
      cy.get('[data-testid="form-field:title"]').should('contain', 'This field is required');
    });
  });
});

// Task 2

import { faker } from '@faker-js/faker';
describe('Issue create', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', 'https://jira.ivorreic.com/project').then((url) => {
      //System will already open issue creating modal in beforeEach block  
      cy.visit(url + '/board?modal-issue-create=true');
    });
  });

  it('should fill in a form with fake data', () => {

    cy.get('[data-testid="modal:issue-create"]').within(() => {

      //Make sure issue type Task is already set
      cy.get('.sc-iqzUVk.cUBVJX').contains('Task')

      //Set new priority by typing Low to the text box
      cy.get('[data-testid="select:priority"]').click();
      cy.get('input[class="sc-Rmtcm gJIJXg"]').last().click()
        .type('Low')
      cy.get('[data-testid="select-option:Low"]').click();
      cy.get('[data-testid="select:priority"]').should('have.text', 'Low');

      // Generate a fake bug description
      const fakeSentence = faker.lorem.sentence();

      // Generate a fake one-word title
      const fakeTitle = faker.lorem.word();

      // Fill in the form fields with fake data
      cy.get('.ql-editor').type(fakeSentence);
      cy.get('input[name="title"]').type(fakeTitle);


      //Select Pickle Rick from reporter dropdown
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:reporterId"]').should('contain', 'Baby Yoda');

      //Click on button "Create issue"
      cy.get('button[type="submit"]').click();

    });

    //Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');

    //Reload the page to be able to see recently created issue
    //Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    //Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
      //Assert that this list contains 5 issues and first element with tag p has specified text
      cy.get('[data-testid="list-issue"]')
        .should('have.length', '5')
        .first()
        .find('p')
        .contains('fakeTitle')
      //Assert that correct type icon is visible
      cy.get('[data-testid="icon:task"]').should('be.visible');
    });
  })
})