HotIce.service('MessagesSVC',['ApiModel',function(ApiModel){

	this.messages = {

		sent: [],
		inbox: [],

		// Get messages
		// ------------------------------------------------
		// ------------------------------------------------
		getInbox: function(complete){
			JP('GET INBOX');
			var t = this;

			t.loading = true;

			var options = {
				type: 'messages',
				sub: 'inbox'
			};

			ApiModel.query(options,function(data){

				var tmp = [];

				angular.forEach(data.body.results,function(val,key){

					var m = t.new(val);

					tmp.push(m);

				});

				t.inbox = tmp;

				delete t.loading;

				if (complete){complete(tmp);}

			},function(data){

				delete t.loading;

				if (complete){complete({e: data});}

			});

		},
		getSent: function(complete){

			var t = this;

			t.loading = true;

			var options = {
				type: 'messages',
				sub: 'sent'
			};

			ApiModel.query(options,function(data){

				var tmp = [];

				angular.forEach(data.body.results,function(val,key){

					var m = t.new(val);

					tmp.push(m);

				});

				t.sent = tmp;

				delete t.loading;

				if (complete){complete(tmp);}

			},function(data){

				delete t.loading;

				if (complete){complete({e: data});}

			});

		},
		// ------------------------------------------------
		// ------------------------------------------------


		// New
		// ------------------------------------------------
		// ------------------------------------------------
		new: function(message){

			var t = this;

			if (!message){message = {};}
			if (!message.user){message.user = null;}
			if (!message.recipient){message.recipient = null;}
			if (!message.body){message.body = null;}
			if (!message.body_html){message.body_html = null;}
			if (!message.body_short){message.body_short = null;}
			if (!message.type){message.type = 'message';}

			var m = message;

			m.save = function(complete){

				m.loading = true;

				var options = {
					type: 'messages',
					sub: 'inbox'
				};

				var z = {
					message: {
						user: {
							__type: 'Pointer',
							className: '_User',
							objectId: m.user.objectId
						},
						recipient: {
							__type: 'Pointer',
							className: '_User',
							objectId: m.recipient.objectId
						},
						body: m.body,
						type: 'message',
						thread: m.thread
					},
					user: m.user,
					recipient: m.recipient
				};

				var Message = new ApiModel(z);

				Message.$create(options,function(data){

					m.objectId = data.message.objectId;
					m.createdAt = data.message.createdAt;
					m.updatedAt = data.message.createdAt;
					m.body_html = data.message.body_html;
					m.body_short = data.message.body_short;

					t.sent.unshift(m);

					delete m.loading;

					if (complete){complete(data);}

				},function(data){

					delete m.loading;

					// if (complete){complete({e: data});}

				});

			};

			return m;

		},
		// ------------------------------------------------
		// ------------------------------------------------


		// Reset
		// ------------------------------------------------
		// ------------------------------------------------
		reset: function(){

			return this.new();

		}
		// ------------------------------------------------
		// ------------------------------------------------

	};

}]);