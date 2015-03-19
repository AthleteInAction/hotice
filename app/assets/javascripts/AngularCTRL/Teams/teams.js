var TeamsCtrl = ['$scope','$routeParams','$location','ApiModel','$timeout',
	function($scope,$routeParams,$location,ApiModel,$timeout){

		$scope.params = $routeParams;

		$scope.sort = 'name';
		$scope.allteams = '';
		$scope.rev = false;
		$scope.loading = false;

		$scope.teams = [];
		$scope.tTeams = {};

		$scope.getTeams = function(){

			$scope.loading = true;

			this.options = {
				type: 'relations',
				constraints: '{"type":"team","status":"accepted"}',
				include: 'user,team'
			};

			ApiModel.query(this.options,function(data){

				var temp = data.body.results;

				$.each(temp,function(key,val){

					temp[key].on_roster = false;
					val.team.on_roster = false;

					$scope.tTeams[val.team.objectId] = val.team;

				});

				$.each(temp,function(key,val){

					if (val.user.objectId == $scope.$parent.current_user.objectId){
						$scope.tTeams[val.team.objectId].on_roster = true;
					}

				});

				$.each($scope.tTeams,function(key,val){

					$scope.teams.push(val);

				});
				
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