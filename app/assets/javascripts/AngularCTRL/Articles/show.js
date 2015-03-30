var ArticlesShowCtrl = ['$scope','$routeParams','$location','ApiModel','$timeout',
	function($scope,$routeParams,$location,ApiModel,$timeout){

		var scope = $scope;
		scope.params = $routeParams;

		var parent = scope.$parent;

		scope.comments = [];

		scope.zd_list = [];
		scope.zd_key = {};

		scope.comment = {
			locale: 'en-us',
			author: {
				name: 'Ruby Tester',
				email: 'h1@h1.com'
			}
		};

		scope.getArticle = function(){

			this.options = {
				type: 'zendesk',
				sub: 'articles',
				id: scope.params.id
			};

			ApiModel.query(this.options,function(data){
				
				scope.article = data.body.article;

			});

		};
		scope.getArticle();

		scope.getComments = function(){

			this.options = {
				type: 'zendesk',
				sub: 'articles',
				id: scope.params.id,
				extend: 'comments'
			};

			ApiModel.query(this.options,function(data){

				angular.forEach(data.body.comments,function(val,key){

					scope.zd_list.push(val.author_id);

				});

				scope.comments = data.body.comments;

				scope.getZDUsers();

			});

		};
		scope.getComments();

		scope.getZDUsers = function(){

			this.options = {
				type: 'zendesk',
				sub: 'users',
				second: 'many',
				ids: scope.zd_list.join(',')
			};

			ApiModel.query(this.options,function(data){

				angular.forEach(data.body.users,function(val,key){

					scope.zd_key[val.id] = val.name;

				});

			});

		};

		scope.createComment = function(){

			parent.x.comment = true;

			this.options = {
				type: 'zendesk',
				sub: 'articles',
				id: scope.params.id,
				extend: 'comments'
			};

			var c = angular.copy(scope.comment);

			var Comment = new ApiModel({comment: c});

			Comment.$create(this.options,function(data){

				JP(data);
				delete parent.x.comment;

			},function(data){

				JP({e: data});
				delete parent.x.comment;

			});

		};

	}
];