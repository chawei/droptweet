require 'sinatra/base'
require 'json'
require './init'

class App < Sinatra::Base
  set :root, File.dirname(__FILE__)

  get '/' do
    erb :index
  end

  put '/' do
    temp_file = params["tweet_file"][:tempfile]
   
    content_type :json
    { :temp_filename => temp_file.path }.to_json
  end

  post '/droptweet' do
    filename = params["image_filename"]
    caption  = params["caption"]

    p "path: #{filename}"
    p "caption: #{caption}"
    f = File.open(filename)

    content_type :json
    begin
      res = Twitter.update_with_media(caption, f)
      { :status => 'ok', :res => res }.to_json
      #{ :status => 'ok', :res => "Test" }.to_json
    #rescue => e
    #  { :status => 'fail', :res => e }.to_json
    end
  end
end
