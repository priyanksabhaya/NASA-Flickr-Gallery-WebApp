(function (document, window) {
    'use strict';

    var apiKey = 'a5e95177da353f58113fd60296e1d250';
    var userid = '24662369@N07';
    var apiURL = 'https://api.flickr.com/services/rest/';

    //*********************************\\Following function searches for the passed string within NASA profile//**********************************\\
    function searchText(parameters) {
        var requestParameters = Utility.extend(parameters, {
            method: 'flickr.photos.search',
            api_key: apiKey,
            user_id: userid,
            format: 'json'
        });

        var script = document.createElement('script');
        script.src = Utility.buildUrl(apiURL, requestParameters);
        document.head.appendChild(script);
        document.head.removeChild(script);
    }
    
    //******************************************\\Following function loads the complete NASA profile//******************************************\\
    function loadNASAGallery(parameters) {
        var requestParameters = Utility.extend(parameters, {
            method: 'flickr.people.getPublicPhotos',
            api_key: apiKey,
            user_id: userid,
            format: 'json',
            nojsoncallback: 1
        });

        var script = document.createElement('script');
        script.src = Utility.buildUrl(apiURL, requestParameters);
        document.head.appendChild(script);
        document.head.removeChild(script);
    }

    //*******************************************************\\Constructing Image URL//*********************************************************\\
    function buildThumbnailUrl(photo) {
        return 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server +
            '/' + photo.id + '_' + photo.secret + '_q.jpg';
    }

    function buildPhotoUrl(photo) {
        return 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server +
            '/' + photo.id + '_' + photo.secret + '.jpg';
    }

    function buildPhotoLargeUrl(photo) {
        return 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server +
            '/' + photo.id + '_' + photo.secret + '_b.jpg';
    }

    window.Flickr = Utility.extend(window.Flickr || {}, {
        buildThumbnailUrl: buildThumbnailUrl,
        buildPhotoUrl: buildPhotoUrl,
        buildPhotoLargeUrl: buildPhotoLargeUrl,
        searchText: searchText,
        loadNASAGallery: loadNASAGallery
    });
})(document, window);