var TeamsNewCtrl = ['$scope','$routeParams','$location','ApiModel','$timeout',
	function($scope,$routeParams,$location,ApiModel,$timeout){

		$scope.current_user = current_user;

		var t = [
			{gamertag: 'AthleteInAction'},
			{gamertag: 'DafDHunter'},
			{gamertag: 'Octavarium XX'},
			{gamertag: 'DeltaShark96'},
			{gamertag: 'Digs510'},
			{gamertag: 'Finchpoker'}
		];

		$scope.submitting = false;

		$scope.team = {
			name: '',
			creator: current_user,
			wins: 0,
			losses: 0,
			otl: 0,
			dnf: 0
		};
		$scope.errors = {
			name: {
				unique: true,
				searching: false,
				message: null,
				valid: false
			}
		};

		$scope.addTeammate = function(item){

			$scope.team.invited.push(item);

			$scope.teammateAdder = null;

		};

		$scope.removeTeammate = function(i){

			var item = $scope.team.invited[i];

			$scope.team.invited.splice(i,1);

		};

		$scope.createTeam = function(){

			if ($scope.validate()){

				$scope.$parent.loading = true;

				var team = angular.copy($scope.team);

				team.creator = makePointer(team.creator,'_User');

				var Team = new ApiModel({team: team});

				Team.$create({type: 'teams'},function(data){

					$scope.$parent.loading = false;
					window.location = '/dashboard/#/teams/'+data.call_1.body.objectId;

				},function(){

					$scope.$parent.loading = false;

				});

			}

		};

		$scope.checkTeamName = function(){

			if ($scope.team.name.length > 0){

				this.options = {
					type: 'teams',
					constraints: '{"name_i":"'+$scope.team.name.toLowerCase()+'"}',
					count: 1,
					limit: 0
				};

				ApiModel.query(this.options,function(data){

					JP('CHECK');
					JP(data);

					if (data.body.count > 0){

						$scope.errors.name.message = '"'+$scope.team.name+'" has been taken.';

					} else {

						$scope.errors.name.message = null;
						$scope.errors.name.valid = true;

					}

					$scope.errors.name.searching = false;

				});

			}

		};

		$scope.nameSearch = function(){

			$scope.errors.name.valid = false;

			if ($scope.team.name.length > 0){

				$scope.errors.name.searching = true;
				$scope.errors.name.message = null;

			} else {

				$scope.errors.name.searching = false;
				$scope.errors.name.message = null;

			}

		};

		$scope.validate = function(){

			if ($scope.team.name.length > 0){

			} else {
				CLEAN = false;
				$scope.errors.name.message = 'Team name cannot be blank.';
				return false;
			}

			if (!$scope.errors.name.valid){

				return false;

			}

			return true;

		};

	}
];
Array.prototype.removeWhere = function(key,val){

    for (i = 0; i < this.length; i++) {
    	if (this[i][key] == val){

    		this.splice(i,1);

    	}
    }

}
Array.prototype.contains = function(key,val){
	
	var has = false;

    for (i = 0; i < this.length; i++) {
    	if (this[i][key] == val){
    		has = true;
    		break;
    	}
    }

    return has;
}