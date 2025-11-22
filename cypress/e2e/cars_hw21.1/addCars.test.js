import carBrands from "../../fixtures/cars/carBrands.json";
import carModels from "../../fixtures/cars/carModels.json";
import carMilage from "../../fixtures/cars/carMilage.json"
import { faker } from "@faker-js/faker";

describe("Check card creation modal content",()=>{
    beforeEach(()=>{
        cy.login(Cypress.env("userEmail"),Cypress.env("userPassword"),false);
        cy.location("pathname").should("eq","/panel/garage");
    });

    it("Check modal title",()=>{
        cy.get(".btn-primary").contains("Add car").click();
        cy.get(".modal-content").within(()=>{
            cy.get(".modal-title").contains("Add a car");
        });
    });

    it("Check modal closing",()=>{
        cy.get(".btn-primary").contains("Add car").click();
        cy.get(".modal-content").within(()=>{
            cy.get(".close").as("closeButton").should("exist").and("be.enabled");
            cy.get("@closeButton").click();
            cy.get(".btn-primary").should("not.exist");
        });
    });

    it("Check cancel button is enabled and closes modal",()=>{
        cy.get(".btn-primary").contains("Add car").click();
        cy.get(".modal-content").within(()=>{
            cy.get(".btn-secondary").as("cancelButton").should("exist").and("be.enabled");
            cy.get("@cancelButton").click();
            cy.get(".btn-secondary").should("not.exist");
        });
    });

    it ("Check add button is present and diabled by default",()=>{
        cy.get(".btn-primary").contains("Add car").click();
        cy.get(".modal-content").within(()=>{
            cy.get(".btn-primary").contains("Add").should("exist").and("be.disabled");
        });
    });
});

describe("Invalid car creating",()=>{
    beforeEach(()=>{
        cy.login(Cypress.env("userEmail"),Cypress.env("userPassword"),false);
        cy.location("pathname").should("eq","/panel/garage");
    });

    let wasCarCreated = false;

    for (const brand of carBrands){
        const carModelsOutBrand = carModels.filter((carM)=>carM.carBrandId!==brand.id);
        const model = carModelsOutBrand[faker.number.int({min:0, max:carModelsOutBrand.length-1})];
        it(`Check if car with invalid brand-model can not be created - ${brand.title} ${model.title}`,()=>{
            cy.get(".btn-primary").contains("Add car").click();
            cy.get(".modal-content").within(()=>{
                cy.get("#addCarBrand").select(brand.title);
                cy.get("#addCarModel").filter(`:contains("${model.title}")`).should("not.exist");
            });
        });
    }

    for (const {title, input, error} of carMilage){
        it(`Check milage - ${title}`,()=>{
            cy.get(".btn-primary").contains("Add car").click();
            cy.get(".modal-content").within(()=>{
                cy.get("#addCarMileage").type(input.milage).focus().blur();
                if (error.message === "Valid"){
                    cy.get("#addCarMileage").parents(".form-group").within(()=>{
                        cy.get(".invalid-feedback").should("not.exist");
                    });
                    cy.get(".btn-primary").as("addCarButton").should("be.enabled");
                    cy.get("@addCarButton").click();
                    wasCarCreated = true;
                } else {
                    cy.get("#addCarMileage").parents(".form-group").within(()=>{
                        cy.get(".invalid-feedback").should("exist").and("be.visible").and('have.text', error.message);
                    });
                    cy.get(".btn-primary").should("be.disabled");
                }
            });
        });
    }

    it("Check if milage is required",()=>{
        cy.get(".btn-primary").contains("Add car").click();
        cy.get(".modal-content").within(()=>{
            cy.get("#addCarMileage").focus().blur();
            cy.get("#addCarMileage").parents(".form-group").within(()=>{
                cy.get(".invalid-feedback").should("exist").and("be.visible").and('have.text', "Mileage cost required");
            });
        });
    });

    afterEach(()=>{
        cy.reload();
        if(wasCarCreated){
            cy.get("li.car-item").should("exist");
            cy.get("li.car-item .btn-edit").eq(0).click();
            cy.get(".modal-content").within(()=>{
                cy.get(".btn-outline-danger").contains("Remove car").click();
            });
            cy.get(".-remove .modal-content").within(()=>{
                cy.get(".btn-danger").contains("Remove").click();
            });
            //cy.get("li.car-item").should("not.exist");
            //cy.get("p.panel-empty_message").should("be.visible");
        }
        wasCarCreated = false;
    });
});

describe("Adding new valid cars",()=>{
    let wasCarCreated = false;

    beforeEach(()=>{
        cy.login(Cypress.env("userEmail"),Cypress.env("userPassword"),false);
        cy.location("pathname").should("eq","/panel/garage");
    });

    for (const brand of carBrands){
        const carModelsOfBrand = carModels.filter((carM)=>carM.carBrandId===brand.id);
        for (const model of carModelsOfBrand){
            it(`Check if valid car with valid brand-model can be created - ${brand.title} ${model.title}`,()=>{
                cy.get(".btn-primary").contains("Add car").click();
                cy.get(".modal-content").within(()=>{
                    cy.get("#addCarBrand").select(brand.title);
                    cy.get("#addCarModel").select(model.title);
                    cy.get("#addCarMileage").type(`${faker.number.int({min: 1, max: 999999})}`).focus().blur();
                    cy.get("#addCarMileage").parents(".form-group").within(()=>{
                    cy.get(".invalid-feedback").should('not.exist');
                    });
                    cy.get(".btn-primary").contains("Add").click();
                });
                cy.location("pathname").should("eq","/panel/garage");
                cy.get("ul.car-list").should("exist");
                cy.get("ul.car-list").within(()=>{
                    cy.get("li.car-item p.car_name").contains(`${brand.title} ${model.title}`).should("exist")
                    .should(() =>{wasCarCreated = true; console.log(wasCarCreated);                    });
                });
            });
        }
    }

    it("Add a car without selecting brand and modal",()=>{
        cy.get(".btn-primary").contains("Add car").click();
        cy.get(".modal-content").within(()=>{
            cy.get("#addCarMileage").type(`${faker.number.int({min: 1, max: 999999})}`).focus().blur();
            cy.get("#addCarMileage").parents(".form-group").within(()=>{
                cy.get(".invalid-feedback").should('not.exist');
            });
            cy.get(".btn-primary").contains("Add").click();
            //wasCarCreated = true;
        });
        cy.location("pathname").should("eq","/panel/garage");
        cy.get("ul.car-list").within(()=>{
            cy.get("li.car-item p.car_name").contains(`${carBrands[0].title} ${carModels[0].title}`).should("be.visible")
                    .should(() =>{wasCarCreated = true; console.log(wasCarCreated);});
        });
    });

    afterEach(()=>{
        cy.reload();
        if (wasCarCreated){
            cy.get("li.car-item").should("exist");
            cy.get("li.car-item .btn-edit").eq(0).click();
            cy.get(".modal-content").within(()=>{
                cy.get(".btn-outline-danger").contains("Remove car").click();
            });
            cy.get(".-remove .modal-content").within(()=>{
                cy.get(".btn-danger").contains("Remove").click();
            });
            //cy.get("li.car-item").should("not.exist");
            //cy.get("p.panel-empty_message").should("be.visible");
        }
        wasCarCreated = false;
    });


});