var MembersCtrl = ['$scope','$routeParams','$location','ApiModel','$timeout',
	function($scope,$routeParams,$location,ApiModel,$timeout){

		$scope.params = $routeParams;

		$scope.members = $scope.$parent.users;

		$scope.filter = '';

		$scope.filterUsers = function(){

			var temp = [];

			$.each($scope.$parent.users,function(key,val){

				if ( val.gamertag.toLowerCase().search($scope.filter.toLowerCase()) != -1 ){

					temp.push(val);

				}

			});

			$scope.members = temp;

		};

	}
];