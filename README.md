---
page_type: sample
description: A maplibre-gl-js plugin that adds support for loading SVGs and SVG templates as images into the maps image sprite.
languages:
- javascript
- typescript
---

# MapLibre GL SVG Plugin

> Status: New plugin, still being validated. 

A [maplibre-gl-js](https://maplibre.org/maplibre-gl-js/docs/) plugin that adds support for loading SVGs images into the maps image sprite.

- [Go to the examples page](https://rbrundritt.github.io/maplibre-gl-svg/index.html)
- [Read the docs](https://github.com/rbrundritt/maplibre-gl-svg/blob/main/docs/docs.md)

**Features:**

- Load an SVG into the maps image sprite and use as an icon in a symbol layer, or as an fill pattern.
- Framework for templatable SVG icons. Great way to create reusable icons that you can programmatically change the styles of.
- HTML marker support

**Known Limitations**

- SVG's are converted into a data URI, and loaded as a static image into the maps image sprite. This means animations and CSS classes are not supported. All CSS styles should be embedded within the SVG.
  
## License

MIT
 
See [License](https://github.com/rbrundritt/maplibre-gl-svg/blob/main/LICENSE.md) for full license text.