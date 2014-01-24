class RequestsController < ApplicationController
  before_action :set_request, only: [:show, :edit, :update, :destroy, :scenes]
  before_action :authenticate_user!, only: [:create, :new, :update, :destroy]
  before_action :permission_ok, only: [:show, :update, :edit, :update, :destroy, :scenes]
  # GET /requests
  # GET /requests.json
  def index
  end

  # GET /requests/1
  # GET /requests/1.json
  def show
  end


  def ajax_save_scene

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
