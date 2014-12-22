## Ember.Console

This is a set of helpers for finding the application's currently active models/routes/controllers/etc. This isn't a straightforward process because of how Ember (rightly) encapsulates application objects, but it's useful in debugging environments to be able to quickly access them.

### Usage

All helpers can be called directly if you provide them an application instance:

```javascript
// the `app` variable is an `Ember.Application` instance
var currentModel = Ember.Console.helpers.model(app);
```

But usually you'll want to inject them into the global namespace for ease of access:

```javascript
// app/app.js
if (config.environment === 'development') {
  App.initializer({
    name: 'injectConsoleHelpers',

    initialize: function(container, app) {
      Ember.Console.injectHelpers(window, app);
    }
  });
}

// later in the console
model().get('id')

// > 'post1'
```

Getting Ember Data records is easy as well:

```javascript
store().getById('user', '74');

// > Class {id: "74"…}
```

### Testing

These same helpers can also be very useful for integration testing. When they are registered as test helpers, they are prefixed with `current`:

```javascript
// somewhere in test bootstrapping
Ember.Console.registerTestHelpers();

// later in a test
visit('/post/post1');
andThen(function() {
  expect(currentModel().get('id')).to.equal('post1');
});
```

Be careful! Just like normal Ember test helpers, all helpers are exposed as globals, so their generic names may conflict with simple local variable names:

```javascript
// because of variable hoisting, the global helper is wiped out before it can be used
var currentModel = currentModel();

// nope!
expect(currentModel).to.be.ok();
```

### Note

The `Ember.Debug` namespace is taken by the [Ember Inspector](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi) chrome extension. The basics of these helpers was originally taken from a testing example I cannot find any longer.
