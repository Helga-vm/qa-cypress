import { faker } from "@faker-js/faker";

describe("Try a login",()=>{
    const userPassword = `QwErTy${faker.number.int({min: 10, max: 999999})}`;
    const userData = {
        name: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: `OK${faker.internet.email()}`,
        password: userPassword,
        repeatPassword: userPassword
    };


    beforeEach(()=>{
        cy.visit("/");
        cy.get('.btn-primary').filter(':contains("Sign up")').click();
        cy.get('.modal-content').within(()=>{
            cy.get('#signupName').type(userData.name);
            cy.get('#signupLastName').type(userData.lastName);
            cy.get('#signupEmail').type(userData.email);
            cy.get('#signupPassword').type(userData.password);
            cy.get('#signupRepeatPassword').type(userData.password);
            cy.get('.btn-primary').click();
        });

        cy.location('pathname').should('eq', '/panel/garage');
        cy.get('.btn-primary').filter(':contains("Add car")');

        cy.get('.user-nav_toggle').filter(':contains(" My profile ")').click();
        cy.get('.btn-link').filter(':contains("Logout")').click();
        cy.location('pathname').should('eq', '/');
    });

    it("login as registered user",()=>{
        cy.visit("/");
        cy.login(userData.email, userData.password, true);
    });
});