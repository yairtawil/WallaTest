angular.module('testApp.services').service('serverService', function ($http) {
	var serverService = {};

	serverService.getRssFeed = function (url) {
		return $http.jsonp("http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&q=" + url + "&callback=JSON_CALLBACK")
	};

	return serverService;
});
