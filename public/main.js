const API_URL = "/api/scrape?keyword=";
const searchBtn = document.getElementById("searchBtn")
const input = document.getElementById("keyword")
const objectsSection = document.getElementById("objects")


 async function search(e){
    let keyword = input.value;
    e.preventDefault();
    console.log(keyword)

    let res = await fetch(API_URL + keyword)
    const data = await res.json()
    console.log(data)
}

