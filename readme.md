# can-map-backup

[![Build Status](https://travis-ci.org/canjs/can-map-backup.png?branch=master)](https://travis-ci.org/canjs/can-map-backup)

can.Map.backup is a plugin that provides a dirty bit for properties on an Map,
and lets you restore the original values of an Map's properties after they are changed.

## Overview

Here is an example showing how to use `[can.Map.backup.prototype.backup backup]` to save values,
`[can.Map.backup.prototype.restore restore]` to restore them, and `[can.Map.backup.prototype.isDirty isDirty]`

to check if the Map has changed:

```
var recipe = new can.Map({
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

## Usage

### ES6 use

With StealJS, you can import this module directly in a template that is autorendered:

```js
import plugin from 'can-map-backup';
```

### CommonJS use

Use `require` to load `can-map-backup` and everything else
needed to create a template that uses `can-map-backup`:

```js
var plugin = require("can-map-backup");
```

### AMD use

Configure the `can` and `jquery` paths and the `can-map-backup` package:

```html
<script src="require.js"></script>
<script>
	require.config({
	    paths: {
	        "jquery": "node_modules/jquery/dist/jquery",
	        "can": "node_modules/canjs/dist/amd/can"
	    },
	    packages: [{
		    	name: 'can-map-backup',
		    	location: 'node_modules/can-map-backup/dist/amd',
		    	main: 'lib/can-map-backup'
	    }]
	});
	require(["main-amd"], function(){});
</script>
```

### Standalone use

Load the `global` version of the plugin:

```html
<script src='./node_modules/can-map-backup/dist/global/can-map-backup.js'></script>
```

## Contributing

### Making a Build

To make a build of the distributables into `dist/` in the cloned repository run

```
npm install
node build
```

### Running the tests

Tests can run in the browser by opening a webserver and visiting the `test.html` page.
Automated tests that run the tests from the command line in Firefox can be run with

```
npm test
```
