class AddTimestampToScene < ActiveRecord::Migration
  def change
    add_column :scenes, :timestamp, :string
  end
end
