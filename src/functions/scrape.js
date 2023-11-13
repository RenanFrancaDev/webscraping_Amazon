const axios = require('axios');
const cheerio = require('cheerio')
const browserHeaders = require('../object/browserHeaders')
const slug = require('../helpers/slug')
const readFromFile = require('./readFromFile')
const writeToFile = require('./writeFromFile')
const filesystem = require('fs')


const BASE_URL = 'https://www.amazon.com.br/'
const path = 's?k=carro&page=1'
const selectors = {
    products: "[data-component-type=s-search-result]",
	title: "a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal span.a-color-base.a-text-normal",
	rating: "span.a-icon-alt",
	reviews: "span.a-size-base.s-underline-text",
	image: "img.s-image",
}

const getPage = () => {

    const url = `${BASE_URL}${path}`
    const options = {
        headers: browserHeaders,
    };

    return axios.get(url, options).then((response) => response.data)
}


//GET QUERY READY, INF NOT, IT WILL CREATE
const getCachedPage = (path) => {

    const filename = `cache/${slug(path)}.html`;
    console.log(path, filename)

    const promiseCallback = async (resolve, reject) => {

        const cachedHtml = await readFromFile(filename);
        if(!cachedHtml){
            const html = await getPage(path);
            writeToFile(html, filename);
            resolve(html)
            return
        }
            resolve(cachedHtml)

    }

    return new Promise(promiseCallback)
}

const getPageItems = (html) => {

    const $ = cheerio.load(html);

    const promiseCallback = (resolve, reject) =>{

        objects = []
        const results = $(selectors.products);
        results.each((index, results) => {
            objects[index] = {
                title: $(results).find(selectors.title).text(),
                rating: $(results).find(selectors.rating).text(),
                reviews: $(results).find(selectors.reviews).text(),
                image: $(results).find(selectors.image).text()

            }
        })
        console.log(objects)

        resolve(true)
    }

    return new Promise(promiseCallback)
}


getCachedPage(path).then(getPageItems).then(console.log).catch(console.error);

module.exports = getCachedPage;