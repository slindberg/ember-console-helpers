(function(global) {
  var Ember = global.Ember;
  var keys = Object.keys || Ember.keys;

  Ember.Console = {
    helpers: {
      // Return a reference to the application itself, useful if not exposed as a global
      app: function(app) {
        return app;
      },

      // Return a reference to the application's DI container
      container: function(app) {
        return app.__container__;
      },

      // Return a reference to the router instance
      router: function(app) {
        return this.container(app).lookup('router:main');
      },

      // Return the current path
      path: function(app) {
        return this.controller(app, 'application').get('currentPath');
      },

      // Return a reference to the current route name
      routeName: function(app) {
        return this.controller(app, 'application').get('currentRouteName');
      },

      // Return a reference to the current route instance, or optionally the named route
      route: function(app, name) {
        name || (name = this.routeName(app));
        return this.container(app).lookup('route:' + name);
      },

      // Return a reference to the current controller instance, or optionally a named controller
      controller: function(app, name) {
        return name ? this.container(app).lookup('controller:' + name) : this.route(app).get('controller');
      },

      // Return a reference to the current model, or optionally the model of the named controller
      model: function(app, name) {
        var controller = name && this.controller(app, name);
        return name ? controller && controller.get('model') : this.route(app).get('currentModel');
      },

      // Return a reference to all models in the current route chain
      // NOTE: this depends on internals that are likely change in the future
      models: function(app) {
        return this.router(app).router.currentHandlerInfos.map(function(info) {
          return info.handler.get('currentModel');
        });
      },

      // Return a reference to the store instance
      store: function(app) {
        // NOTE: `service:store` was added in Ember Data 2.0
        return this.container(app).lookup('service:store')
          || this.container(app).lookup('store:main');
      }
    },

    // Injects the helpers into the given object, bound to the given app
    injectHelpers: function(root, app) {
      keys(this.helpers).forEach(function(key) {
        root[key] = this.helpers[key].bind(this.helpers, app);
      }, this);
    },

    // Register each debug helper as a test helper
    registerTestHelpers: function() {
      keys(this.helpers).forEach(function(key) {
        // Prefix helpers with 'current' to be consistent with existing helpers
        var helperName = 'current' + Ember.String.capitalize(key);

        // Don't overwrite existing helpers
        if (!Ember.Test._helpers[helperName]) {
          Ember.Test.registerHelper(helperName, this.helpers[key].bind(this.helpers));
        }
      }, this);
    }
  };
}(this));