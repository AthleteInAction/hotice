var TeamsShowCtrl = ['$scope','$routeParams','$location','ApiModel','$timeout',
	function($scope,$routeParams,$location,ApiModel,$timeout){

		$scope.params = $routeParams;
		$scope.team = {};
		$scope.members = [];
		$scope.i_am_admin = false;
		$scope.userFilter = 'accepted';
		$scope.teammateAdder = null;
		$scope.myRelationId = null;

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

					if (val.user.objectId == current_user.objectId && val.status == 'accepted'){
						$scope.i_am_teammate = true;
						$scope.myRelationId = val.objectId;
					};

					if (val.user.objectId == current_user.objectId && val.status == 'invited'){
						$scope.i_am_invited = true;
						$scope.myRelationId = val.objectId;
					};

					if (val.user.objectId == current_user.objectId && val.status == 'requested'){
						$scope.i_am_requested = true;
						$scope.myRelationId = val.objectId;
					};

					temp.push(val.user);
					JP(temp);

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

			var Relation = new ApiModel({relation: Item,team: $scope.team.team,user: user});

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
				id: user.relationId,
				inviteeId: user.objectId
			};

			ApiModel.destroy(this.options,function(data){

				$scope.members.removeWhere('objectId',user.objectId);

			});

		};

		$scope.leaveTeam = function(){

			if (!confirm('Are you sure you want to leave this team?')){
				return false;
			};

			$scope.$parent.x[$scope.myRelationId] = true;

			this.options = {
				type: 'relations',
				id: $scope.myRelationId,
				inviteeId: current_user.objectId
			};

			ApiModel.destroy(this.options,function(data){

				$scope.i_am_teammate = false;
				$scope.myRelationId = null;
				delete $scope.$parent.x[$scope.myRelationId];
				$scope.members.removeWhere('objectId',current_user['objectId']);
				JP($scope.members);

			});

		};

		$scope.acceptInviteTeam = function(){

			$scope.$parent.x[$scope.myRelationId] = true;

			this.options = {
				type: 'relations',
				id: $scope.myRelationId,
				notification: 'delete'
			};

			var Relation = new ApiModel({relation: {status: 'accepted'}});

			Relation.$save(this.options,function(data){

				delete $scope.$parent.x[$scope.myRelationId];

				$scope.i_am_teammate = true;
				$scope.i_am_requested = false;
				$scope.i_am_invited = false;

				var u = angular.copy($scope.$parent.current_user);
				u.relationId = $scope.myRelationId;
				u.status = 'accepted';

				$scope.members.removeWhere('objectId',current_user.objectId);
				$scope.members.push(u);
				JP($scope.members);

			},function(){

				delete $scope.$parent.x[$scope.myRelationId];

			});

		};

	}
];