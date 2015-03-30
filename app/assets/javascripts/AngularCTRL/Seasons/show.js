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
				constraints: '{"$or":[{"event":{"__type": "Pointer","className": "Events","objectId": "'+scope.params.id+'"},"status":"blank","type":"season"},{"event":{"__type": "Pointer","className": "Events","objectId": "'+scope.params.id+'"},"status":"signup","type":"season","user":{"__type":"Pointer","className":"_User","objectId":"'+current_user.objectId+'"}}]}',
				include: 'team,user,event'
			};

			ApiModel.query(this.options,function(data){

				JP(this.options);
				JP(data);

				angular.forEach(data.body.results,function(val,key){

					if (val.status == 'blank'){
						scope.event = val.event;
					}

					if (val.status == "signup"){
						scope.i_am_in = true;
						scope.myRelationId = val.objectId;
					}

				});

				if (scope.event){scope.getArticle(scope.event.articleId);}

			},function(data){

				JP(this.options);
				JP({e: data});

			});

		};
		$scope.getEvent();

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

		$scope.signUp = function(){

			$scope.$parent.x.signUp = true;

			this.options = {
				type: 'relations'
			};

			var Relation = new ApiModel({
				relation: {
					user: {
						__type: 'Pointer',
						className: '_User',
						objectId: current_user.objectId
					},
					type: 'season',
					status: 'signup',
					event: {
						__type: 'Pointer',
						className: 'Events',
						objectId: scope.params.id
					}
				}
			});

			Relation.$create(this.options,function(data){

				delete $scope.$parent.x.signUp;
				scope.i_am_in = true;
				scope.myRelationId = data.body.objectId;

			},function(data){

				JP({e: data});

				delete $scope.$parent.x.signUp;

			});

		};

		$scope.unRegister = function(){

			if (!confirm('Are you sure you wish to remove yourself from this event?')){return false;}

			$scope.$parent.x.signUp = true;

			this.options = {
				type: 'relations',
				id: scope.myRelationId
			};

			ApiModel.destroy(this.options,function(data){

				$scope.$parent.x.signUp = false;
				scope.i_am_in = false;
				scope.myRelationId = null;

			},function(data){

				$scope.$parent.x.signUp = false;

			});

		};

	}
];