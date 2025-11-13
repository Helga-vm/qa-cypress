// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
    return originalFn(url, {
        ...options,
        auth: {
            username: "guest",
            password: "welcome2qauto",
        },
    });
});

Cypress.Commands.overwrite('type', (originalFn, element, text, options) => {
  if (options && options.sensitive) {
    // turn off original log
    options.log = false
    // create our own log with masked message
    Cypress.log({
      $el: element,
      name: 'type',
      message: '*'.repeat(text.length),
    })
  }

  return originalFn(element, text, options)
});


Cypress.Commands.add('login', (email,password,shouldRemember) => {
    cy.visit("/");
    cy.get("header .header_signin").click();
    cy.get(".modal-content").within(()=>{
        cy.get("#signinEmail").type(email,{ sensitive: false });
        cy.get("#signinPassword").type(password,{ sensitive: true });
        if (shouldRemember){
            cy.get("#remember").check();
        }
        cy.get(".btn-primary").should('be.visible').click();
    });
    
});