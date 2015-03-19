module Api
  module V1
  	class MessagesController < ApplicationController

  		def index

  			1.times do

  				path = "#{Rails.root}/messages"

  				path << "/events/#{params[:eventId]}" if params[:eventId]

  				render json: {e: 'Directory does not exist',path: path} if !File.directory?(path)
  				break if !File.directory?(path)

  				messages = []

  				i = 0
  				Dir.glob "#{path}/*.msg" do |line|

  					i += 1

  					name = line.split('/').last.split('_').last.gsub('.msg','')
  					time = (1000000000000-line.split('/').last.split('_').first.to_i)/100

  					message = File.read line

  					final = {
  						userId: name,
  						body: message,
  						body_html: message.gsub(/\n/,'<br>'),
  						createdAt: Time.at(time.to_i)
  					}

  					messages << final

  				# break if i >= 3

  				end

  				render json: {messages: messages},staus: 201

  			end

  		end

  		def create

  			a = (Time.now.to_f*100).round.to_i
  			t = 1000000000000-a

  			path = "#{Rails.root}/messages"

  			path << "/events/#{params[:message][:eventId]}" if params[:message][:eventId]

  			FileUtils::mkdir_p path

  			path << "/#{t}_#{params[:message][:userId]}.msg"

  			body = params[:message][:body].to_s

  			File.open path,'w+' do |f|

  				f.write body

  			end

  			# sleep 2

  			render json: params,status: 201

  		end

	end
  end
end