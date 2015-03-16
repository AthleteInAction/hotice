module Api
  module V1
  	class SsoController < ApplicationController

  		def zendesk

  			if session[:user]

  				zendesk = {
					email: session[:user]['email'],
					name: session[:user]['gamertag'],
					external_id: session[:user]['objectId'],
					iat: Time.now.to_i,
					jti: rand(2<<64).to_s
				}

				jwt = JWT.encode zendesk,SHARED_SECRET

				redirect_to "https://#{ZENDESK_DOMAIN}.zendesk.com/access/jwt?jwt=#{jwt}&return_to=#{params[:return_to]}"
				final = {
					params: params,
					zd: zendesk,
					jwt: jwt
				}
				# render json: final

  			else

  				redirect_to "/access/normal?return_to=#{ params[:return_to]}&zendesk=true&iat=#{params[:timestamp]}"
  				# render json: params

  			end

		end

		def test

			if !session[:time]

				session[:time] = Time.now.to_i

			end

			final = Time.now.to_i - session[:time]

			session[:time] = Time.now.to_i

			render json: {time: final}

		end

	end
  end
end