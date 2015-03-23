var MainCtrl = ['$scope','$routeParams','$location','ApiModel','$timeout','$interval','API',
	function($scope,$routeParams,$location,ApiModel,$timeout,$interval,API){

		JP('MAIN');
		$scope.current_user = current_user;
		$scope.announcements = [];
		$scope.loading = false;
		$scope.user_key = {};
		$scope.main_chats = [];
		$scope.last_chat_id = null;

		$scope.x = {};
		// $scope.Prefix = Prefix;

		// $scope.$on('$routeChangeSuccess',function (event,current,previous,rejection){


			
		// });

		$scope.t = API.teams;
		$scope.t.get(function(teams){

			JP(teams);

		});

		zE(function(){
			var zduser = {
				name: current_user['gamertag'],
				email: current_user['email'],
				external_id: current_user['objectId']
			};
			zE.identify(zduser);
		});

		$scope.refreshUser = function(){

			this.options = {
				type: 'users',
				sub: 'me'
			};

			ApiModel.query(this.options,function(data){

				current_user = data.user;
				$scope.current_user = current_user;

			});

		};

		// if (!current_user.gamertagVerified){
		// 	$scope.refreshUser();
		// 	setInterval(function(){
		// 		if (!current_user.gamertagVerified){
		// 			$scope.refreshUser();
		// 		}
		// 	},20000);
		// }

		$scope.getUsers = function(complete){

			this.options = {
				type: 'users'
			};

			ApiModel.query(this.options,function(data){

				$scope.users = angular.copy(data.body.results);
				$scope.users.removeWhere('objectId',current_user.objectId);

				$.each(data.body.results,function(key,val){

					$scope.user_key[val.objectId] = val;

				});

				complete(data.body.results);

			});

		};
		$scope.getUsers(function(users){
			
			$scope.users = users;

		});


		$scope.getNotifications = function(complete){

			this.options = {
				type: 'notifications'
			};

			ApiModel.query(this.options,function(data){

				complete(data.body.results);

			});

		};
		$scope.getNotifications(function(notifications){
			$scope.notifications = notifications;
		});


		$scope.handleNotification = function(notification,accepted){

			

		};

		$scope.getOnlineUsers = function(){

			this.options = {
				type: 'online'
			};

			ApiModel.query(this.options,function(data){
				
				$scope.onlineUsers = data.results

			});

		};
		$scope.getOnlineUsers();

		// setInterval(function(){

		// 	$scope.getNotifications(function(notifications){
		// 		$scope.notifications = notifications;
		// 	});
		// 	$scope.getOnlineUsers();

		// },20000);

		$scope.linkTo = function(loc){

			window.location = loc;

		};

		$scope.displayDate = function(d){

			var obj = {
				sDate: '',
				fString: ''
			}

			if (new Date(d).getDay()){
				
			} else {return obj;}

			var date = new Date(d);

			var h = date.getHours();
			var m = date.getMinutes()+'';
			var M = date.getMonth();
			var D = date.getDate();
			var Y = date.getFullYear();
			var dotw = date.getDay();

			if (m.length < 2){
				m = '0'+m;
			}
			var ap = 'am';

			if (h >= 12){
				ap = 'pm';
			}

			if (h > 12){
				h -= 12;
			}

			var time = h+':'+m+' '+ap;

			obj.sDay = (M+1)+'/'+D+'/'+Y;
			obj.sDate = obj.sDay+' '+time;
			obj.fString = days[dotw].long+' '+months[M].long+', '+D+', '+Y+' '+time;//+' '+date.getTimezoneOffset();

			return obj;

		};

		$scope.getMainMessages = function(){

			this.options = {
				type: 'messages',
				sub: 'main',
				extend: 'all'
			};

			ApiModel.query(this.options,function(data){

				$scope.main_chats = data.messages;

				if (data.messages.length > 0 && data.messages[0].createdAt != $scope.last_chat_id){
					$timeout(function(){
						var objDiv = document.getElementById('chats');
						objDiv.scrollTop = objDiv.scrollHeight;
					},10);
				};

				if (data.messages.length > 0){
					$scope.last_chat_id = data.messages[0].createdAt;
				}

			},function(data){

				JP({e: data});

			});

		};
		// $scope.getMainMessages();
		// $interval(function(){
		// 	$scope.getMainMessages();
		// },1000);

		$scope.sendMainChat = function(entry){

			$scope.main_chat = null;
			$scope.main_holder = 'Saving...'

			var body = angular.copy(entry);

			this.options = {
				type: 'messages'
			};

			var m = {
				message: {
					location: 'main',
					userId: $scope.current_user.objectId,
					body: body
				}
			};

			var Message = new ApiModel(m);

			Message.$create(this.options,function(data){

				$scope.main_chats.push(data.message);
				$scope.main_chat = null;
				$scope.main_holder = 'Enter message...'
				$timeout(function(){
					var objDiv = document.getElementById('chats');
					objDiv.scrollTop = objDiv.scrollHeight;
				},10);

			},function(){

				$scope.main_chat = body;
				$scope.main_holder = 'Enter message...'

			});

		};

		$scope.channel = {
			messages: [],
			info: []
		};

		$scope.getChannel = function(){

			this.options = {
				type: 'channel'
			};

			ApiModel.query(this.options,function(data){

				var tmp = [];
				angular.forEach(data.messages,function(val,key){

					tmp.push(val);

				});

				$scope.channel.messages = tmp;

				tmp = [];
				angular.forEach(data.info,function(val,key){

					tmp.push(val);

				});

				$scope.channel.info = tmp;

			});

		};
		$scope.getChannel();
		$interval(function(){
			$scope.getChannel();
		},1000);

	}
];