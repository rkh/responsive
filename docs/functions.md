# Helper functions

## `size`

This is the most important function in the library. It is used to calculate a scalable version of a given size for use in width/height/etc properties.

If a breakpoint argument is given, or it is used in a context where the breakpoint can be automatically inferred, the function will return the computed size for that breakpoint. Otherwise it will return a `calc()` expression that will be evaluated at runtime.

``` scss
@use "responsive";

@include responsive.breakpoint("sm") {
  .example1 {
    width: responsive.size(100pt); // 23.1481481481vw
  }
}

.example2 {
  width: responsive.size(100px); // calc(var(--responsive-pixel-width) * 100)
}
```

## Other functions

* `responsive-width` – returns the breakpoint with in `rm` or `em` units. Example: `responsive-width("sm")` returns `36rem`.
* `assumed-width` – returns the assumed width of the viewport in `px`. Example: `assumed-width("xs")` returns `350px`.
* `min-width` – returns the minimum width of the viewport might be scaled down to in `px`. Example: `min-width("sm")` returns `576px`. Note that this is the same as `assumed-width` for all breakpoints but the first one.
* `pixel-width` – returns the width of a scaled pixel in `vw`.
* `base-font-size` – returns the base font size in `vw` (the equivalent of `pixel-width() * $base-font-size`).
* `breakpoint` – returns the name of the current breakpoint.
* `next-breakpoint` – returns the name of the next breakpoint.