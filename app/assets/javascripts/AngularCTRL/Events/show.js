var EventShowCtrl = ['$scope','$routeParams','$location','ApiModel','$timeout','$interval',
	function($scope,$routeParams,$location,ApiModel,$timeout,$interval){

		$scope.params = $routeParams;

		$scope.tab = 'overview';

		if ($scope.params.tab == 'bracket'){
			$scope.tab = 'bracket';
		}
		if ($scope.params.tab == 'myteams'){
			$scope.tab = 'myteams';
		}
		if ($scope.params.tab == 'chat'){
			$scope.tab = 'chat';
		}

		$scope.teamFilter = true;

		$scope.registeredTeams = {};
		$scope.registeredList = {};
		$scope.myTeams = [];
		$scope.displayTeams = [];
		$scope.displayRegisteredTeams = [];
		$scope.chat_entry = null;
		$scope.chat_holder = 'Enter message...'

		$scope.roster = {};
		$scope.dRoster = {};

		$scope.messages = [];

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

						val.team.i_am_admin = val.admin;

						$scope.myTeams.push(val.team);
					}

				});

				$scope.displayTeams = $scope.myTeams;

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

		$scope.registerTeam = function(team){

			$scope.$parent.loading = true;

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

				team.registered = true;
				team.relationId = data.body.objectId;
				$scope.$parent.loading = false;

			},function(){

				$scope.$parent.loading = false;

			});

		};

		$scope.unregisterTeam = function(team){

			$scope.$parent.loading = true;

			this.options = {
				type: 'relations',
				id: team.relationId
			};

			ApiModel.destroy(this.options,function(data){

				team.registered = false;
				team.relationId = null;
				$scope.$parent.loading = false;

			},function(data){

				$scope.$parent.loading = false;

			});

		};

		$scope.getRoster = function(id){

			if ($scope.dRoster[id]){
				$scope.roster[id] = angular.copy($scope.dRoster[id]);
				return false;
			}

			$scope.$parent.loading = true;

			this.options = {
				type: 'relations',
				constraints: '{"$or":[{"type":"team","team":{"__type":"Pointer","className":"Teams","objectId":"'+id+'"},"status":"accepted"},{"type":"event_roster","team":{"__type":"Pointer","className":"Teams","objectId":"'+id+'"},"event":{"__type":"Pointer","className":"Events","objectId":"'+$scope.params.id+'"}}]}',
				include: 'user'
			};

			ApiModel.query(this.options,function(data){

				var r = [];
				var e = {};

				$.each(data.body.results,function(key,val){

					if (val.type == 'event_roster'){

						val.user.relationId = val.objectId;
						e[val.user.objectId] = val.user;

					}

				});

				$.each(data.body.results,function(key,val){

					if (val.type == 'team'){

						if (e[val.user.objectId]){
							val.user.event_active = true;
							val.user.relationId = e[val.user.objectId].relationId;
						} else {
							val.user.event_active = false;
							val.user.relationId = null
						}
						val.user.teamId = id;
						r.push(val.user);

					}

				});

				$scope.roster[id] = r;
				$scope.dRoster[id] = r;

				$scope.$parent.loading = false;

			},function(data){

				$scope.$parent.loading = false;

			});

		};

		$scope.setStatus = function(user){

			$scope.$parent.loading = true;

			this.options = {
				type: 'relations'
			};

			if (user.event_active){

				var r = {
					event: {
						__type: 'Pointer',
						className: 'Events',
						objectId: $scope.params.id
					},
					team: {
						__type: 'Pointer',
						className: 'Teams',
						objectId: user.teamId
					},
					user: {
						__type: 'Pointer',
						className: '_User',
						objectId: user.objectId
					},
					type: 'event_roster'
				};

				var Relation = new ApiModel({relation: r});

				Relation.$create(this.options,function(data){

					user.relationId = data.body.objectId;
					$scope.dRoster[user.teamId] = angular.copy($scope.roster[user.teamId]);
					$scope.$parent.loading = false;

				},function(data){

					$scope.$parent.loading = false;
					user.event_active = false;
					$scope.dRoster[user.teamId] = angular.copy($scope.roster[user.teamId]);

				});

			} else {

				this.options.id = user.relationId;

				ApiModel.destroy(this.options,function(data){

					$scope.dRoster[user.teamId] = angular.copy($scope.roster[user.teamId]);
					$scope.$parent.loading = false;

				},function(data){

					$scope.dRoster[user.teamId] = angular.copy($scope.roster[user.teamId]);
					user.event_active = true;
					$scope.$parent.loading = false;

				});

			}

		};

		$scope.sendMessage = function(entry){

			$scope.chat_entry = null;
			$scope.chat_holder = 'Saving...'

			var body = angular.copy(entry);

			this.options = {
				type: 'messages'
			};

			var m = {
				message: {
					eventId: $scope.params.id,
					userId: $scope.$parent.current_user.objectId,
					body: body
				}
			};

			var Message = new ApiModel(m);

			Message.$create(this.options,function(data){

				$scope.messages.unshift(data.message);
				$scope.chat_entry = null;
				$scope.chat_holder = 'Enter message...'

			},function(){

				$scope.chat_entry = body;
				$scope.chat_holder = 'Enter message...'

			});

		};

		$scope.getMessages = function(){

			this.options = {
				type: 'messages',
				sub: 'events',
				id: $scope.params.id
			};

			ApiModel.query(this.options,function(data){

				$scope.messages = data.messages;

			},function(data){

				JP({e: data});

			});

		};
		$scope.getMessages();
		$interval(function(){
			// $scope.getMessages();
		},1000);

	}
];