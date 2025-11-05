describe("Find header elements", () =>{
    beforeEach(()=>{
        cy.visit("/");
        cy.get('.bg-basic-dark').as('headerContainer');
    });
    it("Find logo link",()=>{
        cy.get('@headerContainer').within(()=>{
            cy.get('.header_logo').should('have.attr', 'href', '/');
        });
    });

    it("Find Home link",()=>{
        cy.get('@headerContainer').within(()=>{
            cy.get('.-active').should('have.attr', 'href', '/').contains('Home');
        });
    });

    it("Find About button",()=>{
        cy.get('@headerContainer').within(()=>{
            cy.get('.header-link').contains('About').should('have.attr', 'appscrollto', 'aboutSection');
        });
    });

    it("Find Contacts button",()=>{
        cy.get('@headerContainer').within(()=>{
            cy.get('.header-link').contains('Contacts').should('have.attr', 'appscrollto', 'contactsSection');
        });
    });

    it("Find Guest login link", ()=>{
        cy.get('@headerContainer').within(()=>{
            cy.get('.-guest').contains('Guest log in');
        });
    });

    it("Find Sign in button", ()=>{
        cy.get('@headerContainer').within(()=>{
            cy.get('.header_signin').contains('Sign In');
        });
    });

    //sign up button is not actually in header but adding it as it was in the task screenshoot as example
    it("Find Sign up button", ()=>{
        cy.get('.btn-primary').contains('Sign up');
    });
});

describe("Find footer elements", () =>{
    beforeEach(()=>{
        cy.visit("/");
        cy.get('#contactsSection').as('contactsContainer');
    });
    
    
    it("Find Facebook link", ()=>{
        cy.get('@contactsContainer').within(()=>{
            cy.get('span.icon-facebook').parent('a.socials_link').should('have.attr', 'href', 'https://www.facebook.com/Hillel.IT.School');
        });
    });

    it("Find Telegram link", ()=>{
        cy.get('@contactsContainer').within(()=>{
            cy.get('span.icon-telegram').parent('a.socials_link').should('have.attr', 'href', 'https://t.me/ithillel_kyiv');
        });
    });

    it("Find Youtube link", ()=>{
        cy.get('@contactsContainer').within(()=>{
            cy.get('span.icon-youtube').parent('a.socials_link').should('have.attr', 'href', 'https://www.youtube.com/user/HillelITSchool?sub_confirmation=1');
        });
    });

    it("Find Instagram link", ()=>{
        cy.get('@contactsContainer').within(()=>{
            cy.get('span.icon-instagram').parent('a.socials_link').should('have.attr', 'href', 'https://www.instagram.com/hillel_itschool/');
        });
    });

    it("Find LinkedIn link", ()=>{
        cy.get('@contactsContainer').within(()=>{
            cy.get('span.icon-linkedin').parent('a.socials_link').should('have.attr', 'href', 'https://www.linkedin.com/school/ithillel/');
        });
    });

    it("Find Contacts link", ()=>{
        cy.get('@contactsContainer').within(()=>{
            cy.get('.display-4').should('have.attr', 'href', 'https://ithillel.ua');
        });
    });

    it("Find MailTo link", ()=>{
        cy.get('@contactsContainer').within(()=>{
            cy.get('a.h4').should('have.attr', 'href', 'mailto:developer@ithillel.ua');
        });
    });
});

