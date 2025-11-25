declare global {
    namespace Cypress {
        interface Chainable {
            //loginAsGuest(): Chainable;
            login(email: string, password: string, shouldRemember: boolean): Chainable;
            register({name: string, lastName: string, email: string, password: string, repeatPassword: string}: Object): Chainable;
            logout(): Chainable;
        }
    }
}