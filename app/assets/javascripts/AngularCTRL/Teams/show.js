var TeamsShowCtrl = ['$scope','$routeParams','$location','ApiModel','$timeout',
	function($scope,$routeParams,$location,ApiModel,$timeout){

		$scope.params = $routeParams;
		$scope.team = {};
		$scope.members = [];
		$scope.i_am_admin = false;
		$scope.userFilter = 'accepted';
		$scope.teammateAdder = null;

		$scope.getTeam = function(){

			this.options = {
				type: 'teams',
				id: $scope.params.id
			};

			ApiModel.query(this.options,function(data){

				var temp = [];

				$scope.team = data.body.results[0];
				$.each(data.body.results,function(key,val){

					val.user.admin = val.admin;
					val.user.status = val.status;
					val.user.relationId = val.objectId;

					if (val.user.objectId == current_user.objectId && val.user.admin){
						$scope.i_am_admin = true;
					}

					temp.push(val.user);

				});

				$scope.members = temp;

			});

		};
		$scope.getTeam();

		$scope.inviteMember = function(user){

			if (!confirm('Are you sure you wish to invite '+user.gamertag+'?')){
				return false;
			}

			this.options = {
				type: 'relations'
			};

			var Item = {
				team: {
					__type: 'Pointer',
					className: 'Teams',
					objectId: $scope.params.id
				},
				user: {
					__type: 'Pointer',
					className: '_User',
					objectId: user.objectId
				},
				admin: false,
				type: 'team',
				status: 'invited'
			};

			var Relation = new ApiModel({relation: Item});

			Relation.$create(this.options,function(data){

				user.relationId = data.body.objectId;
				user.status = 'invited'
				$scope.members.push(user);

				$scope.userFilter = 'invited';

			},function(){

				// $scope.members.removeWhere('objectId',item.objectId);

			});

		};

		$scope.editAdmin = function(user){

			this.options = {
				type: 'relations',
				id: user.relationId
			};

			var Relation = new ApiModel({relation: {admin: user.admin}});

			Relation.$save(this.options,function(data){

				JP(data);

			});

		};

		$scope.addMember = function(i){

			var user = angular.copy($scope.members[i]);

			this.options = {
				type: 'relations',
				id: user.relationId
			};

			var Relation = new ApiModel({relation: {status: 'accepted'}});

			Relation.$save(this.options,function(data){

				$scope.members[i].status = 'accepted';
				$scope.userFilter = 'accepted';

			});

		};

		$scope.removeMember = function(user){

			if (!confirm('Are you sure you wish to remove '+user.gamertag+'?')){
				return false;
			}

			this.options = {
				type: 'relations',
				id: user.relationId
			};

			ApiModel.destroy(this.options,function(data){

				$scope.members.removeWhere('objectId',user.objectId);

			});

		};

	}
];