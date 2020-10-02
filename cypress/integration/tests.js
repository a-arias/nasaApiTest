/// <reference types="cypress" />
// 
import moment from 'moment';
function transformSolToEarthDate(daysInSol){
  var earthDayTransformed = null;
  var robertLandingDate = '2012-08-06'
  //transforming robert landing date to milliseconds 
  var robertLandingDateMilliSeconds = Date.parse(robertLandingDate);
  //defining the current convertion factor
  var conversionFactor = 1.02749125170;
  //Obtaining the earth date based on the given solar day
  earthDayTransformed = robertLandingDateMilliSeconds + (daysInSol * 24 * 60 * 60 * 1000) * conversionFactor;
  let dateVar = moment(earthDayTransformed);
  return dateVar.utc().format("YYYY-MM-DD").toString();
}

describe('Mars Rover Photos', () => {
   it('Retrieve the first 10 Mars photos made by "Curiosity" on 1000 Martian sol.', () => {
    //This is going to GET the photos and do some Assertions
    cy.getPhotosFromCuriosity('sol','1000', 10);

    //This is going to Print the photos on the console
    cy.PrintPhotosFromCuriosity('sol','1000', 10);
  });

   it('Retrieve the first 10 Mars photos made by "Curiosity" on Earth date equal to 1000 Martian sol.', () => {  
    //This step is going to transform 1000 martian sol date to an earth date
    var solarDateTransformedToEarthDate = transformSolToEarthDate(1000);

    //We are going to bring the first 10 mars photos made by "Curiosity" on Earth date we transformed
    cy.getPhotosFromCuriosity('earth_date',solarDateTransformedToEarthDate, 10);

    //Getting the correct earth date from the endpoint photos?sol=1000 
    cy.returnEarthDateFromSolrequest('1000');

    //Asserts that the date we got from the endpoint photos?sol=1000 is equal to the one we calculated using transformSolToEarthDate Command 
    cy.get('@myEarthDate').then(myEarthDate => {
      expect(solarDateTransformedToEarthDate).to.deep.equal(myEarthDate);
    });   
  });

   it('Validate that the amounts of pictures that each "Curiosity" camera took on 1000 Mars sol is not greater than 10 times the amount taken by other cameras on the same date.', () => {
    //Get all photos on curiosity day
    cy.getAllPhotosFromCuriosityOnSolDay('1000');

    //Get the total amount of photos by camera
    cy.get('@counterOfPhotosByCamera').then(counterOfPhotosByCamera => {
      //Asserts No camera made more than 10 photos
      cy.NoCameraShouldMadeMoreThan10Photos(counterOfPhotosByCamera)
     });
   });
 });
