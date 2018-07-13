//allows you to backup and restore a map instance
var SimpleObservable = require("can-simple-observable");
var CanMap = require('can-map');
var diffDeep = require("can-diff/deep/deep");
var diffMap = require("can-diff/map/map");
var assign = require("can-assign");

var flatProps = function (a, cur) {
	var obj = {};
	for (var prop in a) {
		if (typeof a[prop] !== 'object' || a[prop] === null || a[prop] instanceof Date) {
			obj[prop] = a[prop];
		} else {
			obj[prop] = cur.attr(prop);
		}
	}
	return obj;
};

var oldSetup = CanMap.prototype.setup;

assign(CanMap.prototype, {
	setup: function() {
		this._backupStore = new SimpleObservable();
		return oldSetup.apply(this, arguments);
	},

	backup: function () {
		this._backupStore.set(this.attr());
		return this;
	},
	isDirty: function (checkAssociations) {
		var backupStore = this._backupStore.get();
		if(!backupStore){
			return false;
		}
		var currentValue = this.attr();
		var patches;
		if(!! checkAssociations) {
			patches = diffDeep(currentValue, backupStore);
		} else {
			patches = diffMap(currentValue, backupStore).filter(function(patch){
				// only keep those that are not a set of deep object
				if(patch.type !== "set") {
					return true;
				} else {
					// check values .. if both objects ... we are not dirty ...
					var curVal = currentValue[patch.key],
						backupVal = backupStore[patch.key];
					var twoObjectsCompared = curVal && backupVal && typeof curVal === "object" && typeof backupVal === "object";
					return !twoObjectsCompared;
				}
			});
		}
		return patches.length;
	},
	restore: function (restoreAssociations) {
		var props = restoreAssociations ? this._backupStore.get() : flatProps(this._backupStore.get(), this);
		if (this.isDirty(restoreAssociations)) {
			this.attr(props, true);
		}
		return this;
	}
});
module.exports = exports = CanMap;
