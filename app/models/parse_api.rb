module ParseAPI
  
  # Includes
  #-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:
  require 'json'
  require 'net/http'
  require 'net/https'
  require 'uri'
  #-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:
  
  class Connect
    
    
    # Set Infrastructure
    #-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:
    def initialize params = {}

      @infra = {
        application_id: params[:application_id],
        rest_key: params[:rest_key]
      }
      
      @api = 0

    end
    #-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:
    
    
    # Access
    #-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:
    def APICount
      @api
    end
    #-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:
    
    
    # API Call
    #-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:
    def APICall params = {}
      
      path = params[:path]
      method = params[:method] || 'GET'
      payload = params[:payload] || nil
      extra_headers = params[:headers]
      extra_headers = [] if !params[:headers]
      
      params.delete :method
      params.delete :path
      params.delete :payload
      params.delete :headers
      
      a = Time.now.to_f
      
      http = Net::HTTP.new 'api.parse.com',443
      http.verify_mode = OpenSSL::SSL::VERIFY_NONE
      http.use_ssl = true
      
      uri = %{/1#{path}}
      uri << '?'+params.map{ |key,val| "#{key}=#{val}" }.join('&') if params && params.count > 0
      uri = URI.escape uri
      # puts "\n\n"
      # puts "------"*10
      # puts uri
      # puts "\n\n"

      headers = {'X-Parse-Application-Id' => @infra[:application_id],'X-Parse-REST-API-Key' => @infra[:rest_key]}

      extra_headers.each do |header|

        headers = headers.merge header

      end
      
      reqs = {
        'GET' => Net::HTTP::Get.new(uri,headers),
        'POST' => Net::HTTP::Post.new(uri,headers),
        'PUT' => Net::HTTP::Put.new(uri,headers),
        'DELETE' => Net::HTTP::Delete.new(uri,headers)
      }
      req = reqs[method]
      
      content_type = 'application/json'
      content_type = 'application/binary' if path.include? 'uploads'
      req.content_type = content_type
      
      req.body = payload.to_json if method == 'POST' || method == 'PUT'
      
      response = http.request req
      
      code = response.code.to_f.round
      body = response.body
      
      b = Time.now.to_f
      c = ((b-a)*100).round.to_f/100
      
      final = {code: code}
      final = final.merge(body: JSON.parse(body)) if method != 'DELETE' && code != 500
      final = final.merge(time: c)
      
      @api += 1
      
      final
      
    end
    #-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:

  end
  
end