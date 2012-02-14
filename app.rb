require 'sinatra/base'
require 'json'
require './init'

class App < Sinatra::Base
  get '/' do
    erb :index
  end

  put '/' do
    data = request.body.read
   
    p params['data'] 
    puts "uploaded #{env['HTTP_X_FILENAME']} - #{data.size} bytes"
    
    File.open('uploads/' + env['HTTP_X_FILENAME'], "w") do |f|
      f.write(data)
    end

    #p Twitter.update_with_media('Tweet', File.open('uploads/' + env['HTTP_X_FILENAME']))
  end
end
