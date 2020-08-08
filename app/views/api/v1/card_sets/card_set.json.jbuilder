json.set do
  json.(@set, *@set.attributes.keys)
  json.unique @set.cards.length
end

json.stats @set.card_stats