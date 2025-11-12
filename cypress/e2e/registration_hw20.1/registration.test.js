import userEmails from "../../fixtures/userEmails.json";
import userNames from "../../fixtures/userNames.json";
import userLastNames from "../../fixtures/userLastNames.json";
import userPasswords from "../../fixtures/userPasswords.json";
import { faker } from "@faker-js/faker";

describe("User registration - Basic modal checks",()=>{
    beforeEach(()=>{
        cy.visit('/');
        cy.get('.btn-primary').filter(':contains("Sign up")').click();
    });

    it("Modal title",()=>{
        cy.get(".modal-content .modal-header h4.modal-title").filter(':contains("Registration")').should("be.visible");
    });

    it("Closing modal",()=>{
        cy.get(".modal-content .modal-header button.close").click();
        cy.get(".modal-content").should("not.exist");
    });

    it("Register button is disabled by default",()=>{
        cy.get(".modal-content button.btn-primary").as("registerButton").should("has.attr", "disabled");
        cy.get("@registerButton").should("be.visible");
    });
});

describe("User registration - Name validations", ()=>{
    beforeEach(()=>{
        cy.visit('/');
        cy.get('.btn-primary').filter(':contains("Sign up")').click();
    });

    for(const {title,input,expected} of userNames){
        it(title, () => {
            cy.get('#signupName').parent('.form-group').within(()=>{
                cy.get("#signupName").as('nameField').should('not.have.attr','disabled');
                cy.get('@nameField').type(input.name).focus().blur();
                if (expected.message === "Valid"){
                    cy.get('.invalid-feedback').should('not.exist');
                    cy.get('#signupName.is-invalid').should('not.exist'); 
                } else {
                    cy.get('.invalid-feedback').should('be.visible').and('have.text', expected.message);
                    cy.get('#signupName.is-invalid'); // check for border color from class style
                }
            });
        })
    }

    it("Empty field",()=>{
        cy.get('#signupName').parent('.form-group').within(()=>{
            cy.get("#signupName").focus().blur();
            cy.get('.invalid-feedback').should('be.visible').and('have.text', 'Name is required');
            cy.get('#signupName.is-invalid'); // check for border color from class style
        });
    });
});

describe("User registration - Last name validations", ()=>{
    beforeEach(()=>{
        cy.visit('/');
        cy.get('.btn-primary').filter(':contains("Sign up")').click();
    });

    for(const {title,input,expected} of userLastNames){
        it(title, () => {
            cy.get('#signupLastName').parent('.form-group').within(()=>{
                cy.get("#signupLastName").as('lastNameField').should('not.have.attr','disabled');
                cy.get('@lastNameField').type(input.lastName).focus().blur();
                if (expected.message === "Valid"){
                    cy.get('.invalid-feedback').should('not.exist');
                    cy.get('#signupLastName.is-invalid').should('not.exist'); 
                } else {
                    cy.get('.invalid-feedback').should('be.visible').and('have.text', expected.message);
                    cy.get('#signupLastName.is-invalid'); // check for border color from class style
                }
            });
        })
    }

    it("Empty field",()=>{
        cy.get('#signupLastName').parent('.form-group').within(()=>{
            cy.get("#signupLastName").focus().blur();
            cy.get('.invalid-feedback').should('be.visible').and('have.text', 'Last name is required');
            cy.get('#signupLastName.is-invalid'); // check for border color from class style
        });
    });
});

describe("User registration - Email validation",()=>{
    beforeEach(()=>{
        cy.visit('/');
        cy.get('.btn-primary').filter(':contains("Sign up")').click();
    });

    for(const {title,input,expected} of userEmails){
        it(title, () => {
            cy.get('#signupEmail').parent('.form-group').within(()=>{
                cy.get("#signupEmail").as('emailField').should('not.have.attr','disabled');
                cy.get('@emailField').type(input.email).focus().blur();
                if (expected.message === "Valid"){
                    cy.get('.invalid-feedback').should('not.exist');
                    cy.get('#signupEmail.is-invalid').should('not.exist'); 
                } else {
                    cy.get('.invalid-feedback').should('be.visible').and('have.text', expected.message);
                    cy.get('#signupEmail.is-invalid'); // check for border color from class style
                }
            });
        })
    }

    it("Empty field",()=>{
        cy.get('#signupEmail').parent('.form-group').within(()=>{
            cy.get("#signupEmail").focus().blur();
            cy.get('.invalid-feedback').should('be.visible').and('have.text', 'Email required');
            cy.get('#signupEmail.is-invalid'); // check for border color from class style
        });
    });
});

describe("User registration - Password validation",()=>{
    beforeEach(()=>{
        cy.visit('/');
        cy.get('.btn-primary').filter(':contains("Sign up")').click();
    });

    for(const {title,input,expected} of userPasswords){
        it(title, () => {
            cy.get('#signupPassword').parent('.form-group').within(()=>{
                cy.get("#signupPassword").as('passwordField').should('not.have.attr','disabled');
                cy.get('@passwordField').type(input.password,{ sensitive: true }).focus().blur();
                if (expected.message === "Valid"){
                    cy.get('.invalid-feedback').should('not.exist');
                    cy.get('#signupPassword.is-invalid').should('not.exist'); 
                } else {
                    cy.get('.invalid-feedback').should('be.visible').and('have.text', expected.message);
                    cy.get('#signupPassword.is-invalid'); // check for border color from class style
                }
            });
        })
    }

    it("Empty field",()=>{
        cy.get('#signupPassword').parent('.form-group').within(()=>{
            cy.get("#signupPassword").focus().blur();
            cy.get('.invalid-feedback').should('be.visible').and('have.text', 'Password required');
            cy.get('#signupPassword.is-invalid'); // check for border color from class style
        });
    });
});

describe("User registration - Repeat Password validation",()=>{
    beforeEach(()=>{
        cy.visit('/');
        cy.get('.btn-primary').filter(':contains("Sign up")').click();
    });

    for(const {title,input,expected} of userPasswords){
        it(title, () => {
            cy.get('#signupRepeatPassword').parent('.form-group').within(()=>{
                cy.get("#signupRepeatPassword").as('rePasswordField').should('not.have.attr','disabled');
                cy.get('@rePasswordField').type(input.password,{ sensitive: true }).focus().blur();
                if (expected.message === "Valid"){
                    cy.get('.invalid-feedback').should('be.visible').and('have.text','Passwords do not match'); //check matching with empty password 
                } else {
                    cy.get('.invalid-feedback').should('be.visible').and('have.text', expected.message);
                }
                cy.get('#signupRepeatPassword.is-invalid'); // check for border color from class style
            });
        })
    }

    it("Empty field",()=>{
        cy.get('#signupRepeatPassword').parent('.form-group').within(()=>{
            cy.get("#signupRepeatPassword").focus().blur();
            cy.get('.invalid-feedback').should('be.visible').and('have.text', 'Re-enter password required');
            cy.get('#signupRepeatPassword.is-invalid'); // check for border color from class style
        });
    });

    for (const {title,input,expected} of userPasswords){
        if(expected.message === "Valid"){
            it("Invalid repeat of "+title,()=>{
                cy.get('#signupPassword').type(input.password,{sensitive: true}).focus().blur();
                cy.get('#signupPassword.is-invalid').should('not.exist');
                cy.get('#signupRepeatPassword').parent('.form-group').within(()=>{
                    cy.get("#signupRepeatPassword").as('rePasswordField').should('not.have.attr','disabled');
                    if(input.password.length === 15){
                        cy.get('@rePasswordField').type(`${input.password}{backspace}`,{ sensitive: true }).focus().blur();
                    } else {
                        cy.get('@rePasswordField').type(`${input.password}${faker.number.int({min:0,max:9})}`,{ sensitive: true }).focus().blur();
                    }
                    cy.get('.invalid-feedback').should('be.visible').and('have.text','Passwords do not match');
                    cy.get('#signupRepeatPassword.is-invalid');
                });
            });
        }
    }
});

describe("User registration - Form submitting",()=>{
    let newPassword;
    let regData = {};

    const formIDs = ['#signupName','#signupLastName','#signupEmail','#signupPassword','#signupRepeatPassword'];

    beforeEach(()=>{
        cy.visit('/');
        cy.get('.btn-primary').filter(':contains("Sign up")').click();

        newPassword = `Qw1${faker.internet.password({length: faker.number.int({min:5,max:12}),pattern: /[A-Z+a-z+0-9+]/})}`;
        regData = {
            name: faker.string.alpha({length:{min:2,max:20}}),
            lastName: faker.string.alpha({length:{min:2,max:20}}),
            email: `OK${faker.internet.email()}`,
            password: newPassword,
            repeatPassword: newPassword
        };
    });

    it("Submit valid registration form",()=>{
        cy.get('.modal-content').within(()=>{
            cy.get('#signupName').type(regData.name);
            cy.get('#signupLastName').type(regData.lastName);
            cy.get('#signupEmail').type(regData.email);
            cy.get('#signupPassword').type(regData.password);
            cy.get('#signupRepeatPassword').type(regData.password);
            cy.get("button.btn-primary").click();
        });
        cy.location('pathname').should('eq', '/panel/garage');
        cy.get('.user-nav_toggle').filter(':contains(" My profile ")').click();
        cy.get('.btn-link').filter(':contains("Logout")').click();
        cy.location('pathname').should('eq', '/');
        cy.login(regData.email, regData.password, true);
        cy.location('pathname').should('eq', '/panel/garage');
    });

    for (const formID of formIDs){
        it(`Submit registration form with ${formID} erased`,()=>{
            cy.get('.modal-content').within(()=>{
                cy.get('#signupName').type(regData.name);
                cy.get('#signupLastName').type(regData.lastName);
                cy.get('#signupEmail').type(regData.email);
                cy.get('#signupPassword').type(regData.password);
                cy.get('#signupRepeatPassword').type(regData.password).focus().blur();
                cy.get("button.btn-primary").should("not.has.attr", "disabled");
                
               
                cy.get(formID).type("{selectAll}{backspace}").focus().blur();
                cy.get("button.btn-primary").should("has.attr", "disabled")
            });
            cy.location('pathname').should('eq', '/');
        });
    }

    afterEach(()=>{
        if(cy.location().its('pathname')==='/panel/garage'){
            cy.get('.user-nav_toggle').filter(':contains(" My profile ")').click();
            cy.get('.btn-link').filter(':contains("Logout")').click();
            cy.location('pathname').should('eq', '/');
        }
    });
});