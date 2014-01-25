class RequestsController < ApplicationController
  before_action :set_request, only: [:show, :edit, :update, :destroy, :scenes, :add_request_comment]
  before_action :authenticate_user!, only: [:create, :new, :update, :destroy]
  before_action :permission_ok, only: [:show, :update, :edit, :update, :destroy, :scenes, :add_request_comment]
  # GET /requests
  # GET /requests.json
  def index
  end

  # GET /requests/1
  # GET /requests/1.json
  def show
    if current_coach
      @scenes = @request.scenes
    elsif current_user
      redirect_to request_scenes_path
    end
  end


  def request_reload
    authenticate_coach!
    #check if user can access
    if Request.find(params[:request_id]) &&  Request.find(params[:request_id]).coach == current_coach
    @scene = Scene.create(:request_id => params[:request_id], :image_url => params[:imgurl])
    Comment.create(:scene_id => @scene.id, :comment => params[:comment]) unless params[:comment].blank?
    @request = Request.find params[:request_id]
    respond_to do |format|
      format.js { 
        render 'requests/update_scenes' and return
      }
    end
  end
else
  redirect_to root_path, notice: "Bad request." and return
end


def add_request_comment
  if current_coach
    Comment.create(:scene_id => params[:comments][:scene_id], :comment => params[:comments][:comment], :coach_id => current_coach.id)
  elsif current_user
    Comment.create(:scene_id => params[:comments][:scene_id], :comment => params[:comments][:comment], :user_id => current_user.id)
  end

  redirect_to request.referer
end

def scenes
  @scenes = @request.scenes
end

  # GET /requests/new
  def new
    @request = Request.new
  end

  # GET /requests/1/edit
  def edit
  end

  # POST /requests
  # POST /requests.json
  def create
    @request = Request.new(request_params)
    @request.user = current_user
    respond_to do |format|
      if @request.save
        format.html { redirect_to @request, notice: 'Request was successfully created.' }
        format.json { render action: 'show', status: :created, location: @request }
      else
        format.html { render action: 'new' }
        format.json { render json: @request.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /requests/1
  # PATCH/PUT /requests/1.json
  def update
    respond_to do |format|
      if @request.update(request_params)
        format.html { redirect_to @request, notice: 'Request was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @request.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /requests/1
  # DELETE /requests/1.json
  def destroy
    @request.destroy
    respond_to do |format|
      format.html { redirect_to requests_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_request
      @request = Request.find(params[:id])
    end

   def permission_ok
    if current_coach && @request.coach_id == current_coach.id
    elsif current_user && @request.user_id == current_user.id
    else
      redirect_to root_path, notice: "Bad request."
    end
   end


    # Never trust parameters from the scary internet, only allow the white list through.
    def request_params
      params.require(:request).permit(:title, :movie_url, :user_id, :coach_id)
    end
end
