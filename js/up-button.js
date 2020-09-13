let upButton = document.querySelector('.up-button');

window.onscroll = function () {
  if (window.pageYOffset > 200) {
    upButton.classList.add('shown');
  } else {
    upButton.classList.remove('shown');
  }// Добавьте else сюда

};

//upButton.onclick = function () {
//  window.scrollTo(0, 0);
//};

  upButton.onclick = function backToTop() {
    if (window.pageYOffset > 0) {
      window.scrollBy(0, -80);
     setTimeout(backToTop, 0);
    }
  }

