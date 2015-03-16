module Api
  module V1
  	class OnlineController < ApplicationController

  		def index

  			ref = Time.now.to_i
  			r = Time.now.to_f

  			path = "#{Rails.root}/log/online.log"

  			if File.exists? path



  			else

  				content = {}

  				File.open(path, "w+") do |f|
  					f.write(content.to_json)
  				end

  			end

  			json = JSON.parse File.read(path)

  			json = json.merge(session[:user]['objectId'].to_s => {'time' => ref,'user' => session[:user]})

  			users = []

  			new_json = json
  			json.each do |objectId,item|

  				diff = ref - item['time']

  				if diff > 20

  					new_json.delete(objectId)

  				else

            item['user'][:diff] = diff

  					users << item['user'] if item['user']['objectId'] != session[:user]['objectId']

  				end

  			end

  			File.open(path, "w+") do |f|
  				f.write(new_json.to_json)
  			end

  			new_json = new_json.merge time: (((Time.now.to_f-r)*100000).round.to_f/100000).to_f

  			render json: {results: new_json}

  		end

  	end
  end
end