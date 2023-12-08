# Responsive and accessible Sass

`responsive` is a SCSS library for building responsive and accessible websites.

It does so by defining CSS layers, breakpoints, and variables, with a library of mixins, functions, and variables to help you use and configure them from within your Sass code.

With this library, you can use absolute units (e.g. `px`, `pt`) and have them converted into relative units (e.g. `rem`) based on the user's font size preference and the current breakpoint (which is also scaled based on the user's font size). This way you can in theory translate your designs pixel-perfectly into code (set your viewport size to the size used by your designer), and have these designs scale automatically, making them both responsive and accessible.

A few principles:

* **Accessible designs** – Breakpoints and calculated sizes are scaled based on the user's font size preference.
* **Responsive designs** – Breakpoints and variables play nice with media queries and container queries.
* **Pixel-perfect designs** – Functions and mixins are built to allow use of absolute units (e.g. `px`, `pt`) and have them converted into relative units (e.g. `rem`) automatically. Setting your viewport size to the size used by your designer should result in a pixel-perfect design (in theory).
* **Configurable** – The library is built to be configurable, so you can use your own breakpoints, enable/disable features, only use function or mixins, etc.
* **Gapless media-queries** - Media queries are generated without gaps, so no unexpected behaviors at the breakpoints.
* **Order independent** - The library uses CSS layers to predefine specificity. You don't risk having your media queries in the wrong order. No more `!important` hacks.

## Basic usage

The most important parts are the `breakpoint` mixin, which applies CSS rules only to a specific breakpoint, and the `size` function, which converts absolute units (e.g. `px`, `pt`) into relative units (e.g. `rem`).

## Standard breakpoints

These are the default breakpoints (can be configured):

 Breakpoint | Assumed width | Actual breakpoint                     | Font size
------------|---------------|---------------------------------------|------------------------
  `xs`      | $350px$       | $350px * \frac{1em}{16px} = 21.875em$ | $16px * \frac{100vw}{350px} \approx 4.571vw$
  `sm`      | $576px$       | $576px * \frac{1em}{16px} = 36em$     | $16px * \frac{100vw}{576px} = 2.7\overline{77}vw$
  `md`      | $768px$       | $768px * \frac{1em}{16px} = 48em$     | $16px * \frac{100vw}{768px} = 2.08\overline{3}vw$
  `lg`      | $992px$       | $992px * \frac{1em}{16px} = 62em$     | $16px * \frac{100vw}{992px} \approx 1.613vw$
  `xl`      | $1200px$      | $1200px * \frac{1em}{16px} = 75em$    | $16px * \frac{100vw}{1200px} = 1.3\overline{33}vw$

Note that for media queries, you should use `0em` for the `xs` breakpoint, to allow scaling down beyond the assumed width.

## Example

Input:

``` scss
@use '@rkh/responsive' with (
  $breakpoints: (
    'small': 0,
    'medium': 768px,
    'large': 1024px,
  )
);

/* scale the font-size for headlines */
h1 {
  font-size: responsive.size(24px);
}

/* changes color based on breakpoint */
.example {
  @include responsive.breakpoint('small') {
    color: green;
  }
  @include responsive.breakpoint('medium') {
    color: red;
  }
  @include responsive.breakpoint('large') {
    color: white;
  }
}
```

Will result in an output similar to:

``` css
/* ... layer and property definitions, as well as setting font-size on :root ... */

/* scale the font-size for headlines */
h1 {
  font-size: calc(var(--responsive-pixel-width) * 24);
}

/* changes color based on breakpoint */
@media (min-width: 0em) {
  @media not all and (min-width: 48em) {
    @layer responsive.bp-small {
      .example {
        color: green;
      }
    }
  }
}
@media (min-width: 48em) {
  @media not all and (min-width: 64em) {
    @layer responsive.bp-medium {
      .example {
        color: red;
      }
    }
  }
}
@media (min-width: 64em) {
  @layer responsive.bp-large {
    .example {
      color: white;
    }
  }
}
```


## Further reading

General topics:

* [Mixins](docs/mixins.md)
* [Variables and configuration](docs/variables.md)
* [Helper functions](docs/functions.md)

Using the library without Sass:

* [Vanilla CSS](docs/vanilla-css.md)
* [JavaScript](docs/javascript.md)