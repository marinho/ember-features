/*!

ember-fetures v0.1.0

https://github.com/marinho/ember-features

Copyright (C) 2014 by Marinho Brandao

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

@license
*/
Ember.Features = Ember.Object.extend({
    enabled: {},
    disabled: {},

    initializeFeatures: function() {
        this.features = {};
        this.map();
    }.on("init"),

    feature: function(featureName, arg1) {
        /* arg1 can be an object with parameters "templateName" and "action" or
         *      can be a function with arguments "obj" and "permission"
         */
        var _this = this;

        if (typeof arg1 == "object")
            _this.features[featureName] = arg1

        else if (typeof arg1 == "function")
            _this.features[featureName] = {
                defaultPermission: false,
                action: arg1,
            }

        // Sets property
        _this.set("enabled." + featureName, _this.features[featureName].defaultPermission);
        _this.addObserver("enabled." + featureName, function(){
            _this.set("disabled." + featureName, !(App.Features.get("enabled." + featureName)));
        });
    },

    getFeature: function(featureName){
        if (this.features == undefined)
            this.initializeFeatures();
        return this.features[featureName];
    },    

    hasPermission: function(featureName, callback){
        var main = this;
        var feature = main.getFeature(featureName);

        if (feature === undefined) {
            callback(false);
        }

        // Loads from cache first
        else if (main.enabled[featureName] !== undefined) {
            callback(main.enabled[featureName]);
        }

        // Loads permission from remote
        else {
            main.loadPermissions(function(permissions){
                // Save permissions in cache
                main.update(permissions);

                // Call callback function after all
                callback(permissions[featureName]);
            });
        }
    },

    loadPermissions: function(callAfterLoaded){
        this.defaultLoadPermissions(callAfterLoaded);
    },

    defaultLoadPermissions: function(callAfterLoaded){
        var permissions = {};
        $.each(this.features, function(key, value){
            permissions[key] = value.defaultPermission;
        });
        callAfterLoaded(permissions);
    },

    update: function(permissions){
        var main = this;
        $.each(permissions, function(key, value){
            main.set("enabled." + key, value);
            main.set("disabled." + key, !value);
        });
    },
});

Ember.Feature = Ember.View.extend({
    feature: null,

    init: function(){
        Ember.defineProperty(this, "hasPermission", Ember.computed(function(){
            return App.Features.get("enabled." + this.feature);
        }).property("App.Features.enabled." + this.feature));

        this._super();
    },
});
