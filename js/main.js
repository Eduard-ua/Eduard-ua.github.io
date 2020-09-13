//const faHamburger = document.querySelector('.fa-hamburger');
//const browserWidth = document.documentElement.clientWidth;
//const skyBlue = document.querySelector('.visually-hidden');
//  
//console.log(browserWidth);
//if (browserWidth < 780) {
//    faHamburger.classList.remove('visually-hidden');
//}

const menuList = document.querySelector('.menu__list'),
      burgerContainer = document.querySelector('.hamburger__container');

burgerContainer.addEventListener('click', addMenu);

console.log(menuList);


function addMenu() {
    burgerContainer.classList.toggle('change');
    menuList.classList.toggle('change');
}