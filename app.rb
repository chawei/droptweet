require 'sinatra/base'
require 'json'
require './init'

class App < Sinatra::Base
  get '/' do
    erb :index
  end

  put '/' do
    temp_file = params["tweet_file"][:tempfile]
    temp_file = File.open(temp_file.path)
    data = temp_file.read

    timestamp = Time.now.to_i
    filename  = "#{timestamp}-#{params["tweet_file"][:filename]}"
    File.open('./tmp/' + filename, "w") do |f|
      f.write(data)
    end

    p params["tweet_caption"]
   
    content_type :json
    { :temp_filename => filename }.to_json
  end

  post '/droptweet' do
    filename = params["image_filename"]
    caption  = params["caption"]

    p filename
    p caption
    f = File.open('./tmp/' + filename)
    data = f.read
    p Twitter.update_with_media(caption, data)
  end
end
