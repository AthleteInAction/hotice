module Api
  module V1
  	class ChannelController < ApplicationController

      def index

        final = {}

        channels = []

        i = 0
        Dir.glob "#{Rails.root}/channel/#{session[:user]['objectId']}/messages/*.chnl" do |file|

          i += 1

          break if i >= 99

          id = file.split('/').last.gsub('.chnl','')

          channel = JSON.parse(File.read(file))

          channels << channel

        end

        final.merge! messages: channels

        channels = []

        final.merge! info: channels

        render json: final

      end

      def destroy

        path = "#{Rails.root}/channel/#{session[:user]['objectId']}/messages/#{params[:id]}.chnl"

        status = 200

        if File.exists? path

          FileUtils.rm path

        else

          status = 401

        end

        render json: {},status: status

      end

	 end
  end
end