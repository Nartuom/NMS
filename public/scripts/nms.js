const navToggle = document.getElementById("toggle-button");
const navNoodles = document.getElementsByClassName("bar");
const navBar = document.querySelector("nav");
const links = document.getElementsByClassName("navbar-links");

navToggle.addEventListener("click", () => {
    console.log("jello");
    [...navNoodles].forEach(function(noodle){
        noodle.classList.toggle("onClick");
    });
    [...links].forEach(function(link){
        link.classList.toggle("linksActive");
    })
    navNoodles[1].classList.toggle("slip");
    navBar.classList.toggle("navActive");
    
});

