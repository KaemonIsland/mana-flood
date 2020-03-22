class ApplicationController < ActionController::Base
  include DeviseWhitelist
  include CollectionUtils
end
