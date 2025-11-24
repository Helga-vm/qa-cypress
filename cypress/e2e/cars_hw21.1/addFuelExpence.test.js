import carBrands from "../../fixtures/cars/carBrands.json";
import carModels from "../../fixtures/cars/carModels.json";
import millageExpences from "../../fixtures/cars/millageExpences.json";
import litersExpences from "../../fixtures/cars/litersExpences.json";
import costsExpences from "../../fixtures/cars/costsExpences.json";
import { faker } from "@faker-js/faker";

describe("Check fuel expence change modal content",()=>{
    let wasCarCreated = false;
    beforeEach(()=>{
        cy.login(Cypress.env("userEmail"),Cypress.env("userPassword"),false);
        cy.location("pathname").should("eq","/panel/garage");
        cy.get(".btn-primary").contains("Add car").click();
        cy.get(".modal-content").within(()=>{
            cy.get("#addCarMileage").type(`${faker.number.int({min: 1, max: 999998})}`).focus().blur();
            cy.get(".btn-primary").contains("Add").click();
        });
        cy.location("pathname").should("eq","/panel/garage");
        cy.get("ul.car-list").within(()=>{
            cy.get("li.car-item p.car_name").should("exist")
            .should(()=>{wasCarCreated = true;});
        });
    });

    it("Check modal title",()=>{
        cy.get("p.car_name").eq(0).parents("li.car-item").within(()=>{
            cy.get(".btn-success").as("addFuelExpense").contains("Add fuel expense").should("be.visible").and("be.enabled");
            cy.get("@addFuelExpense").click();
        });
        cy.get(".modal-content").within(()=>{
            cy.get("h4.modal-title").contains("Add an expense").should("exist").and("be.visible");
            cy.get("button.close").click();
        });
    });

    it("Check modal closing",()=>{
        cy.get("p.car_name").eq(0).parents("li.car-item").within(()=>{
            cy.get(".btn-success").as("addFuelExpense").contains("Add fuel expense").should("be.visible").and("be.enabled");
            cy.get("@addFuelExpense").click();
        });
        cy.get(".modal-content").within(()=>{
            cy.get("button.close").as("closeButton").should("exist").and("be.visible").and("be.enabled");
            cy.get("@closeButton").click();
        });
        cy.location("pathname").should("eq","/panel/garage");
        cy.get("button.close").should("not.exist");
    });

    it("Check cancelling changes",()=>{
        cy.get("p.car_name").eq(0).parents("li.car-item").within(()=>{
            cy.get(".btn-success").as("addFuelExpense").contains("Add fuel expense").should("be.visible").and("be.enabled");
            cy.get("@addFuelExpense").click();
        });
        cy.get(".modal-content").within(()=>{
            cy.get("button.btn-secondary").contains("Cancel").as("cancelButton").should("exist").and("be.visible").and("be.enabled");
            cy.get("@cancelButton").click();
        });
        cy.location("pathname").should("eq","/panel/garage");
        cy.get("button.btn-secondary").contains("Cancel").should("not.exist");
    });

    afterEach(()=>{
        cy.reload()
        if(wasCarCreated){
            cy.get("p.car_name").eq(0).parents("li.car-item").within(()=>{
                cy.get(".btn-edit").click();
            });
            cy.get(".modal-content").within(()=>{
                cy.get(".btn-outline-danger").contains("Remove car").click();
            });
            cy.get(".-remove .modal-content").within(()=>{
                cy.get(".btn-danger").contains("Remove").click();
            });
        }
        wasCarCreated = false;
    });
});

describe("Check fuel expence miles limits ",()=>{
    const car = {
        wasCarCreated: false,
        mileage: 1,
        brand:{
            "id": 1,
            "title": "Audi",
            "logoFilename": "audi.png"
        },
        model:{
            "id": 1,
            "carBrandId": 1,
            "title": "TT"
        }
    };

    beforeEach(()=>{
        cy.login(Cypress.env("userEmail"),Cypress.env("userPassword"),false);
        cy.location("pathname").should("eq","/panel/garage");
        cy.get(".btn-primary").contains("Add car").click();
        cy.get(".modal-content").within(()=>{
            cy.get("#addCarBrand").select(car.brand.title);         
            cy.get("#addCarModel").select(car.model.title);
            cy.get("#addCarMileage").type(car.mileage).focus().blur();
            cy.get(".btn-primary").contains("Add").click();
        });
        cy.location("pathname").should("eq","/panel/garage");
        cy.get("ul.car-list").within(()=>{
            cy.get("li.car-item p.car_name").contains(`${car.brand.title} ${car.model.title}`).should("be.visible")
            .should(()=>{car.wasCarCreated = true;});
        });
    });

    for (const {title,input,error} of millageExpences){
        it(title,()=>{
            cy.visit('/panel/garage');
            cy.get("p.car_name").contains(`${car.brand.title} ${car.model.title}`).parents("li.car-item").within(()=>{
                cy.get(".btn-success").as("addFuelExpense").contains("Add fuel expense").should("be.visible").and("be.enabled");
                cy.get("@addFuelExpense").click();
            });
            cy.get(".modal-content").within(()=>{
                cy.get("#addExpenseMileage").type(`{selectAll}{backspace}${input.millage}`).focus().blur();
                cy.get("#addExpenseLiters").type(input.numLiters).focus().blur();
                cy.get("#addExpenseTotalCost").type(input.totalCost).focus().blur();
                

                if(error.message!=="Valid"){
                    cy.get(".btn-primary").contains("Add").should("be.disabled");
                    cy.get("#addExpenseMileage").parents(".form-group").within(()=>{
                        cy.get(".invalid-feedback p").should("have.text", error.message);
                    });
                } else {
                    cy.get(".btn-primary").contains("Add").as("addExpenseButton").should("be.enabled");
                    cy.get("@addExpenseButton").click();
                }
            });
            if(error.message==="Valid"){
                cy.location("pathname").should("eq","/panel/expenses");
                cy.get(".main").within(()=>{
                    cy.get('#carSelectDropdown').should("be.visible").and("have.text",`${car.brand.title} ${car.model.title}`);
                    cy.get(".panel-page_content .expenses tbody").within(()=>{
                        cy.get("td").eq(1).should("have.text",input.millage);
                        cy.get("td").eq(2).should("have.text",`${input.numLiters}L`);
                        cy.get("td").eq(3).should("have.text",`${input.totalCost} USD`);
                        });
                    });
            }
                
        });
    }

    it("Invalid millage - empty",()=>{
        cy.visit('/panel/garage');
        cy.get("p.car_name").contains(`${car.brand.title} ${car.model.title}`).parents("li.car-item").within(()=>{
            cy.get(".btn-success").as("addFuelExpense").contains("Add fuel expense").should("be.visible").and("be.enabled");
            cy.get("@addFuelExpense").click();
        });
        cy.get(".modal-content").within(()=>{
            cy.get("#addExpenseMileage").type("{selectAll}{backspace}").focus().blur();
            cy.get("#addExpenseLiters").type(faker.number.float({min:0.01, max:9999})).focus().blur();
            cy.get("#addExpenseTotalCost").type(faker.number.float({min:0.01, max:10000})).focus().blur();
            
            cy.get(".btn-primary").contains("Add").should("be.disabled");
            cy.get("#addExpenseMileage").parents(".form-group").within(()=>{
                cy.get(".invalid-feedback p").should("have.text", "Mileage required");
            });
        });
    });

    afterEach(()=>{
        cy.visit('/panel/garage');

        cy.reload();
        
        if(car.wasCarCreated){
            cy.get(".car-list").should("exist");
            //cy.get('li.car-item:first-of-type').should("exist");
            //cy.get("li.car-item").eq(0).should("exist");
            cy.get("p.car_name").contains(`${car.brand.title} ${car.model.title}`).parents("li.car-item").as("carTile").should("exist");
            cy.get("@carTile").within(()=>{
                cy.get(".btn-edit").eq(0).click();
            }); 
            cy.get(".modal-content").within(()=>{
                cy.get(".btn-outline-danger").contains("Remove car").click();
            });
            cy.get(".-remove .modal-content").within(()=>{
                cy.get(".btn-danger").contains("Remove").click();
            });
        }
        car.wasCarCreated = false;
    });
});

describe("Check fuel expence liters limits ",()=>{
    const car = {
        wasCarCreated: false,
        mileage: 1,
        brand:{
            "id": 1,
            "title": "Audi",
            "logoFilename": "audi.png"
        },
        model:{
            "id": 1,
            "carBrandId": 1,
            "title": "TT"
        }
    };

    beforeEach(()=>{
        cy.login(Cypress.env("userEmail"),Cypress.env("userPassword"),false);
        cy.location("pathname").should("eq","/panel/garage");

        cy.get(".btn-primary").contains("Add car").click();
        cy.get(".modal-content").within(()=>{
            cy.get("#addCarBrand").select(car.brand.title);         
            cy.get("#addCarModel").select(car.model.title);
            cy.get("#addCarMileage").type(car.mileage).focus().blur();
            cy.get(".btn-primary").contains("Add").click();
        });
        cy.location("pathname").should("eq","/panel/garage");
        cy.get("ul.car-list").within(()=>{
            cy.get("li.car-item p.car_name").contains(`${car.brand.title} ${car.model.title}`).should("be.visible")
            .should(()=>{car.wasCarCreated = true;});
        });
    });

    for (const {title,input,error} of litersExpences){
        it(title,()=>{
            cy.visit('/panel/garage');
            cy.get("p.car_name").contains(`${car.brand.title} ${car.model.title}`).parents("li.car-item").within(()=>{
                cy.get(".btn-success").as("addFuelExpense").contains("Add fuel expense").should("be.visible").and("be.enabled");
                cy.get("@addFuelExpense").click();
            });
            cy.get(".modal-content").within(()=>{
                cy.get("#addExpenseMileage").type(`{selectAll}{backspace}${input.millage}`).focus().blur();
                cy.get("#addExpenseLiters").type(input.numLiters).focus().blur();
                cy.get("#addExpenseTotalCost").type(input.totalCost).focus().blur();
                

                if(error.message!=="Valid"){
                    cy.get(".btn-primary").contains("Add").should("be.disabled");
                    cy.get("#addExpenseLiters").parents(".form-group").within(()=>{
                        cy.get(".invalid-feedback p").should("have.text", error.message);
                    });
                } else {
                    cy.get(".btn-primary").contains("Add").as("addExpenseButton").should("be.enabled");
                    cy.get("@addExpenseButton").click();
                }
            });
            if(error.message==="Valid"){
                cy.location("pathname").should("eq","/panel/expenses");
                cy.get(".main").within(()=>{
                    cy.get('#carSelectDropdown').should("be.visible").and("have.text",`${car.brand.title} ${car.model.title}`);
                    cy.get(".panel-page_content .expenses tbody").within(()=>{
                        cy.get("td").eq(1).should("have.text",input.millage);
                        cy.get("td").eq(2).should("have.text",`${input.numLiters}L`);
                        cy.get("td").eq(3).should("have.text",`${input.totalCost} USD`);
                        });
                    });
            }
                
        });
    }

    it("Invalid number of liters - empty",()=>{
        cy.visit('/panel/garage');
        cy.get("p.car_name").contains(`${car.brand.title} ${car.model.title}`).parents("li.car-item").within(()=>{
            cy.get(".btn-success").as("addFuelExpense").contains("Add fuel expense").should("be.visible").and("be.enabled");
            cy.get("@addFuelExpense").click();
        });
        cy.get(".modal-content").within(()=>{
            cy.get("#addExpenseMileage").type("{selectAll}{backspace}2").focus().blur();
            cy.get("#addExpenseLiters").focus().blur();
            cy.get("#addExpenseTotalCost").type(faker.number.float({min:0.01, max:10000})).focus().blur();
            
            cy.get(".btn-primary").contains("Add").should("be.disabled");
            cy.get("#addExpenseLiters").parents(".form-group").within(()=>{
                cy.get(".invalid-feedback p").should("have.text", "Liters required");
            });
        });
    });

    afterEach(()=>{
        cy.visit('/panel/garage');

        cy.reload();
        
        if(car.wasCarCreated){
            cy.get(".car-list").should("exist");
            cy.get("p.car_name").contains(`${car.brand.title} ${car.model.title}`).parents("li.car-item").as("carTile").should("exist");
            cy.get("@carTile").within(()=>{
                cy.get(".btn-edit").eq(0).click();
            }); 
            cy.get(".modal-content").within(()=>{
                cy.get(".btn-outline-danger").contains("Remove car").click();
            });
            cy.get(".-remove .modal-content").within(()=>{
                cy.get(".btn-danger").contains("Remove").click();
            });
        }
        car.wasCarCreated = false;
    });
});

describe("Check fuel expence total cost limits ",()=>{
    const car = {
        wasCarCreated: false,
        mileage: 1,
        brand:{
            "id": 1,
            "title": "Audi",
            "logoFilename": "audi.png"
        },
        model:{
            "id": 1,
            "carBrandId": 1,
            "title": "TT"
        }
    };

    beforeEach(()=>{
        cy.login(Cypress.env("userEmail"),Cypress.env("userPassword"),false);
        cy.location("pathname").should("eq","/panel/garage");

        cy.get(".btn-primary").contains("Add car").click();
        cy.get(".modal-content").within(()=>{
            cy.get("#addCarBrand").select(car.brand.title);         
            cy.get("#addCarModel").select(car.model.title);
            cy.get("#addCarMileage").type(car.mileage).focus().blur();
            cy.get(".btn-primary").contains("Add").click();
        });
        cy.location("pathname").should("eq","/panel/garage");
        cy.get("ul.car-list").within(()=>{
            cy.get("li.car-item p.car_name").contains(`${car.brand.title} ${car.model.title}`).should("be.visible")
            .should(()=>{car.wasCarCreated = true;});
        });
    });

    for (const {title,input,error} of costsExpences){
        it(title,()=>{
            cy.visit('/panel/garage');
            cy.get("p.car_name").contains(`${car.brand.title} ${car.model.title}`).parents("li.car-item").within(()=>{
                cy.get(".btn-success").as("addFuelExpense").contains("Add fuel expense").should("be.visible").and("be.enabled");
                cy.get("@addFuelExpense").click();
            });
            cy.get(".modal-content").within(()=>{
                cy.get("#addExpenseMileage").type(`{selectAll}{backspace}${input.millage}`).focus().blur();
                cy.get("#addExpenseLiters").type(input.numLiters).focus().blur();
                cy.get("#addExpenseTotalCost").type(input.totalCost).focus().blur();
                

                if(error.message!=="Valid"){
                    cy.get(".btn-primary").contains("Add").should("be.disabled");
                    cy.get("#addExpenseTotalCost").parents(".form-group").within(()=>{
                        cy.get(".invalid-feedback p").should("have.text", error.message);
                    });
                } else {
                    cy.get(".btn-primary").contains("Add").as("addExpenseButton").should("be.enabled");
                    cy.get("@addExpenseButton").click();
                }
            });
            if(error.message==="Valid"){
                cy.location("pathname").should("eq","/panel/expenses");
                cy.get(".main").within(()=>{
                    cy.get('#carSelectDropdown').should("be.visible").and("have.text",`${car.brand.title} ${car.model.title}`);
                    cy.get(".panel-page_content .expenses tbody").within(()=>{
                        cy.get("td").eq(1).should("have.text",input.millage);
                        cy.get("td").eq(2).should("have.text",`${input.numLiters}L`);
                        cy.get("td").eq(3).should("have.text",`${input.totalCost} USD`);
                        });
                    });
            }
                
        });
    }

    it("Invalid total costs - empty",()=>{
        cy.visit('/panel/garage');
        cy.get("p.car_name").contains(`${car.brand.title} ${car.model.title}`).parents("li.car-item").within(()=>{
            cy.get(".btn-success").as("addFuelExpense").contains("Add fuel expense").should("be.visible").and("be.enabled");
            cy.get("@addFuelExpense").click();
        });
        cy.get(".modal-content").within(()=>{
            cy.get("#addExpenseMileage").type("{selectAll}{backspace}2").focus().blur();
            cy.get("#addExpenseLiters").type(faker.number.float({min:0.01, max:9999})).focus().blur();
            cy.get("#addExpenseTotalCost").focus().blur();
            
            cy.get(".btn-primary").contains("Add").should("be.disabled");
            cy.get("#addExpenseTotalCost").parents(".form-group").within(()=>{
                cy.get(".invalid-feedback p").should("have.text", "Total cost required");
            });
        });
    });

    afterEach(()=>{
        cy.visit('/panel/garage');

        cy.reload();
        
        if(car.wasCarCreated){
            cy.get(".car-list").should("exist");
            cy.get("p.car_name").contains(`${car.brand.title} ${car.model.title}`).parents("li.car-item").as("carTile").should("exist");
            cy.get("@carTile").within(()=>{
                cy.get(".btn-edit").eq(0).click();
            }); 
            cy.get(".modal-content").within(()=>{
                cy.get(".btn-outline-danger").contains("Remove car").click();
            });
            cy.get(".-remove .modal-content").within(()=>{
                cy.get(".btn-danger").contains("Remove").click();
            });
        }
        car.wasCarCreated = false;
    });
});

describe("Adding fuel expence - Garage page",()=>{
    const car = {
        wasCarCreated: false,
        mileage: 1,
        brand:{
            "id": 1,
            "title": "Audi",
            "logoFilename": "audi.png"
        },
        model:{
            "id": 1,
            "carBrandId": 1,
            "title": "TT"
        }
    };

    beforeEach(()=>{
        cy.login(Cypress.env("userEmail"),Cypress.env("userPassword"),false);
        cy.location("pathname").should("eq","/panel/garage");

        cy.get(".btn-primary").contains("Add car").click();
        cy.get(".modal-content").within(()=>{
            cy.get("#addCarBrand").select(car.brand.title);         
            cy.get("#addCarModel").select(car.model.title);
            cy.get("#addCarMileage").type(car.mileage).focus().blur();
            cy.get(".btn-primary").contains("Add").click();
        });
        cy.location("pathname").should("eq","/panel/garage");
        cy.get("ul.car-list").within(()=>{
            cy.get("li.car-item p.car_name").contains(`${car.brand.title} ${car.model.title}`).should("be.visible")
            .should(()=>{car.wasCarCreated = true;});
        });
    });

    it("Selected by default in list car should match edited one",()=>{
        cy.get("p.car_name").contains(`${car.brand.title} ${car.model.title}`).parents("li.car-item").within(()=>{
            cy.get(".btn-success").as("addFuelExpense").contains("Add fuel expense").should("be.visible").and("be.enabled");
            cy.get("@addFuelExpense").click();
        });
        cy.get(".modal-content").within(()=>{
            cy.get("#addExpenseCar option").eq(0).should("be.selected").and("have.text",`${car.brand.title} ${car.model.title}`);
        });
    });

    it("New milage can not be less than initial",()=>{
        cy.get("p.car_name").contains(`${car.brand.title} ${car.model.title}`).parents("li.car-item").within(()=>{
            cy.get(".btn-success").as("addFuelExpense").contains("Add fuel expense").should("be.visible").and("be.enabled");
            cy.get("@addFuelExpense").click();
        });
        cy.get(".modal-content").within(()=>{
            cy.get("#addExpenseMileage").type(`{selectAll}{backspace}${car.mileage-1}`);
            cy.get("#addExpenseLiters").type(`${faker.number.float({min:0.01, max:9999})}`).focus().blur();
            cy.get("#addExpenseTotalCost").type(`${faker.number.float({min:0.01,max:1000000})}`).focus().blur();
            cy.get(".btn-primary").contains("Add").as("addExpenseButton").should("be.enabled");
            cy.get("@addExpenseButton").click();

            cy.get(".alert-danger").contains(`First expense mileage must not be less or equal to car initial mileage. Car initial mileage is ${car.mileage}`).should("be.visible");
        });
    });

    it("New milage can not be equal to initial",()=>{
        cy.get("p.car_name").contains(`${car.brand.title} ${car.model.title}`).parents("li.car-item").within(()=>{
            cy.get(".btn-success").as("addFuelExpense").contains("Add fuel expense").should("be.visible").and("be.enabled");
            cy.get("@addFuelExpense").click();
        });
        cy.get(".modal-content").within(()=>{
            cy.get("#addExpenseLiters").type(`${faker.number.float({min:0.01, max:9999})}`).focus().blur();
            cy.get("#addExpenseTotalCost").type(`${faker.number.float({min:0.01,max:1000000})}`).focus().blur();
            cy.get(".btn-primary").contains("Add").as("addExpenseButton").should("be.enabled");
            cy.get("@addExpenseButton").click();

            cy.get(".alert-danger").contains(`First expense mileage must not be less or equal to car initial mileage. Car initial mileage is ${car.mileage}`).should("be.visible");
        });
    });

    it("Report date can not be more than current",()=>{
        cy.get("p.car_name").contains(`${car.brand.title} ${car.model.title}`).parents("li.car-item").within(()=>{
            cy.get(".btn-success").as("addFuelExpense").contains("Add fuel expense").should("be.visible").and("be.enabled");
            cy.get("@addFuelExpense").click();
        });
        const timestamp = new Date();
        const reportDate = `${timestamp.getDate()+1}.${timestamp.getMonth()}.${timestamp.getFullYear()}`;
        console.log(reportDate);
        cy.get(".modal-content").within(()=>{
            cy.get("#addExpenseMileage").type(`{selectAll}{backspace}${car.mileage+1}`).focus().blur();
            cy.get("#addExpenseDate").type(`{selectAll}{backspace}${reportDate}`).focus().blur();
            cy.get("#addExpenseLiters").type(`${faker.number.float({min:0.01, max:9999})}`).focus().blur();
            cy.get("#addExpenseTotalCost").type(`${faker.number.float({min:0.01,max:1000000})}`).focus().blur();
            cy.get(".btn-primary").contains("Add").as("addExpenseButton").should("be.enabled");
            cy.get("@addExpenseButton").click();

            cy.get(".alert-danger").should("be.visible");
            cy.get(".btn-secondary").contains("Cancel").click();
        });
    });

    it("Report date can not be less than car creation date",()=>{
        cy.get("p.car_name").contains(`${car.brand.title} ${car.model.title}`).parents("li.car-item").within(()=>{
            cy.get(".btn-success").as("addFuelExpense").contains("Add fuel expense").should("be.visible").and("be.enabled");
            cy.get("@addFuelExpense").click();
        });
        const timestamp = new Date();
        const reportDate = `${timestamp.getDate()-1}.${timestamp.getMonth()}.${timestamp.getFullYear()}`;
        console.log(reportDate);
        cy.get(".modal-content").within(()=>{
            cy.get("#addExpenseMileage").type(`{selectAll}{backspace}${car.mileage+1}`).focus().blur();
            cy.get("#addExpenseDate").type(`{selectAll}{backspace}${reportDate}`).focus().blur();
            cy.get("#addExpenseLiters").type(`${faker.number.float({min:0.01, max:9999})}`).focus().blur();
            cy.get("#addExpenseTotalCost").type(`${faker.number.float({min:0.01,max:1000000})}`).focus().blur();
            cy.get(".btn-primary").contains("Add").as("addExpenseButton").should("be.enabled");
            cy.get("@addExpenseButton").click();

            cy.get(".alert-danger").should("be.visible");
            cy.get(".btn-secondary").contains("Cancel").click();
        });
    });

    afterEach(()=>{
        cy.visit('/panel/garage');
        cy.reload();
        if(car.wasCarCreated){
            cy.get(".car-list").should("exist");
            cy.get("p.car_name").contains(`${car.brand.title} ${car.model.title}`).parents("li.car-item").as("carTile").should("be.visible");
            cy.get("@carTile").within(()=>{
                cy.get(".btn-edit").click();
            }); 
            cy.get(".modal-content").within(()=>{
                cy.get(".btn-outline-danger").contains("Remove car").click();
            });
            cy.get(".-remove .modal-content").within(()=>{
                cy.get(".btn-danger").contains("Remove").click();
            });
            
        }
        car.wasCarCreated = false;
    });
});

