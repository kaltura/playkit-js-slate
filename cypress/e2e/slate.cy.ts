import { loadPlayer } from './utils';

describe('Slate plugin', () => {
  describe('add API', () => {
    it('should add a slate with default capabilities', () => {
      loadPlayer().then((player) => {
        player.getService('slateManager')?.add({
          title: 'Slate title',
          message: 'Slate message'
        });
        cy.get('[data-testid="slate_root"]').should('exist');
        cy.get('[data-testid="slate_spinner_container"]').should('exist');
        cy.get('[data-testid="slate_title"]').should('exist').should('have.text', 'Slate title');
        cy.get('[data-testid="slate_message"]').should('exist').should('have.text', 'Slate message');
        cy.get('[data-testid="slate_dismissButton"]').should('exist');
        cy.get('.playkit-close-overlay').should('exist');
        cy.get('[data-testid="slate_customizedActionButton"]').should('not.exist');
      });
    });

    it('should add a slate without spinner', () => {
      loadPlayer().then((player) => {
        player.getService('slateManager')?.add({
          title: 'Slate title',
          message: 'Slate message',
          showSpinner: false
        });
        cy.get('[data-testid="slate_root"]').should('exist');
        cy.get('[data-testid="slate_spinner_container"]').should('not.exist');
      });
    });

    it('should add a slate without dismiss button', () => {
      loadPlayer().then((player) => {
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
      loadPlayer().then((player) => {
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
      loadPlayer().then((player) => {
        player.getService('slateManager')?.add({
          title: 'Slate title',
          message: 'Slate message'
        });
        cy.get('[data-testid="slate_root"]').should('exist');
        cy.get('[data-testid="slate_dismissButton"]').should('exist').click({ force: true });
        cy.get('[data-testid="slate_root"]').should('not.exist');
      });
    });

    it('should add a slate with customized action button', () => {
      loadPlayer().then((player) => {
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
      loadPlayer().then((player) => {
        player.getService('slateManager')?.add({});
        cy.get('[data-testid="slate_root"]').should('exist');
        cy.get('[data-testid="slate_title"]').should('not.exist');
        cy.get('[data-testid="slate_message"]').should('not.exist');
      });
    });

    it('should add a slate with background image', () => {
      loadPlayer().then((player) => {
        player.getService('slateManager')?.add({
          backgroundImageUrl:
            'https://cfvod.kaltura.com/p/3188353/sp/318835300/thumbnail/entry_id/1_vznuyyho/width/640/quality/100'
        });
        cy.get('[data-testid="slate_overlay_wrapper"]')
          .should('exist')
          .should('have.css', 'background')
          .and('include', 'https://cfvod.kaltura.com/p/3188353/sp/318835300/thumbnail/entry_id/1_vznuyyho/width/640/quality/100');
      });
    });

    it('should add a slate and remove it after 2 seconds, per timeout option', () => {
      loadPlayer().then((player) => {
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
      loadPlayer().then((player) => {
        player.getService('slateManager')?.add();
        cy.get('[data-testid="slate_root"]').should('exist');
        cy.wait(500).then(() => {
          player.getService('slateManager')?.remove();
          cy.get('[data-testid="slate_root"]').should('not.exist');
        });
      });
    });
  });

  // ADA-3053: keyboard users could not reach or activate the slate buttons
  describe('accessibility', () => {
    const gradebookSlateOptions = {
      title: 'Well done!',
      message: 'Your score is now documented in the gradebook',
      showDismissButton: false,
      showCloseButton: false,
      showSpinner: false,
      customizedActionButtonText: 'Done'
    };

    it('should move focus into the slate content when the slate opens', () => {
      loadPlayer().then((player) => {
        player.getService('slateManager')?.add(gradebookSlateOptions);
        cy.get('[data-testid="slate_content"]').should('exist').should('have.focus');
      });
    });

    it('should keep the customized action button focusable inside the focused slate', () => {
      loadPlayer().then((player) => {
        player.getService('slateManager')?.add(gradebookSlateOptions);
        cy.get('[data-testid="slate_content"]').should('have.focus');
        cy.get('[data-testid="slate_customizedActionButton"]').should('exist').focus().should('have.focus');
      });
    });

    it('should dispatch SlateCustomButtonClicked when the action button is activated by keyboard', () => {
      loadPlayer().then((player) => {
        const slateManager = player.getService('slateManager');
        const onCustomButtonClicked = cy.spy().as('onCustomButtonClicked');
        slateManager?.addEventListener('SlateCustomButtonClicked', onCustomButtonClicked);
        slateManager?.add(gradebookSlateOptions);
        cy.get('[data-testid="slate_customizedActionButton"]')
          .should('exist')
          .focus()
          .trigger('keydown', { keyCode: 13, key: 'Enter', bubbles: true });
        cy.get('@onCustomButtonClicked').should('have.been.calledOnce');
      });
    });

    it('should dispatch SlateCustomButtonClicked when the action button is activated with Space', () => {
      loadPlayer().then((player) => {
        const slateManager = player.getService('slateManager');
        const onCustomButtonClicked = cy.spy().as('onCustomButtonClickedSpace');
        slateManager?.addEventListener('SlateCustomButtonClicked', onCustomButtonClicked);
        slateManager?.add(gradebookSlateOptions);
        cy.get('[data-testid="slate_customizedActionButton"]')
          .should('exist')
          .focus()
          .trigger('keydown', { keyCode: 32, key: ' ', bubbles: true });
        cy.get('@onCustomButtonClickedSpace').should('have.been.calledOnce');
      });
    });

    it('should label and describe the dialog from the slate title and message', () => {
      loadPlayer().then((player) => {
        player.getService('slateManager')?.add({
          title: 'Slate title',
          message: 'Slate message',
          showSpinner: false
        });
        cy.get('[data-testid="slate_title"]')
          .invoke('attr', 'id')
          .then((titleId) => {
            cy.get('[data-testid="slate_message"]')
              .invoke('attr', 'id')
              .then((messageId) => {
                cy.get('[data-testid="slate_root"]')
                  .closest('[role="dialog"]')
                  .should('have.attr', 'aria-labelledby', titleId)
                  .should('have.attr', 'aria-describedby', messageId);
              });
          });
      });
    });
  });
});
