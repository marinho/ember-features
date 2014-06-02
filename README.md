## Overview

**ember-features** is an EmberJS plugin that implements Feature Toggle design pattern.
That is possible by using some of available EmberJS functions as View layouts and
properties.

It can be updated by simple function calls, by loading from a external JSON request or
even by WebSockets or EventSource pushes. That is completely up to the developer, as
long as it is called one of the functions to update permissions for declared features.

## Feature Toggle pattern

For those who aren't introduced to Feature Toggle pattern, We'd suggest a read in the
nice **Martin Fowler**'s article on it:

http://martinfowler.com/bliki/FeatureToggle.html

In simple words, it is an approach the enable or disable features as in a permission
level way, that basically allows the developer to deliver a service that is actually
not ready but can be enabled for certain clients or user types. It can also be used
to update production service before an stratategical release moment.

## How to use

**ember-features** requires only an EmberJS based application with an running
Application.

1. So at first you have to download **ember-features.js** and place in your "vendor"
folder (or just together EmberJS scripts):

    https://raw.githubusercontent.com/marinho/ember-features/master/src/ember-features.js

2. At any line after EmberJS script, you must include a script tag for ember-features
as below:

```
<script type="text/javascript" src="/js/vendor/ember-features.js"></script>
```

3. In another script after Application initialization, you must declare your features
object, like below:

```
App.Features = Em.Features.create({
    map: function() {
        this.feature("specialPanel", {
            defaultPermission: true
        });
        this.feature("specialField", {
            defaultPermission: true
        });
        this.feature("someField", {
            defaultPermission: true
        });
        this.feature("linkTDispatch", {
            defaultPermission: true
        });
        this.feature("linkPage1", {
            defaultPermission: true
        });
    }
});
```

Each call for **this.feature(featureName, options)** will declare a feature by name
and set its options.

4. Once you have the features you need declared, you can use them in several different
ways, for example:

In template, to decorate a tag and show it only if there is permission for

```
<script type="text/x-handlebars" id="index" layoutName="show_only_permitted">
    {{#view Ember.Feature feature="specialPanel"}}
    <div id="featureVisibleOnlyWhenPermitted">
        Here goes something in template that will show only if feature is
        currently enabled.
    </div>
    {{/view}}
</script>
		
<script type="text/x-handlebars" data-template-name="show_only_permitted">
    {{#if view.hasPermission }}
        <i>{{yield}}</i>
    {{/if}}
</script>
```

in the other way around, showing a template only if the feature isn't enabled:

```
<script type="text/x-handlebars" id="index">
    <div id="featureShowingMessageIfWithoutPermission">
        {{view Ember.Feature feature="specialField" layoutName="upgrade_message"}}
    </div>
</script>

<script type="text/x-handlebars" data-template-name="upgrade_message">
    {{#if not view.hasPermission }}
        <div class="disabledFeature">
            Unavailable for free accounts.
            {{#link-to "upgrade"}}Click here to upgrade.{{/link-to}}
        </div>
    {{/if}}
</script>
```

or still in template, but replacing the decorated content for another template in
case of no permission

```
<script type="text/x-handlebars" id="index">
    <div id="someField">
        {{#view Ember.Feature feature="someField" layoutName="upgrade_message"}}
            <label>Form Field:</label>
            {{input type="text" disabledBinding="App.Features.disabled.formField"}}
        {{/view}}
    </div>
</script>

<script type="text/x-handlebars" data-template-name="upgrade_message">
    {{#if view.hasPermission }}
        {{yield}}
    {{else}}
        <div class="disabledFeature">
            Unavailable for free accounts.
            {{#link-to "upgrade"}}Click here to upgrade.{{/link-to}}
        </div>
    {{/if}}
</script>
```

in template also, but from **bind-attr** tag

```
<!-- When enabled -->
<button {{bind-attr class="App.Features.disabled.linkTDispatch:enabled"}}
        {{action visitTDispatch}}>T Dispatch</button>

<!-- When disabled -->
<input type="text" {{bind-attr disabled="App.Features.disabled.linkTDispatch"}}/>
```

and finally from controllers, views or any other JavaScript block

```
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
```

## Clarifying a bit

### App.Features.hasPermission(featureName, callback)

When the function **App.Features.hasPermission(featureName, callback)** is called,
it loads permissions using method **App.Features.loadPermissions()** which can do
any other request in order to return a dictionary with permissions, including
**Ajax calls**.

The callback function will be called with a single argument, which is usually
boolean, but could be an integer or other basic data type.

Example:

```
App.Features.hasPermission("FeatureName", function(permission){
    if (permission == true) {
        // Does whatever
    }
    else if (permission == false) {
        // Does whatever
    }
});
```

### App.Features.loadPermissions()

Here is a simple example of **App.Features.loadPermissions()** implementation:
 
```
App.Features = Em.Features.create({
    map: function() {
        this.feature("linkGoogle", {
            defaultPermission: true
        });
        this.feature("linkYahoo", {
            defaultPermission: true
        });
    },

    loadPermissions: function(callAfterLoaded){
        callAfterLoaded({
            linkGoogle: true,
            linkYahoo: true,
            });
    },
});
```

And now another example, using an Ajax request:
 
```
App.Features = Em.Features.create({
    map: function() {
        this.feature("linkGoogle", {
            defaultPermission: true
        });
        this.feature("linkYahoo", {
            defaultPermission: true
        });
    },

    loadPermissions: function(callAfterLoaded){
        $.get("/api/load-permissions", function(resp){
            callAfterLoaded(resp.permissions);
        });
    },
});
```

### App.Features.update(permissions)

For updating current permissions manually without calling **loadPermissions**,
you have to call **App.Features.update(permissions)** with the first argument
receiving an object with keys as the feature names and their respective values
(usually boolean values), as below:

```
App.Features.update({
    linkGoogle: true,
    linkYahoo: false,
    })
```

The **best practice** is to load permissions once by the session beginning and
more times during the sessino via **WebSockets** or **EventSource** events.

Or it can be loaded by using Ajax call, like below:

```
$.get("/api/get-permissions", function(resp){
    App.Features.update(resp.permissions)
});
```

## Author and License

**ember-features** is copyright by Marinho Brandao, 2014.

**ember-features** is released under GPL v3 license, open source and free to use,
distribute, modify and copy, as long as you keep author rights for the author.
