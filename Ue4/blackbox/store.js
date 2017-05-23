/** module for providing a simple interface to a kind of database (only in memory)
 *  @description
 *  primary methods exposed as public:
 *  - select (String type, Number id) [@returns undefined, one element or array of elements]
 *  - insert (String type, Object element) [@returns ID of new element]
 *  - replace (String type, Number id, Object element) [@returns this (the store object)]
 *  - remove (String type, Number id) [@returns this (the store object)]
 *
 *  All methods make deep copies of the data objects (and remove functions)
 *  All methods throw Errors if something went wrong.
 *  Elements stored in store are expected to have an .id property with a numeric value > 0 (except on insert(..))
 * @author Johannes Konert
 * @licence  CC BY-SA 4.0
 *
 * @throws Error in methods if something went wrong
 * @module blackbox/store
 * @type {Object}
 */
"use strict";

// a closure for ID generation
var globalCounter = (function() {
    var i = 100;
    return function() {
        return ++i;
    }

})();


// our "in memory database" is a simple object!
var memory = {};


//** private helper functions */
/**
 *  Checks given element for being an object
 * @param element
 * @throws Error if not an object
 */
var checkElement = function(element) {
    if (typeof(element) !== 'object') {
        throw new Error('Element is not an object to store', element);
    }
};

/**
 * Returns a deep clone of object attributes (no functions)
 * Uses JSON.stringify for this.
 * @param object to copy
 * @returns {object}
 */
var getDeepObjectCopy = function(object) {
    if (!object) return undefined;
    return JSON.parse(JSON.stringify(object)); // quick&dirty solution to deep copy a data object (without functions!)
};

var store = {


    /** Selects all of one specific element from a given type list
     *
     * @param [string} type - the String identifier of the DB table
     * @param {string or number} id - (optional) ID of element to select only one
     * @returns {[],{}, undefined} - undefined if nothing found, array of objects or one object only if ID was given
     */
    select: function(type, id) {
        var list = memory[type];
        id = parseInt(id);
        list =  (list == undefined || list.length === 0)? undefined: list; // prevent []
        if (list != undefined && list.length > 0 && !isNaN(id)) {
            list = list.filter(function(element) {
                return element.id === id;
            });
            list =  (list.length === 0)? undefined: list[0]; // only return the 1 found element; prevent empty []
        }
        return getDeepObjectCopy(list); // may contain undefined, object or array;
    },


    /** Inserts an element into the list of type and adds an .id to it
     *
     * @param {string} type
     * @param {object} element (without an .id property)
     * @returns {Number} the new id of the inserted element as a Number
     */
    insert: function(type, element) {
        checkElement(element);
        if (element.id !== undefined) {
            throw new Error("element already has an .id value, but should not on insert!",e);
        }
        element.id = globalCounter();
        memory[type] = memory[type] || [];
        memory[type].push(getDeepObjectCopy(element));
        return element.id;
    },


    /** Replaces an existing element. id and newElement.id must be identical
     *
     * @param {string} type
     * @param {string} id
     * @param {object} newElement  needs to have .id property of same value as id
     * @throws Error in case element cannot be found or id and .id are not the same
     * @returns {this} the store object itself for pipelining
     */
    replace: function(type, id, newElement) {
        var index = null;
        checkElement(newElement);
        var found = store.select(type, id);
        if (found === undefined) {
            throw new Error('element with id '+id+' does not exist in store type '+type, newElement);
        }
        id = parseInt(id);
        // now get the index of the element
        memory[type].forEach(function(item, i) {
            if (item.id === id) {
                index = i;
            }
        });
        // case of index = null cannot happen as it was found before..
        if (!newElement.id == id) {
            throw new Error("element.id and given id are not identical! Cannot replace");
        }
        newElement.id = id; // for type safety
        memory[type][index] = getDeepObjectCopy(newElement);
        return this;
    },


    /** Removes an element of given id from the store
     *
     * @param {string} type
     * @param {Number} id numerical id of element to remove
     * @throws Error if element cannot be found in store
     * @returns {this} store object itself for pipelining
     */
    remove: function(type, id) {
        var index = null;
        var found = store.select(type, id);
        if (found === undefined) {
            throw new Error('element with id '+id+' does not exist in store type '+type);
        }
        id = parseInt(id);
        // now get the index of the element
        memory[type].forEach(function(item, i) {
            if (item.id === id) {
                index = i;
            }
        });
        memory[type].splice(index, 1);
        return this;
    }
};
module.exports = store; // let require use the store object