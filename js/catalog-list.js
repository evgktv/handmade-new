/* global Item: true */

'use strict';

(function () {
    var container = document.querySelector('.catalog-page__list');
    var activeSort = null;
    var catalog = [];
    var filteredCatalog = [];

    var allPrices = [];
    var minPrice;
    var maxPrice;

    var filteredItems = [];
    var currentPage = 0;
    var PAGE_SIZE;
    var winWidth;


    /**
     * @param {number} winWidth
     */

    function PAGE_SIZEChange(winWidth) {
        winWidth = document.body.offsetWidth;

        if (winWidth > 1149) {
            PAGE_SIZE = 12;
        }
        if (winWidth <= 1149 && winWidth > 767) {
            PAGE_SIZE = 9;
        }
        if (winWidth <= 767) {
            PAGE_SIZE = 3;
        }
    }

    PAGE_SIZEChange(winWidth);

    window.addEventListener('resize', function(event) {
        PAGE_SIZEChange(winWidth);
    });

    var sort = document.querySelectorAll('.catalog-page__sort-arrow');

    document.querySelector('.catalog-page__sort').classList.remove('catalog-page__sort--nojs');

    for (var i = 0; i < sort.length; i++) {

        sort[i].onclick = function (evt) {
            var clickedElementId = evt.currentTarget.id || evt.currentSrcElement.id;
            setActiveSort(clickedElementId);
        };
    }

    var scrollTimeout;

    getCatalog(true);

    window.addEventListener('scroll', function (evt) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function () {
            var footerXY = document.querySelector('footer').getBoundingClientRect();
            var viewportSize = window.innerHeight;

            if (footerXY.bottom - window.innerHeight <= footerXY.height) {
                if (currentPage < Math.ceil(filteredItems.length / PAGE_SIZE)) {
                    currentPage++;
                    renderCatalog(filteredItems, currentPage);
                }
            }
        }, 100);
    });


    /**
     * rendering list items CATALOG
     * @param {array.<Object>} catalog
     * @param {number} pageNumber
     * @param {boolean} replace
     */
    function renderCatalog(itemsToRender, pageNumber, replace) {

        if (replace) {
            var renderedElements = container.querySelectorAll('.item');
            [].forEach.call(renderedElements, function (el) {
                el.removeEventListener('click', _onClick);
                container.removeChild(el);
            });
        }

        var fragment = document.createDocumentFragment();

        var from = pageNumber * PAGE_SIZE;
        var to = from + PAGE_SIZE;
        var pageItems = itemsToRender.slice(from, to);

        pageItems.forEach(function (item) {
            var itemElement = new Item(item);
            itemElement.render();
            itemElement.showPopup();
            fragment.appendChild(itemElement.element);
        });

        container.appendChild(fragment);
    }

    function _onClick(evt){
        evt.preventDefault();

        var popupActive = document.querySelector('.item--popup');
        var popup = document.querySelector('.item');

        popup.classList.add('item--popup');
    }


    /**
     * @param {string} id
     */

    function setActiveSort(id) {


        if (activeSort === id) {
            return;
        }

        if (activeSort != null) {
            document.querySelector('#' + activeSort).classList.remove('catalog-page__sort-arrow--active');
        };

        document.querySelector('#' + id).classList.add('catalog-page__sort-arrow--active');
        console.log(filteredItems);

        filteredItems = filteredItems.slice(0);

        switch (id) {

            case 'price-sort-up':
                filteredItems = filteredItems.sort(function (a, b) {
                    return b.price - a.price;
                });
                break;
            case 'price-sort-down':
                filteredItems = filteredItems.sort(function (a, b) {
                    return a.price - b.price;
                });
                break;
        }
        activeSort = id;
        currentPage = 0;

        renderCatalog(filteredItems, currentPage, true);
    }

    function getCatalog(noFilter, filterPrice, filterConst) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'data/catalog.json');
        xhr.onload = function (evt) {
            var rawData = evt.target.response;
            var loadedCatalog = JSON.parse(rawData);
            catalog =  loadedCatalog;


            if (noFilter == true) {

                filteredItems = loadedCatalog.slice(0);

                getPrices(filteredItems);
                renderCatalog(filteredItems, currentPage);


            } else {

                if (filterPrice == true) {
                    var currentCatalog = loadedCatalog.slice(0);;
                    filteredItems = [];
                    filteredCatalog = [];

                    var j = 0;

                    for (var i = 0; i < currentCatalog.length; i++) {

                        if (currentCatalog[i].price >= resultMin.value && currentCatalog[i].price <= resultMax.value) {
                            filteredCatalog[j] = currentCatalog[i];
                            j++;
                        }
                        filteredItems = filteredCatalog;
                    }
                }

                if (filterConst) {

                    currentCatalog = filteredItems.slice(0);
                    filteredItems = [];
                    filteredCatalog = [];

                    j = 0;

                    for (var i = 0; i < currentCatalog.length; i++) {

                        for (var k = 0; k < filterConst.length; k++) {

                            if (currentCatalog[i].filter == filterConst[k]) {
                                filteredCatalog[j] = currentCatalog[i];
                                j++;
                                break;
                            }
                        }
                        filteredItems = filteredCatalog;
                    }

                }
                currentPage = 0;
                renderCatalog(filteredItems, currentPage, true);
            }
        };

        xhr.send();
    }

    function getPrices(aa) {

        allPrices = [];
        for (var i = 0; i < aa.length; i++) {
            allPrices[i] = aa[i].price;
        }

        minPrice = Math.min.apply(null, allPrices);
        maxPrice = Math.max.apply(null, allPrices);

        resultMin.value = Math.round(minPrice);
        resultMax.value = Math.round(maxPrice);
        scalePrize = (maxPrice - minPrice) / lenghtBar;
    }


// POPUP ITEM

    function itemPopUp() {
        var catalogList = document.querySelector('.catalog-page__list');
        var popup = document.querySelectorAll('.item');
        var itemWr = [].slice.call(document.querySelectorAll('.item__wrapper'));

        var buttonPrev = document.querySelectorAll('.item__button--prev');
        var buttonNext = document.querySelectorAll('.item__button--next');
        var next;
        var prev;
        var positionY;

        catalogList.classList.remove('catalog-page__list--nojs');

        console.log(popup);


        function popupWork (j) {

            var popupActive = document.querySelector('.item--popup');

            popup[j].classList.add('item--popup');

            if (popupActive != null) {
                popupActive.classList.remove('item--popup');
            }
            positionY = popup[j].offsetTop;

            window.scrollTo(0, positionY - 50);
        }


        itemWr.forEach(function (itemWr, i) {

            itemWr.addEventListener("click", function (event) {

                event.preventDefault();
                console.log(i);


                popupWork (i);
            })

            buttonNext[i].addEventListener('click', function () {

                next = i + 1;

                popup[i].classList.remove('item--popup');

                popupWork(next);
            })

            buttonPrev[i].addEventListener('click', function () {

                prev = i - 1;

                popup[i].classList.remove('item--popup');

                popupWork(prev);
            })
        });
    }

// PRICE FILTER

    var slider = document.querySelector('.price__bar');
    var coordSlider = getCoords(slider);

    var toggleMin = document.querySelector('.price__toggle--min');
    var toggleMax = document.querySelector('.price__toggle--max');

    var lenghtBar = getCoords(toggleMax).left - getCoords(toggleMin).right;

    var scalePrize;

    var yy = getCoords(toggleMin).right;

    var resultMin = document.getElementById('price-min');
    var resultMax = document.getElementById('price-max');

    function getCoords(elem) {   // кроме IE8-
        var box = elem.getBoundingClientRect();
        return {
            left: box.left + pageXOffset,
            right: box.right + pageXOffset
        };
    }

    toggleMin.onmousedown = function(e){

        var checkClickToggle = 1;

        var coords = getCoords(toggleMin);
        var shiftXLeft = e.pageX - coords.left;
        var shiftXRight = coords.right - e.pageX;

        function moveAt(e) {

            if (e.pageX - coordSlider.left - shiftXLeft >= 0) {
                if (getCoords(toggleMax).left - e.pageX - shiftXRight > -1) {
                    toggleMin.style.left = e.pageX - coordSlider.left - shiftXLeft + 'px';
                }
            } else toggleMin.style.left = 0;
        }

        document.onmousemove = function (e) {
            moveAt(e);
            resultMin.value = Math.round((getCoords(toggleMin).right - yy) * scalePrize);
        };

        document.onmouseup = function() {

            if (checkClickToggle == 1) {
                document.onmousemove = null;
                toggleMin.onmouseup = null;

                getCatalog(false, true, filterConsist);
                checkClickToggle = 0;

            }}
    };

    toggleMin.ondragstart = function() {
        return false;
    };

    toggleMax.onmousedown = function(e){

        var checkClickToggle = 1;

        var coords = getCoords(toggleMax);
        var shiftXLeft = e.pageX - coords.left;
        var shiftXRight = coords.right - e.pageX;

        function moveAt(e) {
            if (coordSlider.right - e.pageX - shiftXRight >= 0) {
                if (e.pageX - getCoords(toggleMin).right - shiftXLeft > -1) {
                    toggleMax.style.right = coordSlider.right - e.pageX - shiftXRight + 'px';
                }
            } else toggleMax.style.right = 0;
        }

        document.onmousemove = function (e) {
            moveAt(e);
            resultMax.value = Math.round((getCoords(toggleMax).left - yy) * scalePrize);
        };

        document.onmouseup = function(){
            if (checkClickToggle == 1){
                document.onmousemove = null;
                toggleMax.onmouseup = null;

                getCatalog(false, true, filterConsist);
                checkClickToggle = 0;

            }};
    };

    toggleMax.ondragstart = function() {
        return false;
    };

// CONSIST FILTER

    var consist = document.querySelectorAll('.catalog-page__filter-consist__input');
    var consistValue = document.querySelectorAll('.catalog-page__filter-consist__label');

    var filterConsist = [];
    var jj = 0;

    consist[0].onclick = function (evt) {
        if (consist[0].checked == false) {
            consist[0].checked = true;
        } else {
            for ( var qq = 1; qq < consist.length; qq++) {
                consist[qq].checked = false;
                filterConsist[qq - 1] = consistValue[qq].textContent;
            }
            getCatalog(false, true, filterConsist);
        }
    }

    for (var i = 1; i < consist.length; i++) {

        consist[i].onclick = function (evt) {

            jj = 0;
            filterConsist = [];

            for ( var qq = 1; qq < consist.length; qq++) {
                if (consist[qq].checked) {
                    filterConsist[jj] = consistValue[qq].textContent;
                    jj++;
                }
            }

            if (filterConsist.length == 0) {
                consist[0].checked = true;

                for ( var qq = 1; qq < consistValue.length; qq++) {

                    filterConsist[qq - 1] = consistValue[qq].textContent;
                }
            } else {
                consist[0].checked = false;
            }
            getCatalog(false, true, filterConsist);

        };
    }

})();

