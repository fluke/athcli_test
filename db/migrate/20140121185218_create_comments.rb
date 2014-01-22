class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.integer :scene_id
      t.text :comment
      t.integer :coach_id

      t.timestamps
    end
  end
end
