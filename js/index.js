window.addEventListener("scroll", () => {

    const navbar = document.querySelector(".navbar");

    if (window.scrollY > 50) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

});

const counters = document.querySelectorAll(".counter");


counters.forEach(counter => {


    counter.innerText="0";


    const updateCounter = () => {


        const target = +counter.getAttribute("data-target");


        const current = +counter.innerText;


        const increment = target / 100;


        if(current < target){

            counter.innerText=Math.ceil(current + increment);

            setTimeout(updateCounter,20);

        }else{

            counter.innerText=target;

        }


    }


    updateCounter();


});