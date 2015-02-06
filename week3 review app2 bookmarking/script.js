var app = app || {};

app.firebase = 'https://blazing-fire-5581.firebaseio.com/';

app.bookmarks = [];

app.bookmark = function (name, url, category, count) {
    this.name = name;
    this.url = url;
    this.category = category;
    this.count = function () {
        for (var i in app.bookmarks) {
            return i;
        }
    };
};

app.addBookmark = function () {
    var name = $('#inputName').val();
    var url = $('#inputUrl').val();
    var category = $('#inputCat').val();
    var count = app.bookmark.count;
    var bookmark = new app.bookmark(name, url, category, count);
    app.bookmarks.push(bookmark);
    app.PostAJAX(app.postCallback, bookmark);
    name = $('#inputName').val('');
    url = $('#inputUrl').val('');
    category = $('#inputCat').val('');
};

app.displayBookmarks = function () {
    var elem = $('#showBookmarks'), bookmark;
    elem.html('');
    for (var i = 0; i < app.bookmarks.length; i++) {
        bookmark = app.bookmarks[i];
        elem.append('<div class="well well-sm" id="bookmarkWell"><h1>' + bookmark.name + '</h1><br /><h5><a href="' + bookmark.url + '">Visit Website</a></h5><br /><h5>' + bookmark.category + '</h5><button class="btn btn-warning"><span class="glyphicon glyphicon-pencil"></span></button><button class="btn btn-danger" id="deleteBtn"><span class="glyphicon glyphicon-trash"></span></button></div>');
    }
};

app.updatePage = function (bookmark) {
    bookmark = app.bookmarks[app.bookmarks.length - 1];
    i = app.bookmarks.length - 1;
    $('#showBookmarks').append('<div class="well well-sm"><h1>' + bookmark.name + '</h1><br /><h5><a href="' + bookmark.url + '">Visit Website</a></h5><br /><h5>' + bookmark.category + '</h5><button class="btn btn-warning"><span class="glyphicon glyphicon-pencil"></span></button><button class="btn btn-danger" id="deleteBtn"><span class="glyphicon glyphicon-trash"></span></button></div>');
};

app.PostAJAX = function (callback, data) {
    var request = new XMLHttpRequest();
    request.open('POST', app.firebase + '.json', true);
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            var response = JSON.parse(this.response);
            callback(response, data);
        } else {
            console.log('There is an error in your POST');
        }
    };
    request.send(JSON.stringify(data));
};

app.postCallback = function (response, data) {
    data.key = response.name;
    app.bookmarks.push(data);
    app.updatePage(data);
};

app.GetAJAX = function (callback) {
    var request = new XMLHttpRequest();
    request.open('GET', app.firebase + '.json', true);
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            var response = JSON.parse(this.response);
            callback(response);
        } else {
            console.log('There is an error in your GET');
        }
    };
    request.send();
};

app.getCallback = function (request) {
    for (var prop in request) {
        request[prop].key = prop;
        app.bookmarks.push(request[prop]);
    }
    app.displayBookmarks();
};

app.GetAJAX(app.getCallback);