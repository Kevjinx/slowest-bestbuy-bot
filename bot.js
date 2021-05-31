const {Builder, By, Key, until, WebDriver, WebElement, Options} = require('selenium-webdriver')
require('dotenv').config()


class Bot {
  constructor(linksArr) {
    this.linksArr = linksArr;
    this.fName = process.env.FNAME;
    this.lName = process.env.LNAME;
    this.address = process.env.ADDRESS;
    this.city = process.env.CITY;
    this.zipCode = process.env.ZIPCODE;
    this.email = process.env.EMAIL;
    this.phoneNumber = process.env.PHONENUMBER;
    this.ccCardNumber = process.env.CARD_NUMBER;
    this.ccCardCode = process.env.CARD_CODE;
    this.ccCardMonth = process.env.CARD_MONTH;
    this.ccCardYear = process.send.CARD_YEAR;
    this.start();
  }

  start = async () => {
    const driver = await new Builder().forBrowser('chrome').build();
    await this.login(driver);
    if (await this.findStock(driver)) {
      await this.addToCart(driver);
      await this.fillOutShipping(driver);
      await this.fillOutPayment(driver);
      await this.placeOrder(driver);
    }
  }


  login = async (driver) => {

    const signinEmailSelector = '#fld-e'
    const signinPasswordSelector = '#fld-p1'
    const signinLink = 'https://www.bestbuy.com/identity/global/signin'

    await driver.get(signinLink)
    await driver.findElement(By.css(signinEmailSelector)).sendKeys(process.env.BB_EMAIL)
    await driver.findElement(By.css(signinPasswordSelector)).sendKeys(process.env.BB_PASS, Key.RETURN)
  }

  findStock = async (driver) => {
    const soldOutOrAddToCartSelector = ".add-to-cart-button"

    let notInStock = true;
    let i = 0

    while (notInStock) {
      await driver.get(this.linksArr[i])

      const canAddToCart = await ((await driver.findElement(By.css(soldOutOrAddToCartSelector))).isEnabled())

      if (canAddToCart) notInStock = false;

      i++
      if (i > this.linksArr.length - 1) i = 0;
    }
    if (!notInStock) return true;
  }



  addToCart = async (driver) => {


    const checkoutXpathSelector = "/html/body/div[1]/main/div/div[2]/div[1]/div/div[1]/div[1]/section[2]/div/div/div[3]/div/div[1]/button"
    const cartLink = 'https://www.bestbuy.com/cart'
    const addToCartCssSelector = '.btn-primary.btn-leading-ficon.add-to-cart-button'
    const continueAsGuestCssSelector = '.btn-secondary.btn-lg.cia-guest-content__continue.guest'
    const shippingCssSelector = "[id^='fulfillment-shipping']"
    const stateCssSelector = ".c-dropdown.v-medium.c-dropdown.v-medium.smart-select>option:nth-child(9)"

    await (await driver.findElement(By.css(addToCartCssSelector))).click();

    await driver.get(cartLink)

    await (await driver.wait(until.elementLocated(By.css(shippingCssSelector)), 10000)).click()

    await (await driver.wait(until.elementLocated(By.xpath(checkoutXpathSelector)), 10000)).click()

    await (await driver.wait(until.elementLocated(By.css(continueAsGuestCssSelector)), 10000)).click()

    await (await driver.wait(until.elementLocated(By.css(stateCssSelector), 10000))).click();

  }

  fillOutShipping = async (driver) => {

    const fNameSelector = "input[id$='firstName']"
    const lNameSelector = "input[id$='lastName']"
    const addressSelector = "input[id$='street']"
    const citySelector = "input[id$='city']"
    const zipCodeSelector = "input[id$='zipcode']"
    const emailSelector = "input[id$='user.emailAddress']"
    const phoneNumberSelector = "input[id$='user.phone']"

    await driver.findElement(By.css(fNameSelector)).sendKeys(this.fName)
    await driver.findElement(By.css(lNameSelector)).sendKeys(this.lName)
    await driver.findElement(By.css(addressSelector)).sendKeys(this.address)
    await driver.findElement(By.css(zipCodeSelector)).sendKeys(this.zipCode)
    await driver.findElement(By.css(citySelector)).sendKeys(this.city)
    await driver.findElement(By.css(emailSelector)).sendKeys(this.email)
    await driver.findElement(By.css(phoneNumberSelector)).sendKeys(this.phoneNumber)
  }

  fillOutPayment = async (driver) => {

    const continueToPaymentSelector = "[class='button--continue'] button"
    const ccCardSelector = "input[id='optimized-cc-card-number']"
    const cardMonthSelector=`#credit-card-expiration-month>div>div>select>option:nth-child(${this.ccCardMonth})`
    const cardYearSelector = `#credit-card-expiration-year > div > div > select > option:nth-child(${this.ccCardYear})`
    const cardCSVSelector = '#credit-card-cvv'

    await (await driver.findElement(By.css(continueToPaymentSelector))).click()

    await driver.wait(until.elementLocated(By.css(ccCardSelector)), 10000).sendKeys(this.ccCardNumber)

    await (await driver.wait(until.elementLocated(By.css(cardMonthSelector)), 10000)).click()

    await (await driver.findElement(By.css(cardYearSelector))).click()

    await driver.findElement(By.css(cardCSVSelector)).sendKeys(this.ccCardCode)
  }

  placeOrder = async (driver) => {

    const placeOrderSelector = ".payment__order-summary button"
    await (await driver.findElement(By.css(placeOrderSelector))).click()
  }

}


module.exports.Bot = Bot;
