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
    featuresJson: '{"linkGoogle": false, "linkYahoo": false, "formField": false, "formPanel": false}',

    actions: {
        updateFeatures: function(){
            var permissions = JSON.parse(this.get("featuresJson"));
            console.log(111, permissions); // XXX
            App.Features.update(permissions)
        },
    }
})
