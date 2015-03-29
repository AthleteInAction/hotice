module Api
  module V1
  	class TestController < ApplicationController

  		def index

  			call = db.APICall path: '/users'

        call[:body]['results'].each do |user|

          Tools.updateUserKey user['objectId'],user['gamertag']

        end

        final = Tools.userKey

        render json: final

      end

  	end
  end
end