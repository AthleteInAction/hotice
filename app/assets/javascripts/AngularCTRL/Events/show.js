var EventShowCtrl = ['$scope','$routeParams','$location','ApiModel','$timeout',
	function($scope,$routeParams,$location,ApiModel,$timeout){

		$scope.params = $routeParams;

		$scope.tab = 'overview';

		if ($scope.params.tab == 'bracket'){
			$scope.tab = 'bracket';
		}
		if ($scope.params.tab == 'myteams'){
			$scope.tab = 'myteams';
		}
		if ($scope.params.tab == 'faq'){
			$scope.tab = 'faq';
		}

		$scope.teamFilter = true;

		$scope.registeredTeams = {};
		$scope.registeredList = {};
		$scope.myTeams = [];
		$scope.displayTeams = [];
		$scope.displayRegisteredTeams = [];


		$scope.getData = function(){

			this.options = {
				type: 'relations',
				constraints: '{"$or":[{"event":{"__type": "Pointer","className": "Events","objectId": "'+$scope.params.id+'"},"type": "event"},{"user": {"__type": "Pointer","className": "_User","objectId": "'+current_user.objectId+'"},"type": "team"}]}',
				include: 'team,user,event'
			};

			ApiModel.query(this.options,function(data){

				var e = false;

				$.each(data.body.results,function(key,val){

					// Get Event
					if (val.event && !e){
						$scope.event = val.event;
						$scope.getArticle($scope.event.articleId);
						e = true;
					}

					// Get Registered Teams
					if (val.type == 'event' && val.status != 'blank'){
						$scope.registeredTeams[val.team.objectId] = val.objectId;
						$scope.registeredList[val.team.objectId] = val.team;
					}

				});

				// Determine if registered
				$.each(data.body.results,function(key,val){

					// Get My Teams
					if (val.type == 'team'){

						if ($scope.registeredTeams[val.team.objectId]){
							val.team.relationId = $scope.registeredTeams[val.team.objectId];
							val.team.registered = true;
						} else {
							val.team.relationId = null;
							val.team.registered = false;
						}

						$scope.myTeams.push(val.team);
					}

				});

				$scope.displayTeams = $scope.myTeams;

				$scope.displayRegisteredTeams = [];

				$.each($scope.registeredList,function(key,val){

					$scope.displayRegisteredTeams.push(val);

				});

			});

		};
		$scope.getData();

		$scope.getArticle = function(id){

			this.options = {
				type: 'zendesk',
				sub: 'articles',
				id: id
			};

			ApiModel.query(this.options,function(data){

				$scope.event.article = data.body.article;

			});

		};

		$scope.registerTeam = function(i){

			$scope.$parent.loading = true;

			var team = $scope.displayTeams[i];

			this.options = {
				type: 'relations'
			};

			var r = {
				relation: {
					type: 'event',
					team: {
						__type: 'Pointer',
						className: 'Teams',
						objectId: team.objectId
					},
					user: {
						__type: 'Pointer',
						className: '_User',
						objectId: current_user.objectId	
					},
					event: {
						__type: 'Pointer',
						className: 'Events',
						objectId: $scope.params.id
					}
				}
			}

			var Relation = new ApiModel(r);

			Relation.$create(this.options,function(data){

				$scope.displayTeams[i].registered = true;
				$scope.displayTeams[i].relationId = data.body.objectId;
				$scope.teamFilter = true;
				$scope.$parent.loading = false;

			},function(){

				$scope.$parent.loading = false;

			});

		};

		$scope.unregisterTeam = function(i){

			$scope.$parent.loading = true;

			var team = $scope.displayTeams[i];

			this.options = {
				type: 'relations',
				id: team.relationId
			};

			ApiModel.destroy(this.options,function(data){

				$scope.displayTeams[i].registered = false;
				$scope.displayTeams[i].relationId = null;
				$scope.$parent.loading = false;

			},function(data){

				$scope.$parent.loading = false;

			});

		};

	}
];