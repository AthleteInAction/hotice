Rails.application.configure do

  config.cache_classes = true
  config.eager_load = true
  config.consider_all_requests_local       = false
  config.action_controller.perform_caching = true
  config.serve_static_assets = false
  config.assets.js_compressor = :uglifier
  config.assets.compile = false
  config.assets.digest = true
  config.log_level = :info
  config.i18n.fallbacks = true
  config.active_support.deprecation = :notify
  config.log_formatter = ::Logger::Formatter.new

  # Do not dump schema after migrations.
  # config.active_record.dump_schema_after_migration = false

  TITLE = 'Hot Ice!'

  # Parse.com
  APP_ID = 'q148HRrnyGJZPZDdmshKbwNWBdCqPwMc67quj561'
  REST_KEY = 'rgALrSAgXbdlZygRCJUJyd7NbVbpYlB0m3C8NbgO'

  # Zendesk.com
  ZENDESK_DOMAIN = 'hotice1'
  SHARED_SECRET = 'RWDL1VZwzLEZZIlZiF0wrP3mP4iSBDIsj0MfGm5ZOg8FD7DV'
  ZENDESK_USERNAME = 'wambltemp@gmail.com'
  ZENDESK_TOKEN = 'banzPZn1msUvezSg1kLRalnhaZ0HaiFUWB1O0G8o'
  ANNOUNCEMENTS_ID = 200630628

  # Colors
  ORANGE = 'FFAB4D'
  TEAL = '50DDE8'

  # Paths
  CHANNEL_PATH = "#{Rails.root}/channel"

  # AUTH
  AUTH = {'admin' => 'wcaforlife_live'}

  # Events
  AD_LEFT = '39FVMgc2dQ'
  AD_RIGHT = 'UKGCSKaJUy'

  # ENV
  E = Rails.env
  
end