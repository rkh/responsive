# Vanilla CSS

A compiled CSS version is included in the package (in the `css` folder). This is using the default configuration. You can also create a custom version via the Sass CLI:

``` scss
// responsive.scss
@use "@rkh/responsive" with (
  $use-layers: false
  $breakpoints: (
    sm: 576px,
    md: 768px,
    lg: 992px,
    xl: 1200px,
  ),
);
```

Then run this command:

``` console
$ sass --no-source-map --style compressed responsive.scss responsive.css
```

## Variables

The generated CSS will define a range of variables:

 Variable                     | Example              | Description
------------------------------|----------------------|---------------------------------
 `--breakpoint-names`         | `xs, sm, md, lg, xl` | List of all breakpoints.
 `--breakpoint`               | `md`                 | The currently active breakpoint.
 `--assumed-width`            | `768px`              | The assumed unscaled width of the viewport pixels.
 `--assumed-base-font-size`   | `16px`               | The assumed unscaled base font size in pixels.
 `--assumed-pixel-width`      | `1px`                | The assumed width of an unscaled pixel.
 `--responsive-width`         | `48rem`              | The width used for the media query.
 `--responsive-min-width`     | `768px`              | The minium actual width to scale down to.
 `--responsive-base-font-size`| `2.0833333333vw`     | The actual base font size (ie, `1rem`).
 `--responsive-pixel-width`   | `0.1302083333vw`     | The width of a scaled pixel.

Most of these also have fixed values per breakpoint. For example, while `--responsive-width` will change depending on the viewport width, `--sm-responsive-width` will always be `36em` (ie, `576px`).

You can use these variables in your CSS for calculations, for example:

``` css
.myElement {
  /* set min-width to the equivalent of 300px */
  min-width: calc(var(--assumed-pixel-width) * 300);
}
```

## Breakpoint detection

### Using media queries

Unfortunately, you cannot use CSS variables in media queries. This is impossible:
  
``` css
/* !!! DOES NOT WORK !!! */
@media (min-width: var(--sm-responsive-width)) {
  /* ... */
}
```

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
