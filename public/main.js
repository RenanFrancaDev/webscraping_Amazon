
const searchBtn = document.getElementById("searchBtn")
const input = document.getElementById("keyword")
const objectsSection = document.getElementById("objects")

function search(e){
    e.preventDefault()
    objectsSection.replaceChildren();
    let keyword = input.value;
}
