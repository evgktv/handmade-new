(function () {
    /**
     * @param {Object} data
     * @constructor
     */
    function Item(data) {
        this._data = data;
    }

    // Create element from template


    Item.prototype.render = function () {
        var template = document.querySelector('#item-template');

        if ('content' in template) {
            this.element = template.content.children[0].cloneNode(true);
        } else {
            this.element = template.children[0].cloneNode(true);
        }

        this.element.querySelector('.item__title').textContent = this._data.title;
        this.element.querySelector('.item__price').textContent = this._data.price;
        this.element.querySelector('.item__title').textContent = this._data.title;

        //Image Load for Item

        var IMAGE_TIMEOUT = 10000;
        var previewImage = new Image();
        var imageLoadTimeout = setTimeout(function () {
            previewImage.src = '';
        }, IMAGE_TIMEOUT);

        previewImage.onload = function () {
            clearTimeout(imageLoadTimeout);
            this.element.querySelector('.item__img').src = this._data.preview;
        }.bind(this);

        previewImage.src = this._data.preview;
    };

    Item.prototype.showPopup = function () {
        var popupActive = null;

        this.element.addEventListener('click', function (evt) {
            var popup = document.querySelector('.item--popup');
            var positionY;

            if (popupActive!=null) {
                popupActive.classList.remove('item--popup');
            }

            if (this.classList.contains('item')) {
                this.classList.add('item--popup');

                positionY = this.offsetTop;

                window.scrollTo(0, positionY - 50);
            };

            popupActive = popup;
        })
    };

    window.Item = Item;
})();