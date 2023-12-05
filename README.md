# Responsive and accessible CSS

CSS/SASS mixin to define breakpoints that respect a user's font size preference, and thus offer better accessibility (especially for people with low vision).

## Breakpoints

 Breakpoint | Assumed width | Actual breakpoint                     | Font size
------------|---------------|---------------------------------------|------------------------
  `xs`      | $350px$       | $350px * \frac{1em}{16px} = 21.875em$ | $16px * \frac{100vw}{350px} \approx 4.571vw$
  `sm`      | $576px$       | $576px * \frac{1em}{16px} = 36em$     | $16px * \frac{100vw}{576px} = 2.7\overline{77}vw$
  `md`      | $768px$       | $768px * \frac{1em}{16px} = 48em$     | $16px * \frac{100vw}{768px} = 2.08\overline{3}vw$
  `lg`      | $992px$       | $992px * \frac{1em}{16px} = 62em$     | $16px * \frac{100vw}{992px} \approx 1.613vw$
  `xl`      | $1200px$      | $1200px * \frac{1em}{16px} = 75em$    | $16px * \frac{100vw}{1200px} = 1.3\overline{33}vw$

Note that for media queries, you should use `0em` for the `xs` breakpoint, to allow scaling down beyond the assumed width.

## SCSS

### Example usage

``` scss
// this is enough to set up breakpoints
@use "@rkh/responsive";

// you can use the breakpoint mixin on any selector
.example {
  // apply rules only for the sm breakpoint (between 576px and 768px at the standard font size)
  @include responsive.breakpoint("sm") { width: 100%; }

  // apply rules for the md breakpoint and up (768px and above at the standard font size)
  @include responsive.breakpoint("md", $and-up: true) { width: 50%; } 
}

// you can use the size function to convert an assumed pixel width to be scaled by the user's font size preference
.example2 {
  // this will increase between break points, and "snap" back to 350px when a breakpoint is crossed
  width: responsive.size(350px);
}

// the two can be combined
.example3 {
  // apply with only the sm breakpoint (between 576px and 768px at the standard font size)
  @include responsive.breakpoint("sm") {
    // passing an option $breakpoint argument will calculate the size at compile time
    width: responsive.size(350px, $breakpoint: "sm");
  }
}
```

### Mixins

There is only one mixin, `responsive.breakpoint($breakpoint, $and-up: false)`. See above for usage examples.

The following input:

``` scss
.example {
  @include responsive.breakpoint("sm") { width: 100%; }
  @include responsive.breakpoint("md", $and-up: true) { width: 50%; } 
}
```

Will be compiled to:

``` css
@media (min-width: 36em) {
  @media not all and (min-width: 48em) {
    .example {
      width: 100%;
    }
  }
}
@media (min-width: 48em) {
  .example {
    width: 50%;
  }
}
```

### Functions

There are a couple of functions that can be used in your own code:

``` scss
@use "responsive" as *;

// Returns the scalable version of a given size for use in width/height/etc properties.
// Takes an optional breakpoint argument, in which case it will return an number instead of a CSS formula.
// This is the one function you usually want to use.
@debug size(100px, "sm"); // 17.3611111111vw
@debug size(100pt, "sm"); // 23.1481481481vw
@debug size(100px); // calc(var(--responsive-pixel-width) * 100px)

// Scale from an assumed pixel width to a responsive width, or get the assumed width for a given breakpoint.
// 
// Takes an optional unit to return the responsive value in. If you use the result in a `@media` query, set it to
// `em`, otherwise leave it as `rem`.
// 
// These sizes are relative to the system font size (for "em" values) or base font size (for "rem" values).
// 
// This will often be used for sizing elements, but if that explanation doesn't make sense in the context you want to use it it,
// it probably means you're better off using {size} instead. 
@debug responsive-width("sm");  // 36rem
@debug responsive-width(100px); // 6.25rem
@debug responsive-width(12pt);  // 1rem

// The assumed width in pixels for a given breakpoint.
@debug assumed-width("xs"); // 350px
@debug assumed-width("sm"); // 576px
@debug assumed-width();     // var(--assumed-width)

// The minimum width in pixels a given breakpoint might be scaled down to.
// Same as `assumed-width` for all but the smallest breakpoint.
@debug min-width("xs"); // 306.25px
@debug min-width("sm"); // 576px
@debug min-width();     // var(--responsive-min-width)

// The width of a scalable pixel-equivalent for a given breakpoint.
@debug pixel-width("sm"); // 0.1736111111vw
@debug pixel-width();     // var(--responsive-pixel-width)

// Base font-size as `vw` for a given breakpoint.
@debug base-font-size("sm"); // 2.7777777778vw
@debug base-font-size(); // var(--responsive-base-font-size)

// The name of the next breakpoint after the given one.
@debug next-breakpoint("xs"); // sm
```

Most of these functions of these function take an optional `$breakpoint` argument, which is used to calculate the size at compile time. If omitted, the size will be calculated at runtime and the function will instead return a `calc()` or `var()` expression.

### Variables and configuration

You can configure custom breakpoints by setting the following variables before importing the module:

``` scss
@use "responsive" with (
  $breakpoints: ("small": 375px, "medium": 800px, "large": 1200px),
  $base-font-size: 14px
);
```

The following configuration variables exist:

Variable          | Default                   | Description
------------------|---------------------------|------------
`$base-font-size` | `16px`                    | The base font size to be assumed for the design.
`$min-font-size`  | `14px`                    | The smallest size `1rem` can drop down to.
`$breakpoints`    | [see table](#breakpoints) | The breakpoints to be used. Mapping names to pixel values.

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
    @include responsive.breakpoint($breakpoint) {
      --my-breakpoint: $breakpoint;
    }
  }
}
```

See [sass/_config.scss](sass/_config.scss) for further details.

## Vanilla CSS

### Using media queries

#### Upsides
* Works in any modern browser.
* Easy to have sliding rules that cover multiple breakpoints.
* Vanilla CSS, no pre-processor or JavaScript required.

#### Downsides
* You have to hard-code the min-width in **em** (see table above), as you cannot use CSS variables in media queries.
* Changing breakpoints requires changing the CSS everywhere you use media queries, which is not ideal.
* Definition order matters, as the last rule wins (place larger breakpoints after smaller ones).

#### Example
``` css
/* it's important to use the em value from above instead of 576px */
@media (min-width: 36em) {
  /* styles for sm and up */
  .myElement {
    min-width: calc(300px * var(--assumed-pixel-width));
  }
}
```

To have a query that covers only exactly one breakpoint, you can use the following approach:

``` css
@media (min-width: 36em) {
  @media not all and (min-width: 48em) {
    /* styles for sm only */
    .myElement {
      color: red;
    }
  }
}
```

### Using container queries

#### Upsides
* You can use CSS variables to define the breakpoints.
* Easy to define rules for an individual breakpoint, or a list of breakpoints.
* Order matters less, so less chance of accidentally overriding rules.
* Vanilla CSS, no pre-processor or JavaScript required.

#### Downsides
* Limited [browser support](https://developer.mozilla.org/en-US/docs/Web/CSS/@container#browser_compatibility).

#### Example
``` css
@container style(--breakpoint: sm) {
  /* styles for sm (and sm only) */
  .myElement {
    min-width: calc(300px * var(--assumed-pixel-width));
  }
}
```

### Using CSS classes

#### Upsides
* Works in any modern browser.
* Easy to define rules for an individual breakpoint, or a list of breakpoints.
* Order matters less, so less chance of accidentally overriding rules.

#### Downsides
* You have to add a [JavaScript snippet](js/add-class.js) to the page to add the classes to the `<html>` element.

#### Example

``` html
<html>
  <head>
    <link rel="stylesheet" href="@rkh/responsive/css/index.css">
    <script src="@rkh/responsive/js/add-class.js"></script>
    <style>
      html:where(.xs, .sm) .myElement {
        /* styles for xs and sm */
        color: red;
      }
    </style>
  </head>
  <body>
    <div class="myElement">
      Hello!
    </div>
  </body>
</html>
```

## JavaScript

``` js
const pixelWidth = getComputedStyle(document.documentElement)
  .getPropertyValue("--responsive-pixel-width")
```