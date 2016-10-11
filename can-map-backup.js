//allows you to backup and restore a map instance
var compute = require('can-compute');
var CanMap = require('can-map');
var compare = require('can-set/src/compare');
var assign = require("can-util/js/assign/assign");

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
		this._backupStore = compute();
		return oldSetup.apply(this, arguments);
	},

	backup: function () {
		this._backupStore(this.attr());
		return this;
	},
	isDirty: function (checkAssociations) {
		var backupStore = this._backupStore();
		if(!backupStore){
			return false;
		}
		var currentValue = this.attr();
		var aParent, bParent, parentProp;
		var compares = {};
		var options = { deep: !! checkAssociations };

		return !compare.equal(currentValue, backupStore, aParent, bParent, parentProp, compares, options);
	},
	restore: function (restoreAssociations) {
		var props = restoreAssociations ? this._backupStore() : flatProps(this._backupStore(), this);
		if (this.isDirty(restoreAssociations)) {
			this.attr(props, true);
		}
		return this;
	}
});
module.exports = exports = CanMap;
