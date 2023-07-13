/**
 * This is an example file and approach for POM in Cypress
 */
import IssueModal from "../../pages/IssueModal";

describe('Issue delete', () => {
  const issueTitle = 'This is an issue of type: Task.';

  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
      cy.contains(issueTitle).click();
    });
  });


  it('Should delete issue successfully', () => {
 
    IssueModal.getIssueDetailModal().then(($issueDetailModal) => {
      IssueModal.clickDeleteButton();
      IssueModal.confirmDeletion();
      IssueModal.ensureIssueIsNotVisibleOnBoard(issueTitle);
    });
  });

  it('Should cancel deletion process successfully', () => {
    
    IssueModal.getIssueDetailModal().then(($issueDetailModal) => {
      IssueModal.clickDeleteButton();
      IssueModal.cancelDeletion();
      IssueModal.closeDetailModal();
      IssueModal.ensureIssueIsVisibleOnBoard(issueTitle);
    });
  });
});