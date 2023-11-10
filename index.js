const axios = require('axios');
const cheerio = require('cheerio')
const browserHeaders = require('./src/object/browserHeaders')
const slug = require('./src/helpers/slug')
// const readFromFile = require('./readFromFile')
// const writeToFile = require('./writeFromFile')
const filesystem = require('fs')


const BASE_URL = 'https://www.amazon.com.br/'
const path = 's?k=carro&page=1'

const getPage = () => {

    const url = `${BASE_URL}${path}`
    const options = {
        headers: browserHeaders,
    };

    return axios.get(url, options).then((response) => response.data)
}

//verify if the consult alreay exist
const readFromFile = (filename) => {
    const promiseCallback = (resolve, reject) => {
        filesystem.readFile(filename, 'utf8', (error, contents) => {
            if(error) {
            console.log('there is not cache')
            resolve(null);
            }
            resolve(contents)
        })
    }
    return new Promise(promiseCallback)
}

//FUNCTION TO CREATE FILE HTML
const writeToFile = (data, path) => {

    const promiseCallback = (resolve, reject) => {
        filesystem.writeFile(path, data, (error) => {
            if(error){
                reject(error);
                return
            }
            resolve(true)
        })
    }
    return new Promise(promiseCallback);
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
        const results = $('[data-component-type=s-search-result]');
        results.each((index, results) => {
            objects[index] = {
                title: $(results).find('a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal span.a-color-base.a-text-normal').text()
                
            }
        })
        console.log(objects)

        resolve(true)
    }

    return new Promise(promiseCallback)
}


getCachedPage(path).then(getPageItems).then(console.log).catch(console.error);


