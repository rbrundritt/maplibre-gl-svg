# How to the use the MapLibre GL SVG Plugin

Images can be used with HTML markers and various layers within MapLibre:

- Symbol layers can render points on the map with an image icon. Symbols can also be rendered along a lines path.
- Polygon/Fill layers can be rendered with a fill pattern image.
- HTML markers can render points using images and other HTML elements.

Be sure to check out the [examples page](https://rbrundritt.github.io/maplibre-gl-svg/index.html).

## Getting started

Download the project and copy the `maplibre-gl-svg` JavaScript file from the `dist` folder into your project.

> NPM package may be made available in the future once the initial version is locked in.

This plugin has two main classes; 

- `SvgManager` - A class that takes in a map instance and that makes it easy to load SVGs into the map sprite and manages the life cycle of SVG images within the map. 
- `SvgTemplateManager` - A static class the manages reusable SVG templates.

The `SvgManager` class provides the following functions.

| Name | Return Type | Description |
|------|-------------|-------------|
| `add(id: string, svg: string)` | `Promise<void>` | Adds an SVG image to the maps image sprite. The SVG can be either a URL to an SVG file, an inline SVG string, or SVG data URI. |
| `clear()` | | Removes all SVG images loaded into the maps sprite. |
| `getImageIds()`| `string[]` | Gets a list of all the image ids that have been added to the maps image sprite. |
| `hasImage(id: string)` | `boolean` | Checks to see if an image is already loaded into the maps image sprite. |
| `createFromTemplate(id: string, templateName: string, color?: string, secondaryColor?: string, scale?: number, text?: string)` | `Promise<void>` | Creates and adds an image to the maps image sprite from an SVG template. Provide the name of the built-in or pre-loaded template to use, and a color to apply. |
| `remove(id: string)` | | Removes an SVG image from the maps image sprite. |
| `reload()` | | It's possible that the map's image sprite may be cleared by the user outside of this manager. Calling this method will reload all images in this manager.  |

SVG templates can be added to the map image sprite resources by using the `createFromTemplate` function of an `SvgManager` instance. This function allows up to five parameters to be passed in;

```javascript
createFromTemplate(id: string, templateName: string, color: string = '#1A73AA', secondaryColor: string = 'white', scale: number = 1, text = ''): Promise<void>
```

The `id` is a unique identifier you create. The `id` is assigned to the image when it's added to the maps image sprite. Use this identifier in the layers to specifying which image resource to render. The `templateName` specifies which image template to use. The `color` option sets the primary color of the image and the `secondaryColor` options sets the secondary color of the image. The `scale` option scales the image template before applying it to the image sprite. When the image is applied to the image sprite, it's converted into a PNG. To ensure crisp rendering, it's better to scale up the image template before adding it to the sprite, than to scale it up in a layer.

This function asynchronously loads the image into the image sprite. Thus, it returns a `Promise` that you can wait for this function to complete.

The following code shows how to create an image from one of the built-in templates, and use it with a symbol layer.

```javascript
//Create a new instance of the SVG manager.
var svgManager = new maplibregl.SvgManager(map);

//Load an SVG templated icon into the map.
svgManager.createFromTemplate('myTemplatedImage', 'marker-flat', 'teal', '#fff').then(() => {

    //Add a layer to display a filled polygon.
    map.addLayer({
        'id': 'symbol-layer',
        'type': 'symbol',
        'source': {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': [
                    {
                        'type': 'Feature',
                        'properties': {
                        },
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [0,0]
                        }
                    }
                ]
            }
        },
        'layout': {            
            //Reference the templated icon.        
            'icon-image': 'myTemplatedImage'
        }
    });
});
```

In order to ensure good performance with layers, load the images into the map image sprite before rendering. 

> **NOTE**
> SVG's are converted into a data URI, and loaded as a static image into the maps image sprite. This means animations and CSS classes are not supported. All CSS styles should be embedded within the SVG.

## Use the SvgTemplateManager

If your application uses the same image with different styles, possible with multiple map instances, you can create reusable SVG templates which allow you to programmatically generate styled versions of your images. The static `maplibregl.SvgTemplateManager` class provides the following functions.

| Name | Return Type | Description |
|------|-------------|-------------|
| `addTemplate(templateName: string, template: string, override: boolean)` | | Adds an image template to the SvgTemplateManager. |
| `getElement(templateName: string, text?: string, color?: string, secondaryColor?: string, scale?: number)` | `HTMLElement` | Inflates a template and converts it into an HTMLElement. |
| `getTemplate(templateName: string, scale?: number)`| string | Retrieves an SVG template by name. |
| `getAllTemplateNames()` | `string[]` |  Retrieves an SVG template by name. |

## Use an SVG template with an HTML marker

An SVG template can be retrieved using the `maplibregl.SvgTemplateManager.getElement` function to retrieve an HTML element rendered version of the SVG template. This HTML element can then be passed into the markers `element` option.

```javascript
// Create marker element from SVG template.
const el = maplibregl.SvgTemplateManager.getElement('marker-arrow', 'AB', 'red', 'pink');

// Add marker to map
marker = new maplibregl.Marker({
    element: el,
    anchor: 'bottom'
}).setLngLat(center).addTo(map);
```

> **TIP**
> SVG templates can be used outside of the map too. The `getTemplate` funciton returns an SVG string that has placeholders; `{color}`, `{secondaryColor}`, `{scale}`, `{text}`. Replace these placeholder values to create a valid SVG string. You can then either add the SVG string directly to the HTML DOM, retrieve an HTML element version of the rendered template, or convert it into a data URI and insert it into an image tag or canvas. For example:
>
> ```JavaScript
> //Get an HTML element version of the template.
> var elm = maplibregl.SvgTemplateManager.getElement('marker', '', 'red', 'white', 1);
>
> //Retrieve an SVG template string and replace the placeholder values.
> var svg = maplibregl.SvgTemplateManager.getTemplate('marker').replace(/{color}/, 'red').replace(/{secondaryColor}/, 'white').replace(/{text}/, '').replace(/{scale}/, 1);
>
> //Convert to data URI for use in image tags.
> var dataUri = 'data:image/svg+xml;base64,' + btoa(svg);
> ```

## Use an SVG along a lines path

Once an SVG is loaded into the map image sprite, it can be rendered along the path of a line by adding a `LineString` to a data source and using a symbol layer with a `symbol-placement` option set to `line` and by referencing the ID of the image resource in the `icon-image` option.

```javascript
//Create a new instance of the SVG manager.
var svgManager = new maplibregl.SvgManager(map);

//Load an SVG templated icon into the map.
svgManager.createFromTemplate('myTemplatedImage', 'car', 'DodgerBlue', '#fff').then(() => {

    //Add a source for thelines.
    map.addSource('lines', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'properties': {
                    },
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': [
                            [-122.18822, 47.63208],
                            [-122.18204, 47.63196],
                            [-122.17243, 47.62976],
                            [-122.16419, 47.63023],
                            [-122.15852, 47.62942],
                            [-122.15183, 47.62988],
                            [-122.14256, 47.63451],
                            [-122.13483, 47.64041],
                            [-122.13466, 47.64422],
                            [-122.13844, 47.65440],
                            [-122.13277, 47.66515],
                            [-122.12779, 47.66712],
                            [-122.11595, 47.66712],
                            [-122.11063, 47.66735],
                            [-122.10668, 47.67035],
                            [-122.10565, 47.67498]
                        ]
                    }
                }
            ]
        }
    });

    //Add a layer to display the lines.
    map.addLayer({
        'id': 'lines',
        'type': 'line',
        'source': 'lines',
        'paint': {
            'line-width': 5,
            'line-color': 'Blue'
        }
    });

    //Add a layer for symbols along the line.
    map.addLayer({
        'id': 'line-symbols',
        'type': 'symbol',
        'source': 'lines',
        'layout': {            
            //Reference the templated icon.        
            'icon-image': 'myTemplatedImage',
            'symbol-placement': 'line',
            'symbol-spacing': 100,
            'icon-rotate': 90
        }
    });
});
```

> **TIP**
> If the SVG template points up, set the `rotation` icon option of the symbol layer to 90 if you want it to point in the same direction as the line.

## Use an SVG with a fill layer

Once an SVG template is loaded into the map image sprite, it can be rendered as a fill pattern in a fill layer by referencing the image resource ID in the `fill-pattern` option of the layer.

The [Fill polygon with built-in icon template] sample demonstrates how to render a polygon layer using the `dot` image template with a red primary color and a transparent secondary color, as shown in the following screenshot. For the source code for this sample, see [Fill polygon with built-in icon template sample code].

```javascript
//Create a new instance of the SVG manager.
var svgManager = new maplibregl.SvgManager(map);

//Load an SVG templated icon into the map.
svgManager.createFromTemplate('myFillPattern', 'dots', 'red', 'transparent').then(() => {

    //Add a layer to display a filled polygon.
    map.addLayer({
        'id': 'fill-layer',
        'type': 'fill',
        'source': {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': [
                    {
                        'type': 'Feature',
                        'properties': {
                        },
                        'geometry': {
                            'type': 'Polygon',
                            'coordinates': [[[-50, -20], [0, 40], [50, -20], [-50, -20]]]
                        }
                    }
                ]
            }
        },
        'paint': {
            //Apply the fill pattern.
            'fill-pattern': 'myFillPattern',
            'fill-opacity': 1
        }
    });
});
```

> **TIP**
> Setting an alpha value on the secondary color of fill patterns makes it easier to see the underlying map while still providing the primary pattern.

## Create a custom SVG template

SVG image templates are inline SVG strings that support the following placeholder values:

| Placeholder | Description        |
|-------------|--------------------|
| `{color}`   | The primary color. |
| `{secondaryColor}` | The secondary color. |
| `{scale}` | The SVG image is converted to an png image when added to the map image sprite. This placeholder can be used to scale a template before it's converted to ensure it renders clearly. |
| `{text}` | The location to render text when used with an HTML Marker. |

Below is an example of how to create a custom SVG template string, add it to the `SvgTemplateManager` and use it as a polygon fill pattern .

```javascript
//A custom icon template created using an inline SVG string with placeholders for {scale}, {color}, and {secondaryColor}.
var customTemplate = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="calc(80px * {scale})" height="calc(80px * {scale})"><rect x="0" y="0" width="80" height="80" fill="{secondaryColor}"/><path fill="{color}" d="M14 16H9v-2h5V9.87a4 4 0 1 1 2 0V14h5v2h-5v15.95A10 10 0 0 0 23.66 27l-3.46-2 8.2-2.2-2.9 5a12 12 0 0 1-21 0l-2.89-5 8.2 2.2-3.47 2A10 10 0 0 0 14 31.95V16zm40 40h-5v-2h5v-4.13a4 4 0 1 1 2 0V54h5v2h-5v15.95A10 10 0 0 0 63.66 67l-3.47-2 8.2-2.2-2.88 5a12 12 0 0 1-21.02 0l-2.88-5 8.2 2.2-3.47 2A10 10 0 0 0 54 71.95V56zm-39 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm40-40a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM15 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm40 40a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path></svg>';

//Add the custom template to the SVG template manager.
maplibregl.SvgTemplateManager.addTemplate('anchor-fill', customTemplate);

//Create a new instance of the SVG manager.
svgManager = new maplibregl.SvgManager(map);

//Load an SVG templated icon into the map.
svgManager.createFromTemplate('myFillPattern', 'anchor-fill', 'navy', 'rgba(0,150,150,0.5)').then(() => {

    //Add a layer to display a filled polygon.
    map.addLayer({
        'id': 'fill-layer',
        'type': 'fill',
        'source': {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': [
                    {
                        'type': 'Feature',
                        'properties': {
                        },
                        'geometry': {
                            'type': 'Polygon',
                            'coordinates': [[[-50, -20], [0, 40], [50, -20], [-50, -20]]]
                        }
                    }
                ]
            }
        },
        'paint': {
            //Apply the fill pattern.
            'fill-pattern': 'myFillPattern',
            'fill-opacity': 1
        }
    });
});
```

> **TIP** 
> Custom SVG template strings should have a `viewbox`, `width`, and `height` specified to represent the expected default size. Use CSS `calc` in the `width` and `height` properties to support scaling the template.

## List of image templates

In total there are 42 image templates provided: 27 symbol icons and 15 polygon fill patterns. This table lists all image templates currently available within the `SvgTemplateManager`. The template name is above each image. By default, the primary color is blue and the secondary color is white. To make the secondary color easier to see on a white background, the following images have the secondary color set to black.

**Symbol icon templates**

:::row:::
   :::column span="":::
      marker
   :::column-end:::
   :::column span="":::
      marker-thick
   :::column-end:::
   :::column span="":::
      marker-circle
   :::column-end:::
   :::column span="":::
      marker-flat
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      ![marker icon](./media/image-templates/marker.png)
   :::column-end:::
   :::column span="":::
      ![marker-thick icon](./media/image-templates/marker-thick.png)
   :::column-end:::
   :::column span="":::
      ![marker-circle icon](./media/image-templates/marker-circle.png)
   :::column-end:::
   :::column span="":::
      ![marker-flat icon](./media/image-templates/marker-flat.png)
   :::column-end:::
:::row-end:::
<br>

:::row:::
   :::column span="":::
      marker-square
   :::column-end:::
   :::column span="":::
      marker-square-cluster
   :::column-end:::
   :::column span="":::
      marker-arrow
   :::column-end:::
   :::column span="":::
      marker-ball-pin
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      ![marker-square icon](./media/image-templates/marker-square.png)
   :::column-end:::
   :::column span="":::
      ![marker-square-cluster icon](./media/image-templates/marker-square-cluster.png)
   :::column-end:::
   :::column span="":::
      ![marker-arrow icon](./media/image-templates/marker-arrow.png)
   :::column-end:::
   :::column span="":::
      ![marker-ball-pin icon](./media/image-templates/marker-ball-pin.png)
   :::column-end:::
:::row-end:::
<br>

:::row:::
   :::column span="":::
      marker-square-rounded
   :::column-end:::
   :::column span="":::
      marker-square-rounded-cluster
   :::column-end:::
   :::column span="":::
      flag
   :::column-end:::
   :::column span="":::
      flag-triangle
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      ![marker-square-rounded icon](./media/image-templates/marker-square-rounded.png)
   :::column-end:::
   :::column span="":::
      ![marker-square-rounded-cluster icon](./media/image-templates/marker-square-rounded-cluster.png)
   :::column-end:::
   :::column span="":::
      ![flag icon](./media/image-templates/flag.png)
   :::column-end:::
   :::column span="":::
      ![flag-triangle icon](./media/image-templates/flag-triangle.png)
   :::column-end:::
:::row-end:::
<br>

:::row:::
   :::column span="":::
      triangle
   :::column-end:::
   :::column span="":::
      triangle-thick
   :::column-end:::
   :::column span="":::
      triangle-arrow-up
   :::column-end:::
   :::column span="":::
      triangle-arrow-left
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      ![triangle icon](./media/image-templates/triangle.png)
   :::column-end:::
   :::column span="":::
      ![triangle-thick icon](./media/image-templates/triangle-thick.png)
   :::column-end:::
   :::column span="":::
      ![triangle-arrow-up icon](./media/image-templates/triangle-arrow-up.png)
   :::column-end:::
   :::column span="":::
      ![triangle-arrow-left icon](./media/image-templates/triangle-arrow-left.png)
   :::column-end:::
:::row-end:::
<br>

:::row:::
   :::column span="":::
      hexagon
   :::column-end:::
   :::column span="":::
      hexagon-thick
   :::column-end:::
   :::column span="":::
      hexagon-rounded
   :::column-end:::
   :::column span="":::
      hexagon-rounded-thick
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      ![hexagon icon](./media/image-templates/hexagon.png)
   :::column-end:::
   :::column span="":::
      ![hexagon-thick icon](./media/image-templates/hexagon-thick.png)
   :::column-end:::
   :::column span="":::
      ![hexagon-rounded icon](./media/image-templates/hexagon-rounded.png)
   :::column-end:::
   :::column span="":::
      ![hexagon-rounded-thick icon](./media/image-templates/hexagon-rounded-thick.png)
   :::column-end:::
:::row-end:::
<br>

:::row:::
   :::column span="":::
      pin
   :::column-end:::
   :::column span="":::
      pin-round
   :::column-end:::
   :::column span="":::
      rounded-square
   :::column-end:::
   :::column span="":::
      rounded-square-thick
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      ![pin icon](./media/image-templates/pin.png)
   :::column-end:::
   :::column span="":::
      ![pin-round icon](./media/image-templates/pin-round.png)
   :::column-end:::
   :::column span="":::
      ![rounded-square icon](./media/image-templates/rounded-square.png)
   :::column-end:::
   :::column span="":::
      ![rounded-square-thick icon](./media/image-templates/rounded-square-thick.png)
   :::column-end:::
:::row-end:::
<br>

:::row:::
   :::column span="":::
      arrow-up
   :::column-end:::
   :::column span="":::
      arrow-up-thin
   :::column-end:::
   :::column span="":::
      car
   :::column-end:::
   :::column span="":::
      &nbsp;
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      ![arrow-up icon](./media/image-templates/arrow-up.png)
   :::column-end:::
   :::column span="":::
      ![arrow-up-thin icon](./media/image-templates/arrow-up-thin.png)
   :::column-end:::
   :::column span="":::
      ![car icon](./media/image-templates/car.png)
   :::column-end:::
   :::column span="":::
      &nbsp;
   :::column-end:::
:::row-end:::

**Polygon fill pattern templates**

:::row:::
   :::column span="":::
      checker
   :::column-end:::
   :::column span="":::
      checker-rotated
   :::column-end:::
   :::column span="":::
      circles
   :::column-end:::
   :::column span="":::
      circles-spaced
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      ![checker icon](./media/image-templates/checker.png)
   :::column-end:::
   :::column span="":::
      ![checker-rotated icon](./media/image-templates/checker-rotated.png)
   :::column-end:::
   :::column span="":::
      ![circles icon](./media/image-templates/circles.png)
   :::column-end:::
   :::column span="":::
      ![circles-spaced icon](./media/image-templates/circles-spaced.png)
   :::column-end:::
:::row-end:::
<br>

:::row:::
   :::column span="":::
      diagonal-lines-up
   :::column-end:::
   :::column span="":::
      diagonal-lines-down
   :::column-end:::
   :::column span="":::
      diagonal-stripes-up
   :::column-end:::
   :::column span="":::
      diagonal-stripes-down
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      ![diagonal-lines-up icon](./media/image-templates/diagonal-lines-up.png)
   :::column-end:::
   :::column span="":::
      ![diagonal-lines-down icon](./media/image-templates/diagonal-lines-down.png)
   :::column-end:::
   :::column span="":::
      ![diagonal-stripes-up icon](./media/image-templates/diagonal-stripes-up.png)
   :::column-end:::
   :::column span="":::
      ![diagonal-stripes-down icon](./media/image-templates/diagonal-stripes-down.png)
   :::column-end:::
:::row-end:::
<br>

:::row:::
   :::column span="":::
      grid-lines
   :::column-end:::
   :::column span="":::
      rotated-grid-lines
   :::column-end:::
   :::column span="":::
      rotated-grid-stripes
   :::column-end:::
   :::column span="":::
      x-fill
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      ![grid-lines icon](./media/image-templates/grid-lines.png)
   :::column-end:::
   :::column span="":::
      ![rotated-grid-lines icon](./media/image-templates/rotated-grid-lines.png)
   :::column-end:::
   :::column span="":::
      ![rotated-grid-stripes icon](./media/image-templates/rotated-grid-stripes.png)
   :::column-end:::
   :::column span="":::
      ![x-fill icon](./media/image-templates/x-fill.png)
   :::column-end:::
:::row-end:::
<br>

:::row:::
   :::column span="":::
      zig-zag
   :::column-end:::
   :::column span="":::
      zig-zag-vertical
   :::column-end:::
   :::column span="":::
      dots
   :::column-end:::
   :::column span="":::
      &nbsp;
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      ![zig-zag icon](./media/image-templates/zig-zag.png)
   :::column-end:::
   :::column span="":::
      ![zig-zag-vertical icon](./media/image-templates/zig-zag-vertical.png)
   :::column-end:::
   :::column span="":::
      ![dots icon](./media/image-templates/dots.png)
   :::column-end:::
   :::column span="":::
      &nbsp;
   :::column-end:::
:::row-end:::
<br>

