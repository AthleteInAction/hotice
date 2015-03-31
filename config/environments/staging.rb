Rails.application.configure do

  config.cache_classes = false
  config.eager_load = false
  config.consider_all_requests_local       = false
  config.action_controller.perform_caching = false
  config.action_dispatch.show_exceptions = false
  config.action_controller.allow_forgery_protection = false
  config.active_support.deprecation = :stderr
  config.assets.raise_runtime_errors = true
  config.assets.js_compressor = :uglifier

  TITLE = 'Hot Ice! [Staging]'

  # Parse.com
  APP_ID = 'pTgNnmnQSpIeZrFHrzWhdEHBsQpUJPiiFemsbUme'
  REST_KEY = 'X4YzW6g7pAq60pJCTAsQ3lfyOEQuEl1yznPLgixr'

  # Zendesk.com
  ZENDESK_DOMAIN = 'hotice11425586661'
  SHARED_SECRET = 'dXZFeNxFGAMFmCE5kLnynvo2njdDuMpWVFHSNSIhDZFhWVYf'
  ZENDESK_USERNAME = 'wambltemp@gmail.com'
  ZENDESK_TOKEN = 'qqCPvCXkb28JBm59lKGMUjE5baVtcy4JDfJhthLt'
  ANNOUNCEMENTS_ID = 200651088

  # Colors
  ORANGE = 'FFAB4D'
  TEAL = '50DDE8'

  # Paths
  CHANNEL_PATH = "#{Rails.root}/channel"

  # AUTH
  AUTH = {'admin' => 'wcaforlife'}

  # Events
  AD_LEFT = 'QbpXiJZ7c4'
  AD_RIGHT = 'x9XK1Bb02p'

  # ENV
  E = Rails.env

end