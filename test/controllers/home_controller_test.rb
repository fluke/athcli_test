require 'test_helper'

class HomeControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
  end

  test "should get coach_index" do
    get :coach_index
    assert_response :success
  end

  test "should get user_index" do
    get :user_index
    assert_response :success
  end

end
