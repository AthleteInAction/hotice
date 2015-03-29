module Api
  module V1
  	class ChannelController < ApplicationController

      def index

        final = {}

        channels = []

        i = 0
        Dir.glob "#{CHANNEL_PATH}/#{session[:user]['objectId']}/messages/*.chnl" do |file|

          i += 1

          break if i >= 99

          id = file.split('/').last.gsub('.chnl','')

          channel = JSON.parse(File.read(file))

          channels << channel

        end

        final.merge! messages: channels

        channels = []
        
        i = 0
        Dir.glob "#{CHANNEL_PATH}/#{session[:user]['objectId']}/info/*.chnl" do |file|

          i += 1

          break if i >= 99

          id = file.split('/').last.gsub('.chnl','')

          channel = JSON.parse(File.read(file))

          channels << channel

        end

        final.merge! info: channels

        render json: final

      end

      def destroy

        if params[:info] == 'true'

          path = "#{CHANNEL_PATH}/#{session[:user]['objectId']}/info/#{params[:id]}.chnl"

          call = db.APICall path: "/classes/Relations/#{params[:id]}", method: 'DELETE'

          if call[:code].to_i != 200 && call[:code].to_i != 404

            call.merge! params: params

            render json: {code: call[:code]},status: call[:code].to_i

            return false

          end

        else

          path = "#{CHANNEL_PATH}/#{session[:user]['objectId']}/messages/#{params[:id]}.chnl"

        end

        status = 200

        final = {}

        if File.exists? path

          FileUtils.rm path

        else

          status = 400

        end

        render json: {call: call,path: path},status: status

      end

      def seen

        path = "#{CHANNEL_PATH}/#{session[:user]['objectId']}/info/*.chnl"

        chnls = []

        Dir.glob path do |file|

          n = JSON.parse(File.read(file))

          n['seen'] = true

          File.open file,'w+' do |f|

            f.write n.to_json

          end

          chnls << n

        end

        render json: {notifications: chnls},status: 200

      end

	 end
  end
end