# Variables and configuration

You can configure custom breakpoints by setting the following variables before importing the module:

``` scss
@use "responsive" with (
  $breakpoints: ("small": 375px, "medium": 800px, "large": 1200px),
  $base-font-size: 14px
);
```

The following configuration variables exist:

Variable           | Default       | Description
-------------------|---------------|------------
`$base-font-size`  | `16px`        | The base font size to be assumed for the design.
`$min-font-size`   | `14px`        | The smallest size `1rem` can drop down to.
`$breakpoints`     | see below     | The breakpoints to be used. Mapping names to pixel values.
`$use-layers`      | `true`        | Whether to use CSS layers to wrap all generated CSS in.
`$layer-namespace` | `responsive`  | A namespace layer to wrap all generated layers in. Set to `null` to disable.

The default value for `$breakpoints` is:

``` scss
$breakpoints: (
  xs: 350px, // 21.875em at 16px
  sm: 576px, // 36em at 16px
  md: 768px, // 48em at 16px
  lg: 992px, // 62em at 16px
  xl: 1200px // 75em at 16px
) !default;
```

Additional variables:

* `$breakpoint-names`: A list of all breakpoint names, in order of smallest to largest. Based on `$breakpoints`.
* `$first-breakpoint`: The name of the smallest breakpoint. Based on `$breakpoints`.
* `$system-default-font-size`: Always `16px`, used to calculate everything else. This is technically configurable, but you should not change it.

These variables can be accessed in your own code:

``` scss
@use "responsive";

// output the base font size
@debug responsive.$base-font-size;

// set a custom variable for each breakpoint
:root {
  @each $breakpoint in responsive.$breakpoint-names {
    @include responsive.breakpoint($breakpoint, $use-layers: false) {
      --my-breakpoint: $breakpoint;
    }
  }
}
```

See [sass/_config.scss](../sass/_config.scss) for further details.
