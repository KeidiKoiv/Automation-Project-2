describe('Issue details editing', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board');
      cy.contains('This is an issue of type: Task.').click();
    });
  });

  it('Should update type, status, assignees, reporter, priority successfully', () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:type"]').click('bottomRight');
      cy.get('[data-testid="select-option:Bug"]')
        .trigger('mouseover')
        .trigger('click');
      cy.get('[data-testid="select:type"]').should('contain', 'Bug');

      cy.get('[data-testid="select:status"]').click('bottomRight');
      cy.get('[data-testid="select-option:Done"]').click();
      cy.get('[data-testid="select:status"]').should('have.text', 'Done');

      cy.get('[data-testid="select:assignees"]').click('bottomRight');
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('[data-testid="select:assignees"]').click('bottomRight');
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:assignees"]').should('contain', 'Baby Yoda');
      cy.get('[data-testid="select:assignees"]').should('contain', 'Lord Gaben');

      cy.get('[data-testid="select:priority"]').click('bottomRight');
      cy.get('[data-testid="select-option:Highest"]').click();
      cy.get('[data-testid="select:priority"]').should('have.text', 'Highest');
    });
  });

  it('Should update title, description successfully', () => {
    const title = 'TEST_TITLE_KEIDI123';
    const description = 'TEST_DESCRIPTION_KEIDI123';

    getIssueDetailsModal().within(() => {
      cy.get('textarea[placeholder="Short summary"]')
        .clear()
        .type(title)
        .blur();

      cy.get('.ql-snow')
        .click()
        .should('not.exist');

      cy.get('.ql-editor').clear().type(description);

      cy.contains('button', 'Save')
        .click()
        .should('not.exist');

      cy.get('textarea[placeholder="Short summary"]').should('have.text', title);
      cy.get('.ql-snow').should('have.text', description);
    });
  });

  const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
});


//Bonus task - Task 1

describe('Issue Details Edit Page - Priority Dropdown', () => {
  const expectedLength = 5;
  let priorityOptions = [];

  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board');
      cy.contains('This is an issue of type: Task.').click();
    });
  });

  it('should validate values in issue priorities', () => {
    // Access the initially selected priority value and push it into the array
    cy.get('[data-testid="select:priority"]').then(($priorityDropdown) => {
      const selectedPriority = $priorityDropdown.text().trim();
      priorityOptions.push(selectedPriority);

      // Open the priority dropdown
      cy.get('[data-testid="select:priority"]').click();

      // Access the list of all priority options
      cy.get('[data-testid^="select-option"]').each(($option) => {
        const optionText = $option.text().trim();
        priorityOptions.push(optionText);

        // Print out added value and length of the array during each iteration
        cy.log(`Added value: ${optionText}, Array length: ${priorityOptions.length}`);
      }).then(() => {
        // Assert that the created array has the same length as the predefined number
        expect(priorityOptions.length).to.equal(expectedLength);
      });
    });
  });
});

//Bonus task 2

describe('Issue Details Edit Page - Reporter Name', () => {
  const pattern = /^[A-Za-z\s]*$/
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board');
      cy.contains('This is an issue of type: Task.').click();
    });
  });

  it.only('should contain only characters in reporter name', () => {
    // Access reporter name and get its text value
    cy.get('[data-testid="select:reporter"]').invoke('text').then((reporterName) => {
      // Assert that reporter name has only characters using regex
      expect(reporterName.trim()).to.match(/^[A-Za-z\s]*$/);
    });
  });
});