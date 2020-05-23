class AddAsciiNameToCards < ActiveRecord::Migration[6.0]
  def change
    add_column :cards, :ascii_name, :string
  end
end
