var TeamsCtrl = ['$scope','$routeParams','$location','ApiModel','$timeout',
	function($scope,$routeParams,$location,ApiModel,$timeout){

		$scope.params = $routeParams;

		$scope.sort = 'name';
		$scope.allteams = '';
		$scope.rev = false;
		$scope.loading = false;

		$scope.teams = [];

		$scope.getTeams = function(){

			$scope.loading = true;

			this.options = {
				type: 'myteams'
			};

			ApiModel.query(this.options,function(data){

				var temp = [];

				angular.forEach(data.body.results,function(val,key){

					temp.push(val.team);

				});

				$scope.teams = temp;
				
				$scope.loading = false;

			},function(){

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