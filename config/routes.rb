Rails.application.routes.draw do

  root 'splash#index'

  resources :users
  resources :sessions
  resources :teams

  post '/', to: 'splash#create'

  get '/dashboard', to: 'dashboard#index'

  get '/signout', to: 'sessions#destroy'

  # Access
  # ======================================================
  # ======================================================
  get '/access/normal',to: 'access#normal'
  post '/access/normal',to: 'access#create'
  get '/access/password/reset',to: 'access#password_reset'
  post '/access/password/reset',to: 'access#password_reset_do'
  # ======================================================
  # ======================================================

  # API
  # ////////////////////////////////////////////////////////////////
  # ////////////////////////////////////////////////////////////////
  namespace :api do
  	namespace :v1 do
      
      get 'users/key',to: 'users#key'
    	resources :users
    	resources :teams
      get 'myteams',to: 'teams#myteams'
      resources :notifications
      resources :online
      resources :events
      resources :relations
      get 'channel/seen',to: 'channel#seen'
      resources :channel

      # EASHL
      get 'eashl/top-100',to: 'eashl#top_100'
      get 'eashl/season-rank',to: 'eashl#season_rank'
      
      namespace :messages do

        get 'inbox',to: 'messages#inbox'
        post 'inbox',to: 'messages#create'
        delete 'inbox/:id',to: 'messages#destroy'
        get 'sent',to: 'messages#sent'
        get 'thread/:id',to: 'messages#thread'

      end

      get 'chat/events/:eventId',to: 'chat#index'

      # TEST STUFF
      resources :test

      namespace :zendesk do

        get 'users/many',to: 'users#many'
        resources :users

        resources :articles do

          resources :comments

        end

      end

      get 'nhl/scores',to: 'nhl#scores'
      get 'nhl/headlines',to: 'nhl#headlines'

      get 'sso/zendesk' => 'sso#zendesk'
      get 'sso/test' => 'sso#test'

    end
  end
  # ////////////////////////////////////////////////////////////////
  # ////////////////////////////////////////////////////////////////

  # AngularJS Templates
  # ////////////////////////////////////////////////////////////////
  # ////////////////////////////////////////////////////////////////
  get "angularjs/templates/:template" => 'templates#load_template'
  get 'angularjs/components/:template' => 'templates#component_template'
  # ////////////////////////////////////////////////////////////////
  # ////////////////////////////////////////////////////////////////

  # Parse
  # ////////////////////////////////////////////////////////////////
  # ////////////////////////////////////////////////////////////////
  get 'verify' => 'verify#verify_email'
  get 'verify/email/success' => 'verify#email_verified'
  get 'verify/invalid' => 'verify#invalid_link'
  get 'verify/password/changed' => 'verify#password_changed'
  get 'verify/password/reset' => 'verify#choose_password'
  # ////////////////////////////////////////////////////////////////
  # ////////////////////////////////////////////////////////////////

end