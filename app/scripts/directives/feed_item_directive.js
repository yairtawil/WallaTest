angular.module('testApp.directives').directive('feedItem', function ($http, $sce) {
	var feedItem = {};
	feedItem.restrict = "E";
	feedItem.templateUrl = "views/directives/feed_item.html";
	feedItem.scope = {
		item: "=",
	};
	feedItem.link = function (scope, elem, attr) {
		scope.$sce = $sce;
	};
	return feedItem;
});
