module Request
  
  # Includes
  #-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:
  require 'json'
  require 'net/http'
  require 'net/https'
  require 'uri'
  #-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:
  
  # API Call
  #-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:
  module_function
  def get url

    uri = URI url

    http = Net::HTTP.new(uri.host,80)
    # if uri.scheme == 'https'
    #   http.verify_mode = OpenSSL::SSL::VERIFY_NONE
    #   http.use_ssl = true
    # end

    req = Net::HTTP::Get.new uri.path
    # req.content_type = 'application/xml'

    response = http.request req

    code = response.code.to_f.round
    body = response.body

    final = {
      code: code,
      body: body
    }

  end
    #-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:
  
end