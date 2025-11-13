declare global {
    namespace Cypress {
        interface Chainable {
            //loginAsGuest(): Chainable;
            login(email: string, password: string, shouldRemember: boolean): Chainable;
        }
    }
}