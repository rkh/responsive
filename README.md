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