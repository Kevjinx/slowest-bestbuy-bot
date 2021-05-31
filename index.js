const {Builder, By, Key, until, WebDriver, WebElement, Options} = require('selenium-webdriver')
require('dotenv').config()
const {Bot} = require('./bot.js')
const linksArr = require('./links')


new Bot(linksArr)
