var SeasonShowCtrl = ['$scope','$routeParams','$location','ApiModel','$timeout','$interval',
	function($scope,$routeParams,$location,ApiModel,$timeout,$interval){

		var scope = $scope;

		scope.params = $routeParams;

		var tabs = {
			'overview': 'overview',
			'signup': 'signup'
		};

		scope.tab = tabs[scope.params.tab] || 'overview';

		$scope.getEvent = function(){

			this.options = {
				type: 'relations',
				constraints: '{"$or":[{"event":{"__type": "Pointer","className": "Events","objectId": "'+$scope.params.id+'"},"status":"blank","type":"season"},{"event":{"__type": "Pointer","className": "Events","objectId": "'+$scope.params.id+'"},"status":"signup","type":"season","user":{"__type":"Pointer","className":"_User","objectId":"'+current_user.objectId+'"}}]}',
				include: 'team,user,event'
			};

			ApiModel.query(this.options,function(data){

				angular.forEach(data.body.results,function(val,key){

					if (val.status == 'blank'){
						$scope.event = val.event;
					}

					if (val.status == "signup"){
						$scope.i_am_in = true;
					}

				});

			});

		};
		$scope.getEvent();

	}
];