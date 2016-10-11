@function can-map-backup/can-map.prototype.restore restore
@parent can-map-backup/can-map.prototype

@description Restore saved values of an Observe's properties.

@signature `map.restore( [deep] )`

`restore` sets the properties of an Observe back to what they were the last time
[can-map-backup.prototype.backup backup] was called. If _deep_ is `true`,
`restore` will also restore the properties of nested Observes.

`restore` will not remove properties that were added since the last backup, but it
will re-add properties that have been removed.

@param {bool} [deep=false] whether to restore properties in nested Observes
@return {can-map} The Observe, for chaining.

@body

```js
var CanMap = require('can-map');
require('can-map-backup')

var recipe = new CanMap("Recipe", {
title: 'Pancake Mix',
yields: '3 batches',
ingredients: [{
 ingredient: 'flour',
 quantity: '6 cups'
},{
 ingredient: 'baking soda',
 quantity: '1 1/2 teaspoons'
},{
 ingredient: 'baking powder',
 quantity: '3 teaspoons'
},{
 ingredient: 'salt',
 quantity: '1 tablespoon'
},{
 ingredient: 'sugar',
 quantity: '2 tablespoons'
}]
});

recipe.backup();

recipe.attr('title', 'Flapjack Mix');
recipe.restore();
recipe.attr('title'); // 'Pancake Mix'

recipe.attr('ingredients.0.quantity', '7 cups');
recipe.restore();
recipe.attr('ingredients.0.quantity'); // '7 cups'
recipe.restore(true);
recipe.attr('ingredients.0.quantity'); // '6 cups'
```

## Events
When `restore` sets values or re-adds properties, the same events will be fired (including
_change_, _add_, and _set_) as if the values of the properties had been set using [`attr`](http://canjs.com/docs/can.Map.prototype.attr.html).
