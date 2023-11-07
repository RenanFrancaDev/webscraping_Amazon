const axios = require('axios');
const cheerio = require('cheerio')
const filesystem = require('fs')
const browserHeaders = require('./src/object/browserHeaders')
const slug = require('./src/helpers/slug')
const readFromFile = require('./src/functions/readFromFile')
const writeToFile = require('./src/functions/writeFromFile')


const BASE_URL = 'https://www.amazon.com.br/'
const path = 's?k=carro&page=0'

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


getCachedPage(path).then(console.log).catch(console.error);

