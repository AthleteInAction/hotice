class ApplicationController < ActionController::Base

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  private

  before_filter :authenticate# if Rails.env == 'staging' || Rails.env == 'production'

  def authenticate
    authenticate_or_request_with_http_digest 'Application' do |name|
      
      session[:auth] = AUTH[name] if !session[:auth]

      session[:auth]

    end
  end

  def db
    result = ParseAPI::Connect.new application_id: APP_ID,rest_key: REST_KEY
  end
  helper_method :db

  def zd
    zendesk = ZendeskAPI::Connect.new domain: ZENDESK_DOMAIN,username: ZENDESK_USERNAME,token: ZENDESK_TOKEN
  end
  helper_method :zd

  def current_user
    session[:user]
  end
  helper_method :current_user

  def authorize
    redirect_to root_url, alert: "Not authorized" if session[:user].nil?
  end

end