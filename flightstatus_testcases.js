// Importing required modules
// The script needs to import various Selenium and Chai modules to run.

const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { Builder, Key, By, until } = require("selenium-webdriver");
const assert = require('chai').assert;
const expect = require('chai').expect;

// Setting chrome options to start the browser maximized
const options = new chrome.Options();
options.addArguments('start-maximized');

// Initializing a new chrome driver
const driver = new webdriver.Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .build();

// Defining the URL to be tested and the XPaths of the various elements on the page

const URL = 'https://www.eurowings.com/en/information/at-the-airport/flight-status.html';
const privacySettings = "//button[contains(@class,'cookie-consent--cta-decline')]";
const flightRouteOption = '(//div[@class="a-radiobutton"])[1]'
const flightNumberOption = '(//div[@class="a-radiobutton"])[2]';

const departureAirportIcon = "//div[contains(@class,'station-select-origin')]//button"
const departureAirportInput = '//input[@aria-label="Departure airport"]'
const departureAirportInputSelect = "//div[contains(@class,'new-station-list__text')]//span[contains(text(),'CGN')]"
const departureAPValue = '//*[@id="site"]/main/div[3]/div[3]/div/div[2]/div/div[2]/div/div[1]/div/div/div/div[2]/div[1]/p[1]'
const destinationAPValue = '//*[@id="site"]/main/div[3]/div[3]/div/div[2]/div/div[2]/div/div[1]/div/div/div/div[2]/div[1]/p[2]'

const destinationAirportIcon = "//div[contains(@class,'station-select-destination')]//button"
const destinationAirportInput = '//input[@aria-label="Destination airport"]'
const destinationAirportInputSelect = "//div[contains(@class,'new-station-list__text')]//span[contains(text(),'BER')]"

const numberIcon = '//div[@class="m-form-mask__deco-icon"]'
const numberInput = '//input[@name="flightNumber"]'
const flightStatusButton = '//span[contains(text(),"Show flight status")]'
const departureDate = '//div[@name="departureDate"]'
const flNumVal = '//*[@id="site"]/main/div[3]/div[3]/div/div[2]/div/div[2]/div/div/div/div/div/div[2]/div[2]/p'


//getting the current date
const currentDate = new Date();
const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
const currentDateOfMonth = currentDate.getDate().toString().padStart(2, '0');
const dateInputToday = `//div[contains(@class,'calendar-table__container')]//input[contains(@value,'${currentMonth}-${currentDateOfMonth}')]`

//getting the next day date
currentDate.setDate(currentDate.getDate() + 1); // add 1 day to get tomorrow's date
const tomorrowMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
const tomorrowDateOfMonth = currentDate.getDate().toString().padStart(2, '0');
const dateInputNextDay = `//div[contains(@class,'calendar-table__container')]//input[contains(@value,'${tomorrowMonth}-${tomorrowDateOfMonth}')]`;


//const dateSelect = `//div[contains(@class,'calendar-table__container')]//input[contains(@value,'${currentMonth}-${currentDateOfMonth}')]`
//const dateSelect = "//div[contains(@class,'calendar-table__container')]//input[contains(@value,'02-20')]"

const noResult = "//*[@id='site']/main/div[3]/div[3]/div/div[2]/div/div[2]/div/div/h2"


/*
 The following test case enters a valid Departure and destination airport and validates the 
 search result is indeed the result that is expected. It verifies whether the search results have 
 the same departure and destination airports
 */
async function flightInfoSearchFlightRoute()
{
    // Navigating to the URL and clicking on the privacy settings button
    await driver.get(URL);
    await driver.findElement(webdriver.By.xpath(privacySettings)).click();
    
    // Selecting the flight route option and entering the departure airport and destination airport

    await driver.wait(until.elementLocated(webdriver.By.xpath(flightRouteOption)), 10000);
    await driver.findElement(webdriver.By.xpath(flightRouteOption)).click();
    await driver.wait(until.elementLocated(By.xpath(departureAirportIcon)), 10000);
    await driver.findElement(By.xpath(departureAirportIcon)).click()

    // Waiting for the departure airport input field to be located and entering the departure airport code 'CGN'

    await driver.wait(until.elementLocated(By.xpath(departureAirportInput)), 10000);
    await driver.findElement(By.xpath(departureAirportInput)).sendKeys("CGN")
    await driver.wait(until.elementLocated(By.xpath(departureAirportInputSelect)), 10000);
    await driver.findElement(By.xpath(departureAirportInputSelect)).click()
    
    // Waiting for the destination airport input field to be located and 
    // entering the destination airport code 'BER'

    await driver.executeScript("arguments[0].scrollIntoView(true);",
    driver.findElement(By.xpath("//div[contains(@class,'station-select-destination')]//button")));

    
    await driver.findElement(By.xpath(destinationAirportIcon)).click()
    await driver.wait(until.elementLocated(By.xpath(destinationAirportInput)), 10000);
    await driver.findElement(By.xpath(destinationAirportInput)).sendKeys("BER")
    await driver.wait(until.elementLocated(By.xpath(destinationAirportInputSelect)), 10000);
    await driver.findElement(By.xpath(destinationAirportInputSelect)).click()

    // Scrolling to the departure date input and clicking it

    await driver.executeScript("arguments[0].scrollIntoView(true);",
    driver.findElement(By.xpath(departureDate)));

    
    await driver.findElement(By.xpath(departureDate)).click();
    await driver.wait(until.elementLocated(By.xpath(dateInputToday), 10000));
    await driver.findElement(By.xpath(dateInputToday)).click();
    driver.findElement(By.xpath(flightStatusButton)).click();

    // Checking the departure airport and destination airport values

    const departureAP = await driver.wait(until.elementLocated(By.xpath(departureAPValue)), 10000);
    const depText = await departureAP.getText();
    expect(depText).to.equal('CGN');
    const destinationAP = await driver.findElement(By.xpath(destinationAPValue));
    const desText = await destinationAP.getText();
    expect(desText).to.equal('BER');

}

/*
 The following test case enters a valid flight number and validates the 
 search result is indeed the result that is expected. It verifies whether the search results have 
 the same flight number
 */

async function flightInfoSearchFlightNumber() {
    
    // Navigate to the URL
    await driver.get(URL);
    
    
    // Click on the "Flight number" option

    await driver.findElement(webdriver.By.xpath(flightNumberOption)).click();
    
    // Locate the flight number input field and enter the flight number

    const flightNumberInput = await driver.findElement(webdriver.By.xpath(numberInput))
    await flightNumberInput.sendKeys("EW-582");
        
    // Scroll to the departure date input field and select it

    await driver.executeScript("arguments[0].scrollIntoView(true);", driver.findElement(By.xpath(departureDate)));
    await driver.findElement(By.xpath(departureDate)).click()

    // Wait for the date select input field to be located, select it and click it

    await driver.wait(until.elementLocated(By.xpath(dateInputToday)), 10000);
    await driver.findElement(By.xpath(dateInputToday)).click()
      
    // Click on the "Flight Status" button
    driver.findElement(By.xpath(flightStatusButton)).click()
    
        
    // Wait for the flight number value to be located, get the text and assert it equals "EW582"
    const flNum = await driver.wait(until.elementLocated(By.xpath(flNumVal)), 10000);
    const flNumText = await flNum.getText();
    expect(flNumText).to.equal('EW582');
  }

/*
 The following test case enters a valid flight number and validates the 
 search result is indeed the result that is expected. It verifies whether the search result sazs a valid mesage 
 if there are no resuolts can be displyed as per the user selection. For example if there is no flight number
 that matches the user input
 */

  async function flightInfoSearchErrorMessage() {
     
    // Navigate to the URL and select the flight number option

    await driver.get(URL);
    await driver.findElement(webdriver.By.xpath(flightNumberOption)).click();

        
    // Find the flight number input field and enter a non-existent flight number

    const flightNumberInput = await driver.findElement(webdriver.By.xpath(numberInput))
    await flightNumberInput.sendKeys("EW-000");
  
        
    // Scroll to the departure date and select a date

    await driver.executeScript("arguments[0].scrollIntoView(true);", driver.findElement(By.xpath(departureDate)));
    await driver.findElement(By.xpath(departureDate)).click()
    await driver.wait(until.elementLocated(By.xpath(dateInputToday)), 10000);
    await driver.findElement(By.xpath(dateInputToday)).click()
  
        
    // Click the flight status button to submit the search

    driver.findElement(By.xpath(flightStatusButton)).click()

        
    // Wait for the "no result" element to appear and check the error message

    const flNum = await driver.wait(until.elementLocated(By.xpath(noResult)), 10000);
    const flNumText = await flNum.getText();
    expect(flNumText).to.equal('Unfortunately, we could not find any results for your search.');


  }


 async function runAllFunctions() {
    await flightInfoSearchFlightRoute();
    await flightInfoSearchFlightNumber();
    await flightInfoSearchErrorMessage();
  }
  
  runAllFunctions();
  