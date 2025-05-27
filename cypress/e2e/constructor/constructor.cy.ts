import { URL } from '@api';
import { deleteCookie, setCookie } from '../../../src/utils/cookie';

const setupTests = () => {
  setCookie('accessToken', 'Bearer test-token');
  localStorage.setItem('refreshToken', 'test-refresh-token');
  cy.intercept('GET', `${URL}//auth/user`, {fixture: 'user.json'}).as('getUser');
  cy.intercept('GET', `${URL}/ingredients`, {fixture: 'ingredients.json'}).as('getIngredients');
  cy.visit('');
};

const cleanupTests = () => {
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
};

describe('Burger Constructor Tests', () => {
  beforeEach(setupTests);
  afterEach(cleanupTests);

  context('Ingredient Tests', () => {
    it('Should load ingredients correctly', () => {
      cy.wait('@getUser');
      cy.get('[data-cy="constructor"]').as('burgerConstructor');
      
      cy.addIngredient('Булки');
      cy.addIngredient('Начинки');

      cy.get('@burgerConstructor').should('contain', 'Краторная булка N-200i');
      cy.get('@burgerConstructor').should('contain', 'Биокотлета из марсианской Магнолии');
    });
  });

  context('Modal Tests', () => {
    it('Should handle modal operations', () => {
      cy.wait('@getUser');
      cy.get('[data-cy="ingredient-item"]').first().click();
      
      cy.get('[data-cy="modal"]').as('modalWindow')
        .should('exist')
        .should('contain', 'Краторная булка N-200i');

      cy.get('[data-cy="modal-close"]').click();
      cy.get('@modalWindow').should('not.exist');
    });
  });

  context('Order Tests', () => {
    it('Should create order successfully', () => {
      cy.wait('@getUser');
      cy.intercept('POST', `${URL}/orders`, {fixture: 'order.json'}).as('createOrder');
      
      cy.get('[data-cy="constructor"]').as('burgerConstructor');
      cy.addIngredient('Булки');
      cy.addIngredient('Начинки');
      cy.get('@burgerConstructor').find('button').click({ multiple: true, force: true });

      cy.get('[data-cy="modal"]').as('orderModal')
        .should('exist')
        .should('contain', '66666');

      cy.get('[data-cy="modal-close"]').click();
      cy.get('@orderModal').should('not.exist');
      cy.wait('@createOrder');
    });
  });
});