var App = Ember.Application.create({
});


App.Router.map(function() {
    this.route('index', { path: '/'});
    this.route('upgrade', { path: '/upgrade'});
    this.route('page1', { path: '/page1'});
});


App.Features = Em.Features.create({
    map: function() {
        this.feature("linkGoogle", {
            defaultPermission: true
        });
        this.feature("linkYahoo", {
            defaultPermission: true
        });
        this.feature("linkPage1", {
            defaultPermission: true
        });
        this.feature("formField", {
            defaultPermission: true
        });
        this.feature("formPanel", {
            defaultPermission: true
        });
    },

    loadPermissions: function(callAfterLoaded){
        // XXX
    },
});


App.IndexController = Ember.ObjectController.extend({
    featuresJson: '{"linkGoogle": false, "linkYahoo": false, "linkPage1": false, "formField": false, "formPanel": false}',

    actions: {
        updateFeatures: function(){
            var permissions = JSON.parse(this.get("featuresJson"));
            App.Features.update(permissions)
        },
    }
})


App.Page1Route = Ember.Route.extend({
    beforeModel: function(transition) {
        var _this = this;

        App.Features.hasPermission("linkPage1", function(permission){
            if (!permission) {
                alert("This page is not available.");
                _this.transitionTo("index");
            }
        });
    }
});

