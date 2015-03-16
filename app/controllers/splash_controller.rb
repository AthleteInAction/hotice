class SplashController < ApplicationController

	def index

		@errors = {}

		if session[:user]
			redirect_to '/dashboard/'
		else
			render 'index',layout: 'splash'
		end

	end

	def create

		if false

		else

			if params[:password] && params[:password].to_s.length >= 4

				vcode = rand(100000..999999)

				call = db.APICall path: '/users',method: 'POST',payload: {gamertag: params[:gamertag],username: params[:email],email: params[:email],password: params[:password],email_list: params[:email_list],verifyCode: vcode}

			else 

				call = {
					code: 404,
					body: {
						'error' => 'Invalid password'
					}
				}

			end

			if call[:code] == 201
				
				session[:user] = {
					username: params['email'],
					email: params['email'],
					email_list: params['email_list'],
					gamertag: params['gamertag'],
					objectId: call[:body]['objectId'],
					gamertagVerified: false,
					verifyCode: vcode,
					sessionToken: call[:body]['sessionToken']
				}

				if params[:zendesk] == 'true'

					redirect_to "/api/v1/sso/zendesk?return_to=#{ params[:return_to]}"

				else

					redirect_to '/dashboard/'

				end
	
			else
	
				@errors = {
					create: call[:body]
				}
	
				render 'index',layout: 'splash'
	
			end

		end

	end

end