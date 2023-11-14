const API_URL = "/api/scrape?keyword=";
const searchBtn = document.getElementById("searchBtn")
const input = document.getElementById("keyword")
const objectsSection = document.getElementById("objects")


 async function search(e){
    let keyword = input.value;
    e.preventDefault();
    let res = await fetch(API_URL + keyword)
    const data = await res.json()
    console.log(res)
    console.log(data.products)

    showProducts(data.products)
}

function showProducts(products){
    objectsSection.innerHTML = ""
    products.map((product) => {
        const productCard = document.createElement('div');
        productCard.classList.add('card')

    const img = document.createElement("img");
    img.style.maxWidth = "200px";
    img.style.maxHeight = "200px";
    img.src = product.image;
    img.alt = product.title.substring(0, 20)

    const infos = document.createElement('div');
    infos.innerHTML = `
    <h2>${product.title}</h2>
    <div class="rating">
    <span>${product.rating}</span>
    <small>${product.reviews} reviews</span>
    </div>
    `

    productCard.append(img, infos);
    objectsSection.appendChild(productCard)

    })

}

