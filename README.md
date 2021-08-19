# Mana Flood

A passion project with a goal of tracking my MTG collection

## What does it do?

This app allows you to add cards from specific sets, or by search directly to your collection.

You can also build decks along with viewing stats.

Note: Deckbuilding still has a lot of work to be done...

# Installation

This package requires Node v12, Ruby v2.6.3 and Rails v6 to run.

After forking the project: 

* Run `bundle` to install all the ruby packages.
* Then use `yarn install` or `npm install` to get all the JS packages
* You'll then need to run `rails db:setup` to build the db with migrations
* Run `rake cards:update` to add all current cards to the database, this'll take awhile since there are a TON of cards!
* Afterwards you should be able to run the app with `rails s`
* If this all works you just need to create an account and your good to go!

## Warning

Unfortunately this site isn't online for everyone, I don't have the funds to keep put it online,
plus there is still a lot of work to do to get it out to the public.

So for now just feel free to download it and give me any feedback!

In order to use this app you must install it locally. You can export/import a JSON file of UUIDs and quantity of cards,
this way you can add your collection once the site is live. Also it allows you to sleep nicely knowing that all the cards
you added to the site won't magically dissapear when I break something.

### Please Keep In Mind

This website is a passion project of mine. I wanted a solid/easy way to manage my growing collection of cards from the greatest game on earth. Manually going through individual set boxes would be a ton of fun, but waste a ton of time when I had to put all the unused cards back. I wanted a way to store my collection online, get data on cards I owned and ones that I wanted to own. I wanted to be able to build decks, and once satisfied, go to my collection and grab the exact cards that I wanted.

This website is still far away from that dream. Currently it's only able to keep track of a single collection and that's about it.

BUT

My plans are ambitious.

* I want to be able to view card stats, ratings, pricing, usage, etc.
* I want to be able to have track a wishlist of cards, or build decks with cards I don't yet have.
* I want to be able to view the top decks from recent championships.
* I want this app to be a combination of `tappedout`, `mtgdecks`, `edhrec`, and `archidect` all in one.

It's going to take awhile.... and possibly never get done!

Any help is welcome, I'm still relatively new to structuring a project solo which is why it's taken so long to build.
Just keep in mind that this is a passion project that I spend my freetime on.

Thank you!
