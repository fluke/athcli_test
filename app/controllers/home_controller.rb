class HomeController < ApplicationController
  def index
  end

  def coach_index
  	authenticate_coach!
  	@requests = current_coach.requests
  end

  def user_index
  	authenticate_user!
  	@requests = current_user.requests
  end
end
