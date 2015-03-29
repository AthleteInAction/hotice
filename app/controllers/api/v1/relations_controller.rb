module Api
  module V1
  	class RelationsController < ApplicationController

  		def index

        call = db.APICall method: 'GET',path: '/classes/Relations',where: params[:constraints] || {}.to_json,headers: [{'X-Parse-Session-Token' => session[:user]['sessionToken']}],include: params[:include] || ''

        render json: call

      end

      def create

        call = db.APICall method: 'POST',path: '/classes/Relations',payload: params[:relation],headers: [{'X-Parse-Session-Token' => session[:user]['sessionToken']}]

        if call[:code].to_i == 201 && params[:relation][:type] == 'team'

          id = call[:body]['objectId']

          n = {
            id: id,
            team: params[:team],
            type: 'team_invite',
            createdAt: call[:body]['createdAt'],
            seen: false
          }

          Tools.createNotification params[:user][:objectId],id,n

        end

        render json: call,status: call[:code].to_i

      end

      def update

        call = db.APICall method: 'PUT',path: "/classes/Relations/#{params[:id]}",payload: params[:relation],headers: [{'X-Parse-Session-Token' => session[:user]['sessionToken']}]

        if call[:code] == 200 && params[:notification] == 'delete'

          path = "#{CHANNEL_PATH}/#{session[:user]['objectId']}/info/#{params[:id]}.chnl"

          Dir.glob path do |file|

            FileUtils.rm file

          end

        end

        render json: call,status: call[:code].to_i

      end

      def destroy

        call = db.APICall method: 'DELETE',path: "/classes/Relations/#{params[:id]}",headers: [{'X-Parse-Session-Token' => session[:user]['sessionToken']}]

        if call[:code] == 200

          Dir.glob "#{CHANNEL_PATH}/#{params[:inviteeId]}/info/#{params}.chnl" do |file|

            Tools.delete file

          end

        end

        render json: call,status: call[:code]

      end

  	end
  end
end