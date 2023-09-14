import {
  loadPlayer
} from './utils';

describe('Slate plugin', () => {
  describe('add API', () => {
    it('should add a slate with default capabilities', () => {
      loadPlayer().then(player => {
        player.getService('slateManager')?.add({
          title: 'Slate title',
          message: 'Slate message'
        });
        cy.get('[data-testid="slate_root"]').should('exist');
        cy.get('.slate-root .spinner-root').should('exist');
        cy.get('[data-testid="slate_title"]').should('exist').should('have.text', 'Slate title');
        cy.get('[data-testid="slate_message"]').should('exist').should('have.text', 'Slate message');
        cy.get('[data-testid="slate_dismissButton"]').should('exist');
        cy.get('.playkit-close-overlay').should('exist');
        cy.get('[data-testid="slate_customizedActionButton"]').should('not.exist');
      });
    });

    it('should add a slate without spinner', () => {
      loadPlayer().then(player => {
        player.getService('slateManager')?.add({
          title: 'Slate title',
          message: 'Slate message',
          showSpinner: false
        });
        cy.get('[data-testid="slate_root"]').should('exist');
        cy.get('.slate-root .spinner-root').should('not.exist');
      });
    });

    it('should add a slate without dismiss button', () => {
      loadPlayer().then(player => {
        player.getService('slateManager')?.add({
          title: 'Slate title',
          message: 'Slate message',
          showDismissButton: false
        });
        cy.get('[data-testid="slate_root"]').should('exist');
        cy.get('[data-testid="slate_dismissButton"]').should('not.exist');
      });
    });

    it('should add a slate without close overlay button', () => {
      loadPlayer().then(player => {
        player.getService('slateManager')?.add({
          title: 'Slate title',
          message: 'Slate message',
          showCloseButton: false
        });
        cy.get('[data-testid="slate_root"]').should('exist');
        cy.get('.playkit-close-overlay').should('not.be.visible');
      });
    });

    it('should close the overlay when clicking on dismiss button', () => {
      loadPlayer().then(player => {
        player.getService('slateManager')?.add({
          title: 'Slate title',
          message: 'Slate message'
        });
        cy.get('[data-testid="slate_root"]').should('exist');
        cy.get('[data-testid="slate_dismissButton"]').should('exist').click({force: true});
        cy.get('[data-testid="slate_root"]').should('not.exist');
      });
    });

    it('should add a slate with customized action button', () => {
      loadPlayer().then(player => {
        player.getService('slateManager')?.add({
          title: 'Slate title',
          message: 'Slate message',
          customizedActionButtonText: 'Custom button'
        });
        cy.get('[data-testid="slate_root"]').should('exist');
        cy.get('[data-testid="slate_customizedActionButton"]').should('exist').should('have.text', 'Custom button');
      });
    });

    it('should add a slate without title and message', () => {
      loadPlayer().then(player => {
        player.getService('slateManager')?.add({});
        cy.get('[data-testid="slate_root"]').should('exist');
        cy.get('[data-testid="slate_title"]').should('not.exist');
        cy.get('[data-testid="slate_message"]').should('not.exist');
      });
    });

    it('should add a slate with background image', () => {
      loadPlayer().then(player => {
        player.getService('slateManager')?.add({
          backgroundImageUrl: 'https://cfvod.kaltura.com/p/3188353/sp/318835300/thumbnail/entry_id/1_vznuyyho/width/640/quality/100'
        });
        cy.get('[data-testid="slate_root"]').should('exist');
        cy.get('.overlay-portal').should('have.css', 'background').and('include', 'https://cfvod.kaltura.com/p/3188353/sp/318835300/thumbnail/entry_id/1_vznuyyho/width/640/quality/100');
      });
    });

    it('should add a slate and remove it after 2 seconds, per timeout option', () => {
      loadPlayer().then(player => {
        player.getService('slateManager')?.add({
          timeout: 2000
        });
        cy.get('[data-testid="slate_root"]').should('exist');
        cy.wait(2000).then(() => cy.get('[data-testid="slate_root"]').should('not.exist'));
      });
    });
  });

  describe('remove API', () => {
    it('should remove a slate', () => {
      loadPlayer().then(player => {
        player.getService('slateManager')?.add();
        cy.get('[data-testid="slate_root"]').should('exist');
        cy.wait(500).then(() => {
          player.getService('slateManager')?.remove();
          cy.get('[data-testid="slate_root"]').should('not.exist');
        });
      });
    });
  });
});
