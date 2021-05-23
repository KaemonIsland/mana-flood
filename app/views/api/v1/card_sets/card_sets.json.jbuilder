json.array! @card_sets.map do |card_set|
  json.(card_set, *card_set.attributes.keys)

  json.unique @collection.sets_unique(card_set.code)
end