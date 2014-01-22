class CreateRequests < ActiveRecord::Migration
  def change
    create_table :requests do |t|
      t.string :title
      t.string :movie_url
      t.integer :user_id
      t.integer :coach_id

      t.timestamps
    end
  end
end
