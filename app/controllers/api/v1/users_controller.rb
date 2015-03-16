module Api
  module V1
  	class UsersController < ApplicationController

  		def index

  			call = db.APICall path: '/users',where: params[:constraints]

  			render json: call,status: call[:code].to_i

  		end

  		def show

  			if params[:id] == 'me'

  				call = db.APICall path: '/users/me',headers: [{'X-Parse-Session-Token' => session[:user]['sessionToken']}]

  				if call[:code] == 200

  					session[:user] = {
  						username: call[:body]['username'],
  						email: call[:body]['email'],
  						email_list: call[:body]['email_list'],
  						gamertag: call[:body]['gamertag'],
  						objectId: call[:body]['objectId'],
  						gamertagVerified: call[:body]['gamertagVerified'],
  						verifyCode: call[:body]['verifyCode'],
  						sessionToken: call[:body]['sessionToken']
  					}

            render json: {user: session[:user]},status: call[:code].to_i

          else

            render json: call,status: call[:code].to_i

  				end

  			else



  			end

  		end

      def update

        call = db.APICall method: 'PUT',path: "/users/#{params[:id]}",payload: params[:user],headers: [{'X-Parse-Session-Token' => session[:user]['sessionToken']}]

        render json: call,status: call[:code].to_i

      end

  	end
  end
end