class CreateScenes < ActiveRecord::Migration
  def change
    create_table :scenes do |t|
      t.integer :request_id
      t.string :image_url
      t.integer :user_id

      t.timestamps
    end
  end
end
