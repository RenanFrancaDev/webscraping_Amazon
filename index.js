const axios = require('axios');
const filesystem = require('fs')


const BASE_URL = 'https://www.amazon.com.br/'
const path = 's?k=carro&page=0'

const  browserHeaders = {

'Accept':
'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
'Accept-Encoding': 'gzip, deflate, br',
'Accept-Language':'pt-BR,pt;q=0.9,en-GB;q=0.8,en;q=0.7,en-US;q=0.6',
'Cache-Control':'max-age=0',
'Cookie':'session-id=145-5944309-3447664; i18n-prefs=BRL; lc-acbbr=pt_BR; ubid-acbbr=132-2168067-2789045; session-id-time=2082787201l; csm-hit=tb:9TD1PFTQQZHPSRJ9YA05+b-XJ0WVQSCJVM3QGANK8SN|1699368887158&t:1699368887158&adb:adblk_no; session-token=RYomYcRxksjddNyFkCE0BQXhu+r/4b7brBE7z/Dc4S6uMC+JCqfGWNMy+a+OMfrwOQFtsg9MLV7xqNd1n6uNaJRP5fTPQBJqOJ3amN/MJ2SB4c24pkKBxm23msULbMHx+8Ea83JhL/tOYLMjyY95CZ83gx2+YAT7gWkaq9LYjVOG2lbJ+7efp6PUUpd6Z4+orOOjFoXxSyXPlGf1j8yV6SV8mYtiazHbLq+Tts50Yw4gkE8PCDMLYqE9wUnBXM6Jl2kjCyucYsz6pmG6E779CCHQb3Y/cUco1G81AO17MlzBogxs51BosYz9sxFc0dwnQ4xuybptBrt4rG5AlJEA6cu/6gXacc1Q9NXEZfgQ+/4=',
'Device-Memory':'8',
'Downlink':'6.05',
'Dpr': '1.25',
'Ect': '4g',
'Rtt':'100',
'Sec-Ch-Device-Memory':'8',
'Sec-Ch-Dpr':'1.25',
'Sec-Ch-Ua':'"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
'Sec-Ch-Ua-Mobile':
'?1',
'Sec-Ch-Ua-Platform':'Android',
'Sec-Ch-Ua-Platform-Version':"6.0",
'Sec-Ch-Viewport-Width':'506',
'Sec-Fetch-Dest':'document',
'Sec-Fetch-Mode':'navigate',
'Sec-Fetch-Site':'none',
'Sec-Fetch-User':'?1',
'Upgrade-Insecure-Requests':'1',
'User-Agent':'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile,Safari/537.36',
'Viewport-Width': '506'

}

//Create slug from string JavaScript

const slug = (str) => {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
  
    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
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

//verify if the consult alreay exist
const readFromFile = (filename) => {
    const promiseCallback = (resolve, reject) => {
        filesystem.readFile(filename, 'utf8', (error, contents) => {
            if(error) {
            resolve(null);
            }
            resolve(contents)
        })
    }
    return new Promise(promiseCallback)
}


const getPage = () => {

    const url = `${BASE_URL}${path}`
    const options = {
        headers: browserHeaders,
    };

    return axios.get(url, options).then((response) => response.data)
}

//GET QUERY READY
const getCachedPage = (path) => {

    const filename = `cache/${slug(path)}.html`;
    console.log(path, filename)

    const promiseCallback = async (resolve, reject) => {

        const cachedHtml = await readFromFile(filename);


        const html = await getPage(path);
        writeToFile(html, filename);

        resolve(true)

    }

    return new Promise(promiseCallback)
}



getCachedPage(path).then(console.log).catch(console.error);

