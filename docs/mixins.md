# Mixins

## `breakpoint`

Defines rules for a breakpoint. By default, these only apply exactly for the given breakpoint.

``` scss
.example {
  @include responsive.breakpoint("sm") {
    width: responsive.size(100px); // 17.3611111111vw – can be calculated at compile time
  }
}
```

### `$and-up` option

Setting `$and-up` to `true` will make the rules apply for the given breakpoint and all larger ones.

``` scss
.example {
  @include responsive.breakpoint("sm", $and-up: true) {
    width: responsive.size(100px); // calc(var(--responsive-pixel-width) * 100) – cannot be calculated at compile time
  }
}
```

### `$use-layers` option

Whether or not to wrap the rules in a `@layer` directive. Defaults to `true`.

The layer name is `responsive.bp-<breakpoint>`, except if `$and-up` is set to `true`, in which case it is `responsive.from-bp-<breakpoint>`.

Layers for larger breakpoints have higher specificity than layers for smaller breakpoints. Layers starting with `from-bp` have lower specificity than layers starting with `bp`.

Layers can also be disabled globally by setting `$use-layers` to `false` in the `responsive` module:

``` scss
@use "@rkh/responsive" with (
  $use-layers: false
);
```

## `defaults`

When using layers, properties within a layer cannot override properties outside of it.

``` scss
.example {
  color: red;

  // This will not work, the text will always be read
  @include responsive.breakpoint("sm") {
    color: green;
  }
}
```

You can fix this by wrapping the responsive properties in a `defaults` mixin:

``` scss
.example {
  @include responsive.defaults {
    color: red;
  }
  @include responsive.breakpoint("sm") {
    color: green;
  }
}
```

This does have the advantage that definition order does not matter anymore, and also that it can be overridden more easily:

``` scss
.example {
  @include responsive.breakpoint("sm") {
    color: green;
  }
  @include responsive.defaults {
    color: red;
  }
}

.my-other-example {
  color: blue; // no !important needed
}
```

## `property`

A shorthand for using `breakpoint` and `defaults` together for a single property.

``` scss
.example {
  @include responsive.property("color", red, (sm: green));
}
```

Is equivalent to:

``` scss
.example {
  @include responsive.defaults {
    color: red;
  }
  @include responsive.breakpoint("sm") {
    color: green;
  }
}
```
