'use strict';

//MENU MOBILE
var navMain = document.querySelector('.main-nav');
var navToggle = document.querySelector('.main-nav__toggle');

navMain.classList.remove('main-nav--nojs');

navToggle.addEventListener('click', function() {
    if (navMain.classList.contains('main-nav--closed')) {
        navMain.classList.remove('main-nav--closed');
    }
    else    {
        navMain.classList.add('main-nav--closed');
    }
});

//MENU FIXED

function menuPosition() {
    var hHeader;
    var clientY;
    var hMenu;
    var header = document.querySelector('.header');
    var nav = document.querySelector('.main-nav');

    hHeader = header.offsetHeight;
    hMenu = nav.offsetHeight;
    clientY = pageYOffset;
    if (hHeader <= clientY) {
        header.style.marginBottom = hMenu + "px";
        nav.style.position = "fixed";
        nav.style.top = "0px";
    } else {
        nav.style.position = "relative";
        header.style.marginBottom = "0";
    }
}

window.addEventListener('resize', function(event) {
    menuPosition();
});

window.addEventListener('scroll', function(event) {
    menuPosition();
});