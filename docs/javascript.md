# JavaScript usage

This library does not include a full JavaScript wrapper at the moment (though one might be added in the future).

You can however access the CSS variables from JavaScript directly:

``` js
const pixelWidth = getComputedStyle(document.documentElement)
  .getPropertyValue("--responsive-pixel-width")
```

See [Vanilla CSS](vanilla-css.md) for more information.