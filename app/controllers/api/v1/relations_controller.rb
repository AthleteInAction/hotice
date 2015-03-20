module Api
  module V1
  	class RelationsController < ApplicationController

  		def index

        call = db.APICall method: 'GET',path: '/classes/Relations',where: params[:constraints] || {}.to_json,headers: [{'X-Parse-Session-Token' => session[:user]['sessionToken']}],include: params[:include] || ''

        render json: call

      end

      def create

        call = db.APICall method: 'POST',path: '/classes/Relations',payload: params[:relation],headers: [{'X-Parse-Session-Token' => session[:user]['sessionToken']}]

        render json: call,status: call[:code].to_i

      end

      def update

        call = db.APICall method: 'PUT',path: "/classes/Relations/#{params[:id]}",payload: params[:relation],headers: [{'X-Parse-Session-Token' => session[:user]['sessionToken']}]

        render json: call,status: call[:code].to_i

      end

      def destroy

        call = db.APICall method: 'DELETE',path: "/classes/Relations/#{params[:id]}",headers: [{'X-Parse-Session-Token' => session[:user]['sessionToken']}]

        render json: call,status: call[:code]

      end

  	end
  end
end