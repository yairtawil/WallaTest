angular.module('testApp.controllers').controller('MainCtrl',['$scope', 'serverService','$timeout','$filter', '$firebaseArray', '$state', '$stateParams', function ($scope, serverService, $timeout, $filter, $firebaseArray, $state, $stateParams) {
	'use strict';
  
  $scope.init = function () {
    // if(_.isEmpty($scope.rss_feeds)) return;
    var id = $stateParams.id;
    var rss_feed = _.find($scope.rss_feeds, {id: id});
    if(!rss_feed){
      $scope.selectRssFeed($scope.rss_feeds[_.size($scope.rss_feeds) - 1]);
      return;
    } 
    $scope.selected.rss_feed  = rss_feed;
    $scope.loadFeedData(rss_feed.url);  
  };

  $scope.show_descriptions = {};

  $scope.shown = {
    menu: true,
    add: true,
    search: true,
    urls: true
  };

  $scope.edit_variables = {};

	$scope.inputs = {
		add_url: "",
    add_url_error_msg: "",
	  search: "",
    search_result: ""
  };

  $scope.loading = {
    action: false
  };

  $scope.alert = {
    show: false,
    message: "",
    type: "",
    timeout: null
  };

	$scope.selected = {
		rss_feed: {},
		data: {}
	};


  var ref = new Firebase("https://scorching-torch-4.firebaseio.com/urls");
  $scope.rss_feeds = $firebaseArray(ref);
  $scope.rss_feeds.$loaded().then(
    function () {
      $scope.init();
    },
    function () {

    }
  )
    $scope.alertMessage = function (url, action, type) {
      $scope.alert.type = type;
      url = "'" + url;
      if(20 < _.size(url) ) url = url.slice(0, 17) + "..."; 
      $scope.alert.message = url + "' " + action;
      $scope.alert.show = true;
      $timeout.cancel($scope.alert.timeout);

      $scope.alert.timeout = $timeout(function () {
        $scope.alert.show = false;
      }, 3000);

    };

    $scope.noUrls = function () {
      return _.size($scope.filteredRssFeeds($scope.rss_feeds)) === 0;
    };

    $scope.editRssFeed = function (rss_feed, new_url) {
      var url_user = _.find($scope.rss_feeds, {url: new_url});
      var existing_url = !_.isEmpty(url_user);
      if (existing_url && url_user.id !== rss_feed.id) {
        $scope.inputs.add_url_error_msg = "Existing url, try another"
        $scope.alertMessage(new_url, "Existing url, try another!", "danger");
        return;
      }
      rss_feed.url = new_url;
      var key = _.indexOf($scope.rss_feeds, rss_feed);
      $scope.rss_feeds.$save(key).then(
        function () {
          $scope.edit_variables[rss_feed.id].show_edit = false
          $scope.alertMessage(new_url, "Edited Successfully!", "info");
          if ($scope.selected.rss_feed.id === rss_feed.id) {
            $scope.selectRssFeed(rss_feed);
          }
        },
        function () {

        }
      );
    };

    $scope.filteredRssFeeds = function (rss_feeds) {
      // return rss_feeds;
      return $filter("orderBy")($filter('filter')(rss_feeds, $scope.inputs.search_result), "-id");
    };

    $scope.loadFeedData = function (url) {
      $scope.loading.action = true;
      serverService.getRssFeed(url).then(
        function (response) {
          console.log("response = ",response);
          $scope.loading.action = false;
          $scope.selected.responseDetails = response.data.responseDetails;
          if (response.data.responseStatus === 200 && response.data.responseData) {
            $scope.selected.data = response.data.responseData.feed;
          } else {
            $scope.selected.data = null;
          }
        }, 
        function (error) {
          $scope.loading.action = false;
        } 
      );
    };

    $scope.isEmpty = function (data) {
      return _.isEmpty(data);
    };

    $scope.selectRssFeed = function (rss_feed) {
      $state.go("main", {id: rss_feed.id});
    };

  	$scope.generateId = function () {
  		var max_id_user = _.maxBy($scope.rss_feeds, "id");
  		return max_id_user ? max_id_user.id + 1 : 1;
  	};

  	$scope.addUrl = function  (url) {

      var existing_url = !_.isEmpty(_.find($scope.rss_feeds, {url: url}));
  		if (existing_url) {
        $scope.inputs.add_url_error_msg = "Existing url, try another"
        return;
      }
      var rss_feed = {id: $scope.generateId(), url: url};
  		// $scope.rss_feeds.push(rss_feed);
      $scope.rss_feeds.$add(rss_feed).then(
        function () {
          $scope.inputs.add_url = "";
          $scope.selectRssFeed(rss_feed);
          $scope.shown.urls = true;
          $scope.alertMessage(url, "Added Successfully!", "success");      
        },
        function () {

        }
      )
  	};

  	$scope.deleteRssFees = function (id) {
  		var rss_feed = _.find($scope.rss_feeds, {id: id});
  		if (rss_feed) {
  			var rss_feed_id = rss_feed.id;
  			var rss_feed_url = rss_feed.url;
        
        var rss_feed_index = _.indexOf($scope.rss_feeds, rss_feed);
  			$scope.rss_feeds.$remove(rss_feed_index).then(
          function (response) {
            if($scope.selected.rss_feed.id === rss_feed_id) {
              var next_index = rss_feed_index > 0 ? (rss_feed_index - 1) % _.size($scope.rss_feeds) : 0;
              $scope.selectRssFeed($scope.rss_feeds[next_index]);
            }
            $scope.alertMessage(rss_feed_url,"Removed Successfully!", "danger")
          },
          function (error) {

          }
        )
  		}
  	};
}]);
