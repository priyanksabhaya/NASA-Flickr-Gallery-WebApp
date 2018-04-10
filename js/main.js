(function (document, window) {
    'use strict';

    var gallery;
    var lastSearch = ''; //initializing with empty string to load complete NASA profile.

    //**********************\\Following funcntion loads initial NASA's Flickr profile or searched query against the NASA's Flickr profile//**********************\\
    function searchPhotos(text, page) {

        page = page > 0 ? page : 1;
        if (text.length === 0) {
            Flickr.loadNASAGallery({
                per_page: 8,
                jsoncallback: 'Website.Homepage.showPhotos',
                page: page
            });
        } else {
            Flickr.searchText({
                text: text,
                per_page: 8,
                jsoncallback: 'Website.Homepage.showPhotos',
                page: page
            });
        }
    }
    //***********************************************************************************************************************************************************\\

    //*****************************************\\Following function contains logic for adding Pager//************************************************************\\
    function createPager(element, parameters) {
        //******************************\\If Pages are less than 5 then show available no. of pages in PAGER//*******************************\\
        if (parameters.pagesNumber < 5) {
            var pagesToShow = parameters.pagesNumber;
        }
        //********************************************\\Or else show only 5 pages option in PAGER//******************************************\\
        else {
            var pagesToShow = 5;
        }
        
        var url = '/search/' + parameters.query + '/';
        element.textContent = '';

        var previousLinks = {
            '&lt;&lt;': 1,
            '&lt;': (parameters.currentPage - 1 || parameters.currentPage)
        };

        for (var key in previousLinks) {
            link = document.createElement('a');
            link.href = url + previousLinks[key];
            link.innerHTML = '<span class="js-page-number visually-hidden">' + previousLinks[key] + '</span>' + key;
            var listItem = document.createElement('li');
            listItem.appendChild(link);
            element.appendChild(listItem);
        }

        //************************\\Avoid showing less than 6 pages in the pager because the user reaches the end//************************\\
        var pagesDifference = parameters.pagesNumber - parameters.currentPage;
        var startIndex = parameters.currentPage;
        if (pagesDifference < pagesToShow) {
            startIndex = parameters.currentPage - (pagesToShow - pagesDifference - 1) || 1;
        }
        var link;
        for (var i = startIndex; i < parameters.currentPage + pagesToShow && i <= parameters.pagesNumber; i++) {
            link = document.createElement('a');
            link.href = url + i;
            link.innerHTML = '<span class="js-page-number">' + i + '</span>';
            if (i === parameters.currentPage) {
                link.className += ' current';
            }
            listItem = document.createElement('li');
            listItem.appendChild(link);
            element.appendChild(listItem);
        }

        var nextLinks = {
            '&gt;': (parameters.currentPage === parameters.pagesNumber ? parameters.pagesNumber : parameters.currentPage + 1),
            '&gt;&gt;': parameters.pagesNumber
        };

        for (key in nextLinks) {
            link = document.createElement('a');
            link.href = url + nextLinks[key];
            link.innerHTML = '<span class="js-page-number visually-hidden">' + nextLinks[key] + '</span>' + key;
            var listItem = document.createElement('li');
            listItem.appendChild(link);
            element.appendChild(listItem);
        }
    }
    //********************************************************************\\End of Pager Logic//****************************************************************\\

    function showPhotos(data) {
        createPager(
            document.getElementsByClassName('js-thumbnails__pager')[0], {
                query: lastSearch,
                currentPage: data.photos.page,
                pagesNumber: data.photos.pages
            }
        );

        gallery = new Gallery(data.photos.photo, document.getElementsByClassName('js-gallery__image')[0]);
        gallery.createThumbnailsGallery(document.getElementsByClassName('js-thumbnails__list')[0]);
    }

    //*****************************************\\Following function works as an initial constructor//***********************************************************\\
    function init() {
        //***************************************\\Adding EventListner for Search functionality//*************************************\\
        var searchButton = document.getElementsByClassName('js-form-search')[0];
        searchButton.addEventListener('submit', function (event) {
            event.preventDefault();

            lastSearch = document.getElementById('query').value;
            searchPhotos(lastSearch, 1);
        });

        //***********************************\\Adding EventListner for Previous Photo functionality//*********************************\\
        var leftArrow = document.getElementsByClassName('js-gallery__arrow--left')[0];
        leftArrow.addEventListener('click', function () {
            gallery.showPrevious.bind(gallery)();
        });

        //************************************\\Adding EventListner for Next Photo functionality//************************************\\
        var rightArrow = document.getElementsByClassName('js-gallery__arrow--right')[0];
        rightArrow.addEventListener('click', function () {
            gallery.showNext.bind(gallery)();
        });

        //*************************************\\Adding EventListner for Pager functionality//****************************************\\
        document.getElementsByClassName('js-thumbnails__pager')[0].addEventListener('click', function (event) {
            event.preventDefault();
            var page;
            var currentLink = this.getElementsByClassName('current')[0];
            if (event.target.nodeName === 'SPAN') {
                page = event.target.textContent;
            } else if (event.target.nodeName === 'A') {
                page = event.target.getElementsByClassName('js-page-number')[0].textContent;
            }

            //*******************************************\\Avoid reloading the same page//********************************************\\
            if (page && page !== currentLink.getElementsByClassName('js-page-number')[0].textContent) {
                searchPhotos(lastSearch, page);
            }
        });

        //**************************************************\\Kickstart the page//****************************************************\\
        searchPhotos(lastSearch, 1);  // lastSearch is initialized with empty String which will load the complete NASA Profile
    }
    //*****************************************************\\END of initial constructor//*********************************************************************\\

    window.Website = Utility.extend(window.Website || {}, {
        Homepage: {
            init: init,
            showPhotos: showPhotos
        }
    });
})(document, window);

Website.Homepage.init();