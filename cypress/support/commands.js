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
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import moment from 'moment';

Cypress.Commands.add("printImagesFromResponse", (photos) => { 
  for (const photo of photos) {
    cy.log(photo['img_src']);
  }
});

Cypress.Commands.add("PrintPhotosFromCuriosity", (typeOfTime = 'sol',time ='1000', numberOfPhotos = 10) => { 
  let apiKey = 'DEMO_KEY';
  let photos = [];
  cy.api({url: `/api/v1/rovers/curiosity/photos?${typeOfTime}=${time}&page=1&api_key=${apiKey}`})
   .then((response) => {
    photos = response.body.photos.slice(0,numberOfPhotos);
    cy.printImagesFromResponse(photos);
  });
});

Cypress.Commands.add("getPhotosFromCuriosity", (typeOfTime = 'sol',time ='1000', numberOfPhotos = 10) => { 
  let apiKey = 'DEMO_KEY';
  let photos = [];
  cy.api({url: `/api/v1/rovers/curiosity/photos?${typeOfTime}=${time}&page=1&api_key=${apiKey}`})
   .then((response) => {
    photos = response.body.photos.slice(0,numberOfPhotos);
    expect(response.status).to.eq(200)
  });
});

Cypress.Commands.add("returnEarthDateFromSolrequest", (time ='1000') => {
  let apiKey = 'DEMO_KEY';
   cy.api({url: `/api/v1/rovers/curiosity/photos?sol=${time}&page=1&api_key=${apiKey}`})
   .then((response) => {
    cy.wrap(response.body.photos[0].earth_date).as('myEarthDate');
   })
});

Cypress.Commands.add("returnRobertLandingDateFromSolRequest", (time ='1000') => {
  let apiKey = 'DEMO_KEY';
  cy.api({url: `/api/v1/rovers/curiosity/photos?sol=${time}&page=1&api_key=${apiKey}`})
  .then((response) => {
   cy.wrap(response.body.photos[0].rover.landing_date).as('myRobertLandingDate');
  })
});

Cypress.Commands.add("getAllPhotosFromCuriosityOnSolDay", (time ='1000') => { 
  let apiKey = 'DEMO_KEY';
  let cameras = [];
  cy.api({url: `/api/v1/rovers/curiosity/photos?sol=${time}&api_key=${apiKey}`})
   .then((response) => {
    var cameras = response.body.photos
    var myMap = new Map();
    //Getting all different cameras from response.
    for (const camera of cameras) {
      let count = 0
      myMap.set(camera.camera.name, count);
    }
    //Calculating num of photos taken with the different cameras
    for (const camera of cameras){
      if(myMap.has(camera.camera.name)){
        var counter = myMap.get(camera.camera.name);
        counter++;
        myMap.set(camera.camera.name, counter);
      }
  }    
    //Returning number cameras counting numbers
    cy.wrap(myMap).as('counterOfPhotosByCamera');
  });
});

//Thi command is going to get the max value of a map of cameras values
Cypress.Commands.add("getMaxValue", (map) => {
  var maxValue;
    for (var [key, value] of map) {
      maxValue = (!maxValue || maxValue < value) ? value : maxValue;
    }
    return maxValue;
});

//Thi command is going to get the minimum value of a map of cameras values
Cypress.Commands.add("getMinValue", (map) => {
  var minValue;
  for (var [key, value] of map) {
    minValue = (!minValue || minValue > value) ? value : minValue;
  }
  return minValue;
});

//Thi command is going compare if a camera made more than 10 photos than another one
var calculateIfOneCameraTookMoreThan10PhotosThanOthen = function (min,max) {
  if(min==0){
  if(max>10)return false;
  }else if(min>0){
   if(max/min>10)return false;
  }
  return true;
}

//Thi command is going to call another commands to know if a camera made more than 10 photos than other one 
Cypress.Commands.add("NoCameraShouldMadeMoreThan10Photos", (myMap) => {
  //getting max and minimum values from my map of camera values
  var max = cy.getMaxValue(myMap);
  var min = cy.getMinValue(myMap);

  //Asserts that no Camera made 10 more photos than any other
  expect(calculateIfOneCameraTookMoreThan10PhotosThanOthen(min,max)).to.be.equal(false);
});