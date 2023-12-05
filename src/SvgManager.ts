import type { Map, RequestParameters, ResourceType } from "maplibre-gl";
import { SvgTemplateManager } from "./SvgTemplateManager";
import { max } from "lodash";

/**
 * A class that manages the lifecycle of SVG's for a map instance.
 */
export class SvgManager {

    /************************
     * Private properties
     ***********************/

    private readonly  _map: Map;

    //A list of all the image ids tand image source data.
    private _images: Record<string, string> = {};

    /************************
     * Constructor
     ***********************/

    /**
     * A class that manages the lifecycle of SVG's for a map instance.
     * @param map A maplibre-gl-js map instance.
     */
    constructor(map: Map) {
        this._map = map;
    }

    /************************
     * Public functions
     ***********************/

    /**
     * Adds an SVG image to the maps image sprite.
     * @param id A unique ID to reference the image by. Use this to render this image in your layers. If the specified id matches the ID of a previously added image the new image will be ignored.
     * @param svg An inline SVG string, or URL to an SVG image. 
     * @param maxWidth The maximum width to allow the image to be. If the image exceeds this width it will be scaled down to fit. Default: 100
     * @param maxHeight The maximum height to allow the image to be. If the image exceeds this height it will be scaled down to fit. Default: 100
     */
    public add(id: string, svg: string, maxWidth: number = 100, maxHeight: number = 100): Promise<void> {
        return new Promise((resolve, reject) => {
            const images = this._images;
            const map = this._map;

            // Take no action if the new image uses the id of a previously added image.
            if (images[id]) {
                resolve();
                return;
            }

            if (typeof svg === "string") {
                let imageSrc: string;

                // Assume an inline svg image string if icon doesn't start with "data:", but does include "<svg"
                if (/<svg/i.test(svg) && !(/^data:/i.test(svg))) {
                    imageSrc = "data:image/svg+xml;base64," + window.btoa(svg);
                } else {
                    imageSrc = svg;
                }

                let request: RequestParameters = {
                    url: imageSrc
                };

                //TODO: In the future consider using map.loadImage so that it goes through the request transform and image throttling. 
                //Current not doing this as there is a breaking change in loadImage in version 4.0.0 of maplibre-gl-js (callbacks changed to promises). 
                if(map._requestManager._transformRequestFn) {
                    request = map._requestManager.transformRequest(imageSrc, <ResourceType>'Image');
                }

                fetch(request.url, request).then((response) => {
                    return response.blob();
                }).then((blob) => {
                    const imageElm = new Image();

                    // Wait for the blob to load into the element.
                    imageElm.onload = () => {

                        //Scale the image if it exceeds the max size.
                        if(maxWidth > 0 && maxHeight > 0 && (imageElm.width > maxWidth || imageElm.height > maxHeight)) {
                            const scale = Math.min(maxWidth / imageElm.width, maxHeight / imageElm.height);

                            if(scale < 1){
                                imageElm.width = imageElm.width * scale;
                                imageElm.height = imageElm.height * scale;
                            }
                        }

                        map.addImage(id, imageElm);
                        images[id] = imageSrc;
                        resolve();
                    };

                    // Reject if the blob failed to load in the element.
                    imageElm.onerror = imageElm.onabort = () => {
                        reject(`Failed to load "${id}" image.`);
                    };

                    // Convert the blob to a data url then load it into an Image element.
                    imageElm.src = URL.createObjectURL(blob);
                }).catch(() => {
                    reject(`Failed to load "${id}" image.`);
                });
            }
        });
    }

    /**
     * Removes all SVG images loaded into the maps sprite.
     */
    public clear(): void {
        const self = this;

        Object.keys(self._images).forEach((id) => {
            self._map.removeImage(id);
        });

        // Clear the list of user added image ids.
        self._images = {};
    }

    /**
     * Gets a list of all the image ids that have been added to the maps image sprite.
     */
    public getImageIds(): string[] {
        return Object.keys(this._images);
    }

    /**
     * Checks to see if an image is already loaded into the maps image sprite.
     * @param id The id to check the map's image sprite for.
     */
    public hasImage(id: string): boolean {
        return this._images[id] ? true : false;
    }
      
    /**
     * Creates and adds an image to the maps image sprite from an SVG template. 
     * Provide the name of the built-in or pre-loaded template to use, and a color to apply.
     * Optionally, specify a secondary color if the template supports one. 
     * A scale can also be specified. 
     * This will allow the SVG to be scaled before being converted into an image and thus look much better when scaled up. 
     * Returns a promise.
     * @param id A unique ID to reference the image by. Use this to render this image in your layers.
     * @param templateName The name of an SVG template to generate the image from.
     * @param color The primary color to apply to the template. Default `#1A73AA`
     * @param secondaryColor The secondary color value to apply to the template. Default: `white`
     * @param scale Specifies how much to scale the template. For best results, scale the icon to the maximum size you want to display it on the map, then use the symbol layers icon size option to scale down if needed. This will reduce blurriness due to scaling. Default: 1
     * @param text Text to display in the template. Rarely used with symbols since symbol layers have its own text support.
     */
    public createFromTemplate(id: string, templateName: string, color: string = '#1A73AA', secondaryColor: string = 'white', scale: number = 1, text:string = ''): Promise<void> {
        const html = SvgTemplateManager._applyStyle(templateName, text, color, secondaryColor, scale);
        return this.add(id, html);
    }

    /**
     * Removes an SVG image from the maps image sprite.
     * @param id The ID of the image to remove from the maps image sprite.
     */
    public remove(id: string): void {
        this._map.removeImage(id);
        delete this._images[id];
    }

    /**
     * It's possible that the map's image sprite may be cleared by the user outside of this manager. 
     * Calling this method will reload all images in this manager. 
     */
    public reload(): void {
        const self = this;
        Object.keys(self._images).forEach((id) => {
            //Verify map doesn't already have the image in the sprite.
            if (!self._map.hasImage(id)) {
                //Load the image source into an image element.
                const imageElm = new Image();
                imageElm.onload = () => {
                    //Add the image to the map's image sprite.
                    self._map.addImage(id, imageElm);
                };
                imageElm.src = this._images[id];
            }
        });
    }
}
