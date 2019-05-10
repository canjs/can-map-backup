var Observation = require('can-observation');
var CanMap = require('can-map');

require('can-map-backup');
require('can-map-define');
require('steal-qunit');

var Recipe;

QUnit.module('can/map/backup', {
	beforeEach: function(assert) {
		Recipe = CanMap.extend('Recipe');
	}
});

QUnit.test('backing up', function(assert) {
	var recipe = new Recipe({
		name: 'cheese'
	});
	assert.ok(!recipe.isDirty(), 'not backedup, but clean');
	recipe.backup();
	assert.ok(!recipe.isDirty(), 'backedup, but clean');
	recipe.attr('name', 'blah');
	assert.ok(recipe.isDirty(), 'dirty');
	recipe.restore();
	assert.ok(!recipe.isDirty(), 'restored, clean');
	assert.equal(recipe.name, 'cheese', 'name back');
});

QUnit.test('backup / restore with associations', function(assert) {
	var Instruction = CanMap.extend('Instruction');
	var Cookbook = CanMap.extend('Cookbook');
	var Recipe = CanMap.extend('Recipe', {
		define: {
			instructions: {
				Type: Instruction.List
			},
			cookbook: {
				Type: Cookbook
			}
		}
	}, {});
	var recipe = new Recipe({
		name: 'cheese burger',
		instructions: [{
			description: 'heat meat'
		}, {
			description: 'add cheese'
		}],
		cookbook: {
			title: 'Justin\'s Grillin Times'
		}
	});
	//test basic is dirty
	assert.ok(!recipe.isDirty(), 'not backedup, but clean');
	recipe.backup();
	assert.ok(!recipe.isDirty(), 'backedup, but clean');
	recipe.attr('name', 'blah');
	assert.ok(recipe.isDirty(), 'dirty');
	recipe.restore();
	assert.ok(!recipe.isDirty(), 'restored, clean');
	assert.equal(recipe.name, 'cheese burger', 'name back');
	// test belongs too
	assert.ok(!recipe.cookbook.isDirty(), 'cookbook not backedup, but clean');
	recipe.cookbook.backup();
	recipe.cookbook.attr('title', 'Brian\'s Burgers');
	assert.ok(!recipe.isDirty(), 'recipe itself is clean');
	assert.ok(recipe.isDirty(true), 'recipe is dirty if checking associations');
	recipe.cookbook.restore();
	assert.ok(!recipe.isDirty(true), 'recipe is now clean with checking associations');
	assert.equal(recipe.cookbook.title, 'Justin\'s Grillin Times', 'cookbook title back');
	//try belongs to recursive restore
	recipe.cookbook.attr('title', 'Brian\'s Burgers');
	recipe.restore();
	assert.ok(recipe.isDirty(true), 'recipe is dirty if checking associations, after a restore');
	recipe.restore(true);
	assert.ok(!recipe.isDirty(true), 'cleaned all of recipe and its associations');
});

QUnit.test('backup restore nested observables', function(assert) {
	var observe = new CanMap({
		nested: {
			test: 'property'
		}
	});
	assert.equal(observe.attr('nested')
		.attr('test'), 'property', 'Nested object got converted');
	observe.backup();

	observe.attr('nested')
		.attr('test', 'changed property');

	assert.equal(observe.attr('nested')
		.attr('test'), 'changed property', 'Nested property changed');

	assert.ok(observe.isDirty(true), 'Observe is dirty');
	observe.restore(true);
	assert.equal(observe.attr('nested')
		.attr('test'), 'property', 'Nested object got restored');
});

QUnit.test('backup removes properties that were added (#607)', function(assert) {
	var map = new CanMap({});
	map.backup();
	map.attr('foo', 'bar');
	assert.ok(map.isDirty(), 'the map with an additional property is dirty');
	map.restore();
	assert.ok(!map.attr('foo'), 'there is no foo property');
});

QUnit.test('isDirty wrapped in a Observation should trigger changes #1417', function(assert) {
	assert.expect(2);
	var recipe = new Recipe({
		name: 'bread'
	});

	recipe.backup();

	var c = new Observation(function() {
		return recipe.isDirty();
	});

	assert.ok(!c.get(), 'isDirty is false');

	c.on( function() {
		assert.ok(c.get(), 'isDirty is true and a change has occurred');
	});

	recipe.attr('name', 'cheese');
});
