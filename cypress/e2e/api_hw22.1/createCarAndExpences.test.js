import { faker } from "@faker-js/faker";
import carBrands from "../../fixtures/cars/carBrands.json";
import carModels from "../../fixtures/cars/carModels.json";

describe("Create a car, API",()=>{
    const car = {
        wasCarCreated: false,
        fuelExpences: []
    };

    beforeEach(()=>{
        const password = `Qwe1${faker.internet.password({length: faker.number.int({min:4,max:11}),pattern:/[A-Za-z0-9]/})}`;
        const userData = {
            name: faker.string.alpha({length: faker.number.int({min:2, max:20})}),
            lastName: faker.string.alpha({length: faker.number.int({min:2, max:20})}),
            email: `OK${faker.internet.email()}`,
            password: password,
            repeatPassword: password
        };
        car.millage = faker.number.int({min: 1, max: 999998});

        cy.register(userData);
        cy.logout();
        cy.login(userData.email, userData.password, false);
        cy.location("pathname").should("eq","/panel/garage");
    });

    it("Check intercepted car creation response",()=>{
        car.brand = carBrands[faker.number.int({min:0, max: carBrands.length-1})];
        const carModelsOfBrand = carModels.filter((carM)=>carM.carBrandId===car.brand.id);
        car.model = carModelsOfBrand[faker.number.int({min:0, max: carModelsOfBrand.length-1})];

        cy.get(".btn-primary").contains("Add car").click();
        cy.get(".modal-content").within(()=>{
            cy.get("#addCarBrand").select(car.brand.title);
            cy.get("#addCarModel").select(car.model.title);
            cy.get("#addCarMileage").type(car.millage).focus().blur();
            cy.get("#addCarMileage").parents(".form-group").within(()=>{
                cy.get(".invalid-feedback").should('not.exist');
            });

            cy.intercept("POST","/api/cars").as("createCarRequest");
            cy.get(".btn-primary").contains("Add").click();
            cy.wait("@createCarRequest").its("response.statusCode").should("eq", 201);
            cy.get("@createCarRequest").its("response.body.status").should("eq", "ok");
        });
        cy.location("pathname").should("eq","/panel/garage");
        cy.get("ul.car-list").should("exist");
        cy.get("ul.car-list").within(()=>{
            cy.get("li.car-item p.car_name").contains(`${car.brand.title} ${car.model.title}`).should("exist")
                .should(() =>{
                    car.wasCarCreated = true;
            });
        });
        cy.get("@createCarRequest").its("response.body.data.id").should("exist");
        cy.get("@createCarRequest").its("response.body.data.carBrandId").should("eq", car.brand.id);
        cy.get("@createCarRequest").its("response.body.data.carModelId").should("eq", car.model.id);
        cy.get("@createCarRequest").its("response.body.data.initialMileage").should("eq", car.millage);
        cy.get("@createCarRequest").its("response.body.data.mileage").should("eq", car.millage);
        cy.get("@createCarRequest").its("response.body.data.brand").should("eq", car.brand.title);
        cy.get("@createCarRequest").its("response.body.data.model").should("eq", car.model.title);
        cy.get("@createCarRequest").its("response.body.data.logo").should("eq", car.brand.logoFilename);
    });

    it("Create car and fuel expences through API",()=>{
        const currentDate = new Date();
        const reportDate = currentDate.toISOString().split('T')[0];
        const liters = faker.number.float({min:0.01,max:9999,fractionDigits:2});
        const totalCost = faker.number.int({min:0.01,max:10000,fractionDigits:2});

        cy.request('GET', '/api/cars/brands').as("getBrandsRequest")
        .then((response)=>{
            expect(response.status).to.eq(200);
            expect(response.body.status).to.eq("ok");
            const brands = response.body.data;
            car.brand = brands[faker.number.int({min:0, max: brands.length-1})];
        })
        .then(()=>{
            cy.request('GET',`/api/cars/models?carBrandId=${car.brand.id}`).as("getModelsByBrandRequest")
            .then((response)=>{
                expect(response.status).to.eq(200);
                expect(response.body.status).to.eq("ok");
                const modelsOfBrand = response.body.data;
                car.model = modelsOfBrand[faker.number.int({min:0, max: modelsOfBrand.length-1})];
            });
        })
        .then(()=>{
            cy.request('POST','/api/cars',{"carBrandId":car.brand.id, "carModelId":car.model.id, "mileage":car.millage}).as("createCarRequest")
            .then((response)=>{
                expect(response.status).to.eq(201);
                expect(response.body.status).to.eq("ok");
                expect(response.body.data.carBrandId).to.eq(car.brand.id);
                expect(response.body.data.carModelId).to.eq(car.model.id);
                expect(response.body.data.initialMileage).to.eq(car.millage);
                expect(response.body.data.mileage).to.eq(car.millage);
                expect(response.body.data.brand).to.eq(car.brand.title);
                expect(response.body.data.brand).to.eq(car.brand.title);
                expect(response.body.data.model).to.eq(car.model.title);
                expect(response.body.data.logo).to.eq(car.brand.logoFilename);
                car.id = response.body.data.id;
            });
        })
        .then(()=>{
            car.wasCarCreated = true;
            console.log(car);
        })
        .then(()=>{
            cy.request('POST','/api/expenses',{
                "carId": car.id,
                "reportedAt": reportDate,
                "mileage": car.millage+1,
                "liters": liters,
                "totalCost": totalCost,
                "forceMileage": false
            })
            .then((response)=>{
                expect(response.status).to.eq(200);
                expect(response.body.status).to.eq("ok");
                expect(response.body.data.carId).to.eq(car.id);
                expect(response.body.data.reportedAt).to.eq(reportDate);
                expect(response.body.data.mileage).to.eq(car.millage+1);
                expect(response.body.data.liters).to.eq(liters);
                expect(response.body.data.totalCost).to.eq(totalCost);
                expect(response.body.data).to.have.property('id');
                car.fuelExpences.push(response.body.data);
                console.log(car);
            });
        })
        .then(()=>{
            cy.request('GET',`/api/expenses/${car.fuelExpences[0].id}`)
            .then((response)=>{
                expect(response.status).to.eq(200);
                expect(response.body.status).to.eq("ok");
                expect(response.body.data.id).to.eq(car.fuelExpences[0].id);
                expect(response.body.data.reportedAt).to.eq(reportDate);
                expect(response.body.data.mileage).to.eq(car.millage+1);
                expect(response.body.data.liters).to.eq(liters);
                expect(response.body.data.totalCost).to.eq(totalCost);
            });
        });
    });  
});