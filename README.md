## Ember.Console

This is a set of helpers for finding the application's currently active models/routes/controllers/etc. This isn't a straightforward process because of how Ember (rightly) encapsulates application objects, but it's useful in debugging environments to be able to quickly access them.

### Usage

All helpers can be called directly if you provide them an application instance:

```javascript
// the `App` variable is an `Ember.Application` instance
var currentModel = Ember.Console.helpers.model(App);
```

But usually you'll want to inject them into the global namespace for ease of access:

```javascript
// somewhere in app bootstrapping
if (Ember.ENV.DEBUG) {
  Ember.Console.injectHelpers(window, App);
}

// later in the console...
var currentModel = model();
```

Getting Ember Data records is easy as well:

```javascript
var user = store().getById('user', '74');
```

### Testing

These same helpers can also be very useful for integration testing. They can be exposed as normal test helpers:

```javascript
// somewhere in test bootstrapping
Ember.Console.registerTestHelpers();

// later in a test...
visit('/').then(function() {
  expect(routeName()).to.equal('index');
});
```

Be careful! All test helpers are exposed as globals, so their generic names may conflict with simple local variable names:

```javascript
// because of variable hoisting, the global helper is wiped out before it can be used
var model = model();

// nope!
expect(model).to.be.ok();
```

### Note

The `Ember.Debug` namespace is taken by the [Ember Inspector](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi) chrome extension. The basics of these helpers was originally taken from a testing example I cannot find any longer.
