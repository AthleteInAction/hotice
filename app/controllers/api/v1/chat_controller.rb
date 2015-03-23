module Api
  module V1
  	class ChatController < ApplicationController

  		def index

        messages = []

  			path = "#{Rails.root}/messages"

        path << "/events/#{params[:eventId]}" if params[:eventId]
        path << "/main" if params[:location] == 'all'

        if !File.directory?(path)

          render json: {messages: messages},status: 200
          return false

        end

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

          break if i >= 50

        end

        render json: {messages: messages},status: 200

  		end

  		def create

        n = Time.now
  			a = (n.to_f*100).round.to_i
  			t = 1000000000000-a

  			path = "#{Rails.root}/messages"

  			path << "/events/#{params[:message][:eventId]}" if params[:message][:eventId]
        path << "/#{params[:message][:location]}" if params[:message][:location]

  			FileUtils::mkdir_p path

  			path << "/#{t}_#{params[:message][:userId]}.msg"

  			body = params[:message][:body].to_s

  			File.open path,'w+' do |f|

  				f.write body

  			end

        message = {
          createdAt: n,
          userId: params[:message][:userId],
          body: body,
          body_html: body.gsub(/\n/,'<br>')
        }

  			# sleep 2

  			render json: {message: message},status: 201

  		end

	end
  end
end