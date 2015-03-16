class AccessController < ApplicationController

	# GET /access/normal
	# ======================================================
	# ======================================================
	def normal

		render 'login',layout: 'splash'

	end
	# ======================================================
	# ======================================================

	# POST /access/normal
	# ======================================================
	# ======================================================
	def create

		call = db.APICall path: '/login',method: 'GET',username: params[:email],password: params[:password]

		if call[:code] == 200

			session[:user] = {
				username: call[:body]['username'],
				email: call[:body]['email'],
				email_list: params['email_list'],
				gamertag: call[:body]['gamertag'],
				objectId: call[:body]['objectId'],
				gamertagVerified: call[:body]['gamertagVerified'],
				verifyCode: call[:body]['verifyCode'],
				sessionToken: call[:body]['sessionToken']
			}

			if params[:zendesk] == 'true'

				redirect_to "/api/v1/sso/zendesk?return_to=#{ params[:return_to]}"

			else

				redirect_to '/dashboard/'

			end

		else

			@error = 'Invalid login crudentials'

			# render 'login',layout: 'splash',zendesk: 234342

			path = '/access/normal'

			uri = "?error=#{@error}"

			if params[:zendesk] == 'true'

				uri << '&zendesk=true'
				uri << "&return_to=#{params[:return_to]}"

			end

			uri = URI.encode(uri)

			path << uri

			redirect_to path

		end

	end
	# ======================================================
	# ======================================================

	# GET /access/signout
	# ======================================================
	# ======================================================
	def destroy

		session[:user] = nil

		redirect_to root_url

	end
	# ======================================================
	# ======================================================


	def password_reset

		render layout: 'splash'

	end

	def password_reset_do

		call = db.APICall method: 'POST',path: '/requestPasswordReset',payload: {email: params[:email]}

		if call[:code].to_i == 200

			@error = nil
			@alert = "An email was sent to #{params[:email]} with a link to reset your password."

		else

			@error = 'An error occured'
			@alert = nil

		end

		render 'password_reset',layout: 'splash'

	end

end