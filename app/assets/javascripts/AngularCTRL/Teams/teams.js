var TeamsCtrl = ['$scope','$routeParams','$location','ApiModel','$timeout',
	function($scope,$routeParams,$location,ApiModel,$timeout){

		$scope.params = $routeParams;

		$scope.sort = 'name';
		$scope.allteams = 'true';
		$scope.rev = false;
		$scope.loading = false;

		$scope.teams = [];

		$scope.getTeams = function(){

			$scope.loading = true;

			this.options = {
				type: 'teams'
			};

			ApiModel.query(this.options,function(data){

				$scope.teams = data.body.results;
				
				$scope.loading = false;

			});

		};

		$scope.getTeams();

		$scope.teamSort = function(){

			if ($scope.sort == 'name'){
				$scope.rev = false;
			} else {
				$scope.rev = true;
			}

		};

	}
];