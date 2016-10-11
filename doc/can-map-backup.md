@module {can-map} can-map-backup
@parent can-legacy
@group can-map-backup/can-map.prototype 0 can-map.prototype
@test src/test/test.html
@package ../package.json

@signature `require('can-map-backup')`

Adds a [can-map-backup/can-map.prototype.backup],
[can-map-backup/can-map.prototype.isDirty] and
[can-map-backup/can-map.prototype.restore] method to [can-map].

@return {can-map} Exports [can-map].

@body

`can-map-backup` is a plugin that provides a dirty bit for properties on an Map,
and lets you restore the original values of an Map's properties after they are changed.

## Overview

Here is an example showing how to use [can-map-backup/can-map.prototype.backup] to save values,
`[can-map-backup/can-map.prototype.restore restore]` to restore them, and `[can-map-backup/can-map.prototype.isDirty isDirty]`

to check if the Map has changed:

```js
var CanMap = require("can-map");
require('can-map-backup');

var recipe = new CanMap({
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
recipe.title;     // 'Flapjack Mix'
recipe.isDirty(); // true

recipe.restore();
recipe.title;     // 'Pancake Mix'
```
