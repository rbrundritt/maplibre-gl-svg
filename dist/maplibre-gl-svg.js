/*
MIT License

Copyright (c) 2023 Ricky Brundritt

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function (exports) {
    'use strict';

    /** A framework for templatable SVG images. */
    var SvgTemplateManager = /** @class */ (function () {
        function SvgTemplateManager() {
        }
        /************************
         * Public functions
         ***********************/
        /**
         * Adds an image template to the SvgTemplateManager.
         * @param templateName The name of the template.
         * @param template The SVG template to add. Supports `{color}`, `{secondaryColor}`, `{scale}`, and `{text}`
         * @param override Specifies if it should override existing templates if one with the same name already exists.
         */
        SvgTemplateManager.addTemplate = function (templateName, template, override) {
            var imageTemplates = SvgTemplateManager._imageTemplates;
            if (override || !imageTemplates[templateName.toLowerCase()]) {
                imageTemplates[templateName.toLowerCase()] = template;
            }
        };
        /**
         * Inflates a template and converts it into an HTMLElement.
         * @param templateName The name of the template to inflate.
         * @param text Text to display in the template.
         * @param color Primary color.
         * @param secondaryColor Secondary colors.
         * @param scale Scale of the template.
         * @returns
         */
        SvgTemplateManager.getElement = function (templateName, text, color, secondaryColor, scale) {
            if (text === void 0) { text = ''; }
            if (color === void 0) { color = '#1A73AA'; }
            if (secondaryColor === void 0) { secondaryColor = 'white'; }
            if (scale === void 0) { scale = 1; }
            var htmlEle = document.createElement("div");
            htmlEle.innerHTML = SvgTemplateManager._applyStyle(templateName, text, color, secondaryColor, scale);
            return htmlEle;
        };
        /**
         * Retrieves an SVG template by name.
         * @param templateName The name of the template to retrieve.
         * @param scale Optional. A value indicating how much to scale the image.
         */
        SvgTemplateManager.getTemplate = function (templateName, scale) {
            if (scale === void 0) { scale = 1; }
            scale = Math.abs(scale || 1);
            var imageTemplates = SvgTemplateManager._imageTemplates;
            if (typeof templateName === "string" && imageTemplates[templateName.toLowerCase()]) {
                var template = imageTemplates[templateName.toLowerCase()];
                // Firefox/Edge don't support calc for inline SVG's. Need to manually calculate this.
                var pattern = /calc\(([0-9.]+)[px]*\s*\*\s*\{scale\}\)/gi;
                var t = template;
                var match = pattern.exec(template);
                while (match) {
                    t = t.replace(match[0], parseFloat(match[1]) * scale + "");
                    match = pattern.exec(template);
                }
                // Just for good measure incase the pattern doesn't match.
                t = t.replace("{scale}", scale + "");
                return t;
            }
            else {
                throw new Error("Invalid templateName.");
            }
        };
        /**
         * Gets the name of all image templates loaded into the SvgTemplateManager
         */
        SvgTemplateManager.getAllTemplateNames = function () {
            return Object.keys(SvgTemplateManager._imageTemplates);
        };
        /**
         * Fills in the placeholder values of a template with the given values
         * @param templateName Name of the template to use.
         * @param text Text to display in the template.
         * @param color Primary color.
         * @param secondaryColor Secondary colors.
         * @param scale Scale of the template.
         * @returns HTML string of the filled template.
         */
        SvgTemplateManager._applyStyle = function (templateName, text, color, secondaryColor, scale) {
            if (text === void 0) { text = ''; }
            if (color === void 0) { color = '#1A73AA'; }
            if (secondaryColor === void 0) { secondaryColor = 'white'; }
            if (scale === void 0) { scale = 1; }
            color = color || "#1A73AA";
            secondaryColor = secondaryColor || "#fff";
            var t = SvgTemplateManager.getTemplate(templateName, scale);
            t = t.replace(/{color}/g, color).replace(/{secondaryColor}/g, secondaryColor).replace(/{text}/g, text ? text : '');
            return t;
        };
        /**
         * A list of built in image templates.
         */
        SvgTemplateManager._imageTemplates = {
            /**********************
             * Marker templates
             **********************/
            "marker": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(27 * {scale})" height="calc(39 * {scale})" viewBox="-1 -1 26 38"><path d="M12.25.25a12.254 12.254 0 0 0-12 12.494c0 6.444 6.488 12.109 11.059 22.564.549 1.256 1.333 1.256 1.882 0C17.762 24.853 24.25 19.186 24.25 12.744A12.254 12.254 0 0 0 12.25.25Z" style="fill:{color};stroke:{secondaryColor};stroke-width:1"/><text x="12.5" y="17.5" style="font-size:14px;fill:#fff;text-anchor:middle">{text}</text></svg>',
            "marker-thick": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(28 * {scale})" height="calc(39 * {scale})" viewBox="-1 -1 27 38"><path d="M12.25.25a12.254 12.254 0 0 0-12 12.494c0 6.444 6.488 12.109 11.059 22.564.549 1.256 1.333 1.256 1.882 0C17.762 24.853 24.25 19.186 24.25 12.744A12.254 12.254 0 0 0 12.25.25Z" style="fill:{color};stroke:{secondaryColor};stroke-width:2"/><text x="12.5" y="18.5" style="font-size:14px;fill:#fff;text-anchor:middle">{text}</text></svg>',
            "marker-circle": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(28 * {scale})" height="calc(39 * {scale})" viewBox="-1 -1 27 38"><path d="M12.25.25a12.254 12.254 0 0 0-12 12.494c0 6.444 6.488 12.109 11.059 22.564.549 1.256 1.333 1.256 1.882 0C17.762 24.853 24.25 19.186 24.25 12.744A12.254 12.254 0 0 0 12.25.25Z" style="fill:{color};stroke:{secondaryColor};stroke-width:1"/><circle cx="12.5" cy="12.5" r="9" fill="{secondaryColor}"/><text x="12" y="17.5" style="font-size:14px;fill:#000;text-anchor:middle">{text}</text></svg>',
            "pin": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(24 * {scale})" height="calc(28 * {scale})" viewBox="0 0 24 28"><path d="m11.988 16.615a5.15 5.15 0 0 1-2.268-.525 4.909 4.909 0 0 1-2.805-4.442 5.019 5.019 0 0 1 5.072-4.936h.012a5.03 5.03 0 0 1 5.085 4.961 4.907 4.907 0 0 1-.549 2.224 5.114 5.114 0 0 1-4.548 2.718zm0-8.06a3.173 3.173 0 0 0-3.226 3.099 3.081 3.081 0 0 0 1.77 2.782 3.299 3.299 0 0 0 4.365-1.386 3.049 3.049 0 0 0 .342-1.381 3.184 3.184 0 0 0-3.239-3.114h-.012z" fill="{secondaryColor}"/><path d="m11.999.922a10.908 10.908 0 0 0-11.076 10.732 10.639 10.639 0 0 0 4.418 8.598l6.658 6.464 6.658-6.463a10.537 10.537 0 0 0 2.198-15.041 11.182 11.182 0 0 0-8.856-4.289zm1.873 14.341a4.221 4.221 0 0 1-5.589-1.789 3.945 3.945 0 0 1-.445-1.8 4.164 4.164 0 0 1 8.323-.037 4.028 4.028 0 0 1-2.289 3.626Z" fill="{color}"/><path d="m11.999 28-7.256-7.044a11.611 11.611 0 0 1-4.743-9.303 11.844 11.844 0 0 1 11.988-11.652.102 .102 0 0 1 .02 0 12.164 12.164 0 0 1 9.577 4.647 11.357 11.357 0 0 1 2.299 8.614 11.521 11.521 0 0 1-4.63 7.695zm-.01-26.157a9.997 9.997 0 0 0-10.143 9.812 9.769 9.769 0 0 0 4.04 7.853l.099.083 6.014 5.838 6.113-5.922a9.7 9.7 0 0 0 3.945-6.505 9.533 9.533 0 0 0-1.933-7.229 10.305 10.305 0 0 0-8.116-3.931h-.021zm.021 14.772a5.11 5.11 0 0 1-4.547-2.718 4.868 4.868 0 0 1 .932-5.743 5.118 5.118 0 0 1 3.58-1.46h.024a5.031 5.031 0 0 1 5.084 4.938 4.92 4.92 0 0 1-2.805 4.457h0a5.152 5.152 0 0 1-2.269.525zm-.011-8.079h-.015a3.277 3.277 0 0 0-2.295.933 3.029 3.029 0 0 0-.587 3.58 3.297 3.297 0 0 0 4.364 1.386h0a3.092 3.092 0 0 0 1.772-2.795 3.185 3.185 0 0 0-3.239-3.105z" fill="{secondaryColor}"/><text x="12" y="17" style="font-size:14px;fill:#000;text-anchor:middle">{text}</text></svg>',
            "pin-round": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(25 * {scale})" height="calc(25 * {scale})" viewBox="0 0 25 25"><g transform="translate(0 1)"><circle cx="12.25" cy="11.5833" r="11" fill="{color}"/><path d="m12.25 23.583a12 12 0 1 1 12-12 12 12 0 0 1-12 12zm0-22a10 10 0 1 0 10 10 10 10 0 0 0-10-10z" fill="{secondaryColor}"/><circle cx="12.25" cy="11.5833" r="4.2386" fill="{secondaryColor}"/></g><text x="12.5" y="17" style="font-size:14px;fill:#000;text-anchor:middle">{text}</text></svg>',
            "marker-flat": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(27 * {scale})" height="calc(42.8 * {scale})"  viewBox="0 0 1600 2570"><g fill="{color}"><path d="M691 2419c-409-575-641-1086-683-1504-10-106-10-136 5-224 31-188 105-330 241-458 129-124 270-190 453-214 69-9 113-10 182-1 373 46 655 326 703 698 40 308-120 801-424 1309-134 224-348 535-369 535-4 0-53-63-108-141z"/></g><g fill="rgba(0,0,0,0.15)" style="transform:scale(-1,1);transform-origin:center"><path d="M691 2419c-407-571-639-1083-682-1498-14-139-3-249 37-371 69-208 254-402 459-481 68-27 217-59 271-59h24v160 180 940 635c0 349-2 635-5 635-2 0-49-63-104-141z"/></g><circle cx="800" cy="800" r="600" fill="{secondaryColor}"/><text x="800" y="1100" style="font-size:800px;fill:#000;text-anchor:middle">{text}</text></svg>',
            "marker-arrow": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(25.47 * {scale})" height="calc(35.18 * {scale})" viewBox="0 0 4330 5980"><g fill="{color}"><path d="m2080 5969c-49-20-93-63-115-113-25-55-1928-5486-1953-5573-40-138 67-282 210-283 36 0 246 73 987 345 518 190 947 345 955 345 8 0 438-155 955-345 615-226 954-345 979-345 87 0 165 47 204 123 46 91 107-95-957 2942-537 1535-986 2805-997 2823-11 18-43 46-72 62-41 24-62 30-111 29-33 0-71-5-85-10z"/></g><g fill="{secondaryColor}"><path d="m2200 1600c-36 10-83 2-484-84-243-53-451-94-461-91-11 4-22 18-25 31-5 19 114 371 436 1292 244 697 448 1273 454 1281 19 24 50 30 71 12z"/><path d="m2200 1600c-36 10-83 2-484-84-243-53-451-94-461-91-11 4-22 18-25 31-5 19 114 371 436 1292 244 697 448 1273 454 1281 19 24 50 30 71 12z" style="transform:scale(-1,1);transform-origin:center"/></g><g fill="rgba(0,0,0,0.2)" ><path d="m2165 685c8 0 438-155 955-345 615-226 954-345 979-345 87 0 165 47 204 123 46 91 107-95-957 2942-537 1535-986 2805-997 2823-11 18-43 46-72 62-41 24-62 30-111 29z"/></g><text x="2165" y="3300" style="font-size:2500px;fill:#fff;text-anchor:middle">{text}</text></svg>',
            "marker-ball-pin": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(15.67 * {scale})" height="calc(33.33 * {scale})" viewBox="0 0 235 452"><g transform="translate(-135 10)"><path fill="{secondaryColor}" d="m256 442 0 0c-13 0-18-11-18-24l-6-323c0-13 11-24 24-24h0c13 0 24 11 24 24l-6 323c0 13-5 24-18 24z"/><circle style="fill:{color};stroke-width:10;stroke:{secondaryColor}" cx="256" cy="112" r="111"/><ellipse transform="matrix(0.834 0.5518 -0.5518 0.834 65.7916 -97.18)" fill="rgba(255,255,255,0.3)" cx="194.399" cy="60.749" rx="19.076" ry="32.428"/></g><text x="117.5" y="160" style="font-size:160px;fill:#fff;text-anchor:middle">{text}</text></svg>',
            "marker-square": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(26.67 * {scale})" height="calc(32.27 * {scale})" viewBox="0 0 2000 2420"><g transform="translate(100 100)" style="stroke:{secondaryColor};stroke-width:100;fill:{color}"><path d="M845 2152c-22-37-58-95-80-129-22-35-62-99-90-143l-50-80-312 0-313 0 0-900 0-900 900 0 900 0 0 900 0 900-313 0-313 0-34 58c-19 31-38 59-42 60-5 2-8 8-8 12 0 9-69 123-88 145-5 6-11 15-13 21-16 39-77 123-89 124-8 0-33-31-55-68z"/></g><text x="1000" y="1300" style="font-size:1000px;fill:#fff;text-anchor:middle">{text}</text></svg>',
            "marker-square-cluster": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(33.33 * {scale})" height="calc(38.8 * {scale})" viewBox="0 0 2500 2910"><g transform="translate(100 100)" style="stroke:{secondaryColor};stroke-width:100;fill:{color}"><path d="m866 2652c-17-31-37-68-46-82-9-14-32-54-51-90-19-36-50-92-70-125l-36-60-332-3-331-2 0-905 0-905 660 0 660 0 0-38c0-71 50-196 102-258 71-85 189-164 244-164 12 0 26-4 29-10 8-13 222-13 230 0 3 6 17 10 30 10 25 0 117 45 154 76 130 107 191 232 191 392 0 155-63 284-190 386-36 29-129 76-150 76-11 0-22 5-25 10-3 6-31 10-61 10l-54 0 0 660 0 660-332 2-332 3-29 50c-17 28-48 84-70 125-22 41-47 86-56 100-9 14-30 51-46 83-17 32-36 57-45 57-8 0-28-25-44-58z"/></g><text x="1650" y="900" style="font-size:1000px;fill:#fff">+</text><text x="1000" y="1800" style="font-size:1000px;fill:#fff;text-anchor:middle">{text}</text></svg>',
            "marker-square-rounded": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(26.8 * {scale})" height="calc(32.27 * {scale})" viewBox="0 0 2010 2410"><g transform="translate(100 100)" style="stroke:{secondaryColor};stroke-width:100;fill:{color}"><path d="M856 2155c-20-30-36-59-36-65 0-5-4-10-10-10-5 0-10-5-10-11 0-5-18-37-40-69-22-32-40-64-40-69 0-6-4-11-10-11-5 0-10-5-10-10 0-6-15-33-32-60l-33-50-127 0c-74 0-129-4-133-10-3-5-17-10-30-10-25 0-116-45-155-76-87-69-142-151-178-265-15-46-17-1075-2-1084 5-3 10-17 10-30 0-13 5-27 10-30 6-3 10-13 10-22 0-22 83-135 122-168 57-46 62-50 112-75l50-25 585 0 586 0 63 34c84 46 169 133 212 218l35 68 0 565 0 565-28 59c-32 69-100 157-139 180-15 9-33 22-40 29-23 22-99 57-123 57-13 0-27 5-30 10-4 6-60 10-135 10l-128 0-128 205c-84 136-133 205-144 205-10 0-33-24-54-55z"/></g><text x="1000" y="1300" style="font-size:1000px;fill:#fff;text-anchor:middle">{text}</text></svg>',
            "marker-square-rounded-cluster": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(33.33 * {scale})" height="calc(32.13 * {scale})" viewBox="0 0 2500 2900"><g transform="translate(100 100)" style="stroke:{secondaryColor};stroke-width:100;fill:{color}"><path d="m874 2669c-9-18-26-49-37-68-11-20-30-55-43-78-13-24-36-64-51-90-14-27-38-69-52-95l-26-48-142 0c-84 0-144-4-148-10-3-5-17-10-30-10-25 0-118-46-154-76-91-76-136-142-175-254-13-38-16-119-16-554 0-358 3-520 12-545 40-125 106-219 195-278 127-84 116-83 646-83l467 0 0-42c0-46 11-87 45-163 54-121 169-220 306-264 46-14 232-14 278 0 165 53 284 175 340 350 19 61 14 204-10 273-32 91-94 178-169 240-38 31-130 76-155 76-13 0-27 5-30 10-3 6-28 10-56 10l-49 0 0 462c0 446-1 464-21 522-32 91-94 178-169 240-38 31-130 76-155 76-13 0-27 5-30 10-4 6-65 10-149 10-138 0-143 1-154 23-12 23-62 114-112 202-16 28-44 79-63 115-42 77-67 88-93 39z"/></g><text x="1650" y="900" style="font-size:1000px;fill:#fff">+</text><text x="1000" y="1800" style="font-size:1000px;fill:#fff;text-anchor:middle">{text}</text></svg>',
            "flag": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(23.5 * {scale})" height="calc(40 * {scale})" viewBox="34 28 198 308"><path style="stroke:{secondaryColor};stroke-width:15;stroke-linecap:round;" d="M42 327l0 -291"/><path style="fill:{color};stroke:{secondaryColor};stroke-width:10;stroke-linejoin:round;" d="M49 50c70 30 104 28 178 2-21 42-21 74 0 116-72 25-101 25-178 0l0-118z"/><text x="130" y="165" style="font-size:100px;fill:#fff;text-anchor:middle">{text}</text></svg>',
            "flag-triangle": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(27 * {scale})" height="calc(35.33 * {scale})" viewBox="0 0 40.5 53"><g transform="translate(-31 -20)"><path fill="{secondaryColor}" d="M34.7,73.3V48.4l34.6-10.1c0.7-0.2,1.2-0.8,1.2-1.5s-0.4-1.4-1-1.7L33.7,20.5c-0.5-0.2-1.1-0.2-1.6,0.2 c-0.5,0.3-0.7,0.8-0.7,1.4v51.2H34.7z"/><polygon points="34.7,24.5 66,36.5 34.7,45 34.7,10" fill="{color}"/></g><text x="11" y="21" style="font-size:14px;fill:#fff;text-anchor:middle">{text}</text></svg>',
            "rounded-square": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(34 * {scale})" height="calc(34 * {scale})" viewBox="0 0 34 34"><g transform="translate(2 2)"><rect x="0" y="0" rx="8" ry="8" width="30" height="30" style="stroke:{secondaryColor};stroke-width:2;fill:{color}"/></g><text x="17" y="22" style="font-size:14px;fill:#fff;text-anchor:middle">{text}</text></svg>',
            "rounded-square-thick": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(38 * {scale})" height="calc(38 * {scale})" viewBox="0 0 38 38"><g transform="translate(4 4)"><rect x="0" y="0" rx="8" ry="8" width="30" height="30" style="stroke:{secondaryColor};stroke-width:4;fill:{color}"/></g><text x="19" y="24" style="font-size:14px;fill:#fff;text-anchor:middle">{text}</text></svg>',
            "triangle": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(36 * {scale})" height="calc(36 * {scale})" viewBox="0 0 36 36"><g transform="translate(2 2)"><polygon points="16,0 32,32 0,32 16,0" style="stroke:{secondaryColor};stroke-width:2;fill:{color}"/></g><text x="17.5" y="30" style="font-size:12px;fill:#fff;text-anchor:middle">{text}</text></svg>',
            "triangle-thick": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(40 * {scale})" height="calc(40 * {scale})" viewBox="0 0 40 40"><g transform="translate(4 4)"><polygon points="16,0 32,32 0,32 16,0" style="stroke:{secondaryColor};stroke-width:4;fill:{color}"/></g><text x="19.5" y="32" style="font-size:12px;fill:#fff;text-anchor:middle">{text}</text></svg>',
            "hexagon": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(35 * {scale})" height="calc(40 * {scale})" viewBox="0 0 35 40"><g transform="translate(2 2)"><path d="M31 9 15.5 0 0 9 0 27 15.5 36 31 27 31 9Z" style="stroke:{secondaryColor};stroke-width:2;fill:{color}"/></g><text x="17.5" y="25" style="font-size:14px;fill:#fff;text-anchor:middle">{text}</text></svg>',
            "hexagon-thick": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(39 * {scale})" height="calc(44 * {scale})" viewBox="0 0 39 44"><g transform="translate(4 4)"><path d="M31 9 15.5 0 0 9 0 27 15.5 36 31 27 31 9Z" style="stroke:{secondaryColor};stroke-width:4;fill:{color}"/></g><text x="19.5" y="27" style="font-size:14px;fill:#fff;text-anchor:middle">{text}</text></svg>',
            "hexagon-rounded": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(40 * {scale})" height="calc(40 * {scale})" viewBox="0 0 1100 1100"><g transform="translate(50 50)"><path style="stroke:{secondaryColor};stroke-width:50;fill:{color}" d="M881 210 561 25c-33-19-88-19-121 0L119 210c-33 19-61 67-61 105v370c0 39 27 86 61 105l321 185c33 19 88 19 122 0l321-185c33-19 61-67 61-105V315C942 276 915 229 881 210z"/></g><text x="550" y="700" style="font-size:400px;fill:#fff;text-anchor:middle">{text}</text></svg>',
            "hexagon-rounded-thick": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(40 * {scale})" height="calc(40 * {scale})" viewBox="0 0 1200 1200"><g transform="translate(100 100)"><path style="stroke:{secondaryColor};stroke-width:100;fill:{color}" d="M881 210 561 25c-33-19-88-19-121 0L119 210c-33 19-61 67-61 105v370c0 39 27 86 61 105l321 185c33 19 88 19 122 0l321-185c33-19 61-67 61-105V315C942 276 915 229 881 210z"/></g><text x="600" y="750" style="font-size:400px;fill:#fff;text-anchor:middle">{text}</text></svg>',
            "triangle-arrow-up": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(28 * {scale})" height="calc(28 * {scale})" viewBox="0 0 28 28"><g transform="translate(2 2)"><polygon points="12,0 0,24 12,17 24,24" stroke-width="2" stroke="{secondaryColor}" fill="{color}"/></g><text x="14" y="17" style="font-size:8px;fill:#fff;text-anchor:middle">{text}</text></svg>',
            "triangle-arrow-left": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(28 * {scale})" height="calc(28 * {scale})" viewBox="0 0 28 28"><g transform="translate(2 2)"><polygon points="24,12 0,0 7,12 0,24" stroke-width="2" stroke="{secondaryColor}" fill="{color}"/></g><text x="14" y="16.5" style="font-size:8px;fill:#fff;text-anchor:middle">{text}</text></svg>',
            "arrow-up": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(12.16 * {scale})" height="calc(30.1 * {scale})" viewBox="0 0 902 364"><g fill="{color}" transform="matrix(0,2.4,-2.4,0,897,-930)"><polygon points="902,222 233,222 233,364 0,182 233,0 233,141 902,141 902,222"/></g><text x="450" y="700" style="font-size:900px;fill:#000;text-anchor:middle">{text}</text></svg>',
            "arrow-up-thin": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(16 * {scale})" height="calc(33.33 * {scale})" viewBox="0 0 12 25"><g transform="translate(-136.91823 -751.91998)"><path fill="{color}" d="m148.271 760.71c-1.641-.547-3.186-1.47-4.633-2.769l0 18.07-1.675 0 0-18.07c-1.447 1.299-2.986 2.222-4.616 2.769l0-1.231c2.325-1.596 4.006-3.812 5.043-6.65l.838 0c1.037 2.838 2.718 5.055 5.043 6.65l0 1.231z"/></g><text x="6" y="20" style="font-size:10px;fill:#000;text-anchor:middle">{text}</text></svg>',
            "car": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(21.93 * {scale})" height="calc(40.9 * {scale})" viewBox="0 0 6580 12270"><g transform="translate(0 12270) rotate(-90)"><path fill="{secondaryColor}" d="M7045 6566c-42-13-105-44-105-51 0-2 23-105 50-228 28-123 50-230 50-236 0-8-241-11-907-11-855 0-1145 6-1513 30-85 6-189 13-230 15-41 3-133 10-205 15-286 21-430 32-705 50-953 63-1459 18-2335-205-304-77-746-209-799-238-131-72-221-408-285-1062-34-345-42-532-48-1130-16-1557 108-2532 336-2649 32-17 469-149 676-205 409-110 819-191 1205-238 116-14 224-18 540-18 395 1 494 5 1140 50 1124 79 1224 82 2496 78l641-3-53-237c-29-131-52-238-51-239 1-1 31-14 66-29 56-23 76-26 142-23 67 3 83 7 120 33 23 17 50 41 61 55 10 14 51 117 91 230l73 205 674 3 675 2 90-39c98-43 198-72 315-93 122-21 829-18 990 5 321 45 626 143 849 270 293 168 516 378 704 662 266 402 416 893 467 1527 15 174 8 882-9 998-6 41-18 127-27 190-69 502-253 969-523 1325-79 105-262 284-381 374-189 142-355 229-574 300-336 110-526 139-952 148-457 9-685-23-887-124l-47-24-678-6-678-6-64 179c-79 224-92 253-121 284-67 70-177 97-274 66zm-2752-5073c-23-2-64-2-90 0-26 2-7 3 42 3 50 0 71-1 48-3zm395 0c-21-2-55-2-75 0-21 2-4 4 37 4 41 0 58-2 38-4z"/><path fill="{color}" d="M7043 6498c-13-6-23-19-23-28 0-9 23-117 50-240 28-123 50-230 50-237 0-22-2126-13-2465 10-132 10-400 28-595 42-661 47-824 55-1160 62-435 7-656-8-1040-73-415-70-865-183-1447-365-168-53-272-556-325-1569-16-319-16-1311 0-1630 45-872 129-1366 257-1518 22-26 51-39 172-77 557-177 1122-310 1563-369 271-36 351-40 690-40 361 1 463 6 1165 54 1122 78 1288 83 2337 79 460-2 840-7 843-11 4-4-17-117-47-252l-55-245 39-16c76-30 180-8 224 47 10 13 54 124 98 246l79 222 709 0 709 0 47-24c74-37 219-83 322-101 122-22 606-32 802-16 374 29 658 102 933 238 124 62 271 155 361 230l61 51 6 100c19 278 103 497 247 643 88 89 173 136 278 152l70 11 41 131c116 369 159 673 168 1170 10 584-38 984-167 1397l-40 126-70 12c-193 33-348 175-441 405-56 139-89 302-89 445 0 43-3 47-58 91-290 235-644 384-1068 450-191 29-796 39-974 16-135-18-263-54-368-102l-75-35-701 0-701 0-79 223c-82 232-102 267-163 293-38 16-138 17-170 2zm-2023-820c332-15 1155-12 1835 6 308 8 563 12 566 8 4-4 10-21 13-38 7-30 6-31-92-77-518-244-1197-396-2112-474-295-25-1282-25-1579 0-231 20-473 46-479 51-6 7 49 110 93 171 160 226 416 335 855 365 142 10 539 5 900-12zm3304-263c525-111 899-887 934-1935 19-557-37-1023-172-1435-186-563-521-900-896-899-81 0-158 14-525 92-426 91-431 92-540 146-195 96-287 207-306 368-12 104-11 2985 1 3078 22 170 135 291 365 389 49 21 191 55 480 115 226 47 419 87 430 89 45 10 164 6 229-8zm-5570-485c112-43 197-156 216-291 12-83 13-2623 1-2706-23-158-125-273-270-304-44-9-100-1-542 75-272 47-514 91-539 98-266 68-487 424-594 958-56 280-70 548-40 800 56 484 207 878 414 1081 115 114 122 116 702 218 277 49 524 90 550 90 26 1 72-8 102-19zm2111-3440c1023-44 1884-213 2462-486l113-53-7-33c-3-18-8-35-10-37-2-3-236 1-521 7-993 24-1271 26-1708 11-541-18-1128-18-1249-1-377 56-588 181-734 437-32 55-41 79-32 84 12 8 246 32 491 51 356 28 815 36 1195 20z"/></g><text x="3250" y="8250" style="font-size:3000px;fill:#fff;text-anchor:middle">{text}</text></svg>',
            /**********************
             * Fill Patterns
             **********************/
            "checker": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(16 * {scale})" height="calc(16 * {scale})" viewBox="0 0 16 16"><pattern id="p" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse"><rect fill="{color}" x="0" width="8" height="8" y="0"/><rect fill="{color}" x="8" width="8" height="8" y="8"/></pattern><rect x="0" y="0" width="16" height="16" fill="{secondaryColor}"/><rect x="0" y="0" width="16" height="16" fill="url(#p)"/></svg>',
            "checker-rotated": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(16 * {scale})" height="calc(16 * {scale})" viewBox="0 0 60 60"><rect width="60" height="60" fill="{secondaryColor}"/><rect width="42.42" height="42.42" transform="translate(30 0) rotate(45)" fill="{color}"/></svg>',
            "zig-zag": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(15 * {scale})" height="calc(15 * {scale})" viewBox="0 0 120 120"><rect x="0" y="0" width="120" height="120" fill="{secondaryColor}"/><polygon fill="{color}" points="120 120 60 120 90 90 120 60 120 0 120 0 60 60 0 0 0 60 30 90 60 120 120 120"/></svg>',
            "zig-zag-vertical": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(15 * {scale})" height="calc(15 * {scale})" viewBox="0 0 120 120"><rect x="0" y="0" width="120" height="120" fill="{secondaryColor}"/><polygon fill="{color}" points="120 0 120 60 90 30 60 0 0 0 0 0 60 60 0 120 60 120 90 90 120 60 120 0"/></svg>',
            "circles-spaced": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(20 * {scale})" height="calc(20 * {scale})" viewBox="0 0 20 20"><defs><pattern id="p" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="2" stroke="none" fill="{color}"/></pattern></defs><rect x="0" y="0" width="20" height="20" fill="{secondaryColor}"/><rect x="0" y="0" width="100" height="100" fill="url(#p)"/></svg>',
            "circles": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(7 * {scale})" height="calc(7 * {scale})" viewBox="0 0 20 20"><defs><pattern id="p" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="6" stroke="none" fill="{color}"/></pattern></defs><rect x="0" y="0" width="20" height="20" fill="{secondaryColor}"/><rect x="0" y="0" width="100" height="100" fill="url(#p)"/></svg>',
            "diagonal-lines-up": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(18 * {scale})" height="calc(18 * {scale})" viewBox="0 0 6 6"><rect x="0" y="0" width="6" height="6" fill="{secondaryColor}"/><g fill="{color}"><path d="M5 0h1L0 6V5zM6 5v1H5z"/></g></svg>',
            "diagonal-lines-down": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(18 * {scale})" height="calc(18 * {scale})" viewBox="0 0 6 6"><rect x="0" y="0" width="6" height="6" fill="{secondaryColor}"/><g transform="rotate(90 3 3)" fill="{color}"><path d="M5 0h1L0 6V5zM6 5v1H5z"/></g></svg>',
            "diagonal-stripes-up": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(20 * {scale})" height="calc(20 * {scale})" viewBox="0 0 40 40"><rect x="0" y="0" width="40" height="40" fill="{secondaryColor}"/><g fill="{color}"><path d="M0 40L40 0H20L0 20M40 40V20L20 40"/></g></svg>',
            "diagonal-stripes-down": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(20 * {scale})" height="calc(20 * {scale})" viewBox="0 0 40 40"><rect x="0" y="0" width="40" height="40" fill="{secondaryColor}"/><g transform="rotate(90 20 20)" fill="{color}"><path d="M0 40L40 0H20L0 20M40 40V20L20 40"/></g></svg>',
            "grid-lines": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(14 * {scale})" height="calc(14 * {scale})" viewBox="0 0 6 6"><rect x="0" y="0" width="6" height="6" fill="{secondaryColor}"/><g transform="rotate(45 3 3)" fill="{color}"><path d="M5 0h1L0 6V5zM6 5v1H5z"/></g><g fill="{color}" transform="rotate(-45 3 3)"><path d="M5 0h1L0 6V5zM6 5v1H5z"/></g></svg>',
            "rotated-grid-lines": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(18 * {scale})" height="calc(18 * {scale})" viewBox="0 0 6 6"><rect x="0" y="0" width="6" height="6" fill="{secondaryColor}"/><g transform="rotate(90 3 3)" fill="{color}"><path d="M5 0h1L0 6V5zM6 5v1H5z"/></g><g fill="{color}"><path d="M5 0h1L0 6V5zM6 5v1H5z"/></g></svg>',
            "rotated-grid-stripes": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(20 * {scale})" height="calc(20 * {scale})" viewBox="0 0 40 40"><rect x="0" y="0" width="40" height="40" fill="{secondaryColor}"/><g transform="rotate(90 20 20)" fill="{color}"><path d="M0 40L40 0H20L0 20M40 40V20L20 40"/></g><g fill="{color}"><path d="M0 40L40 0H20L0 20M40 40V20L20 40"/></g></svg>',
            "x-fill": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(40 * {scale})" height="calc(40 * {scale})" viewBox="0 0 40 40"><rect x="0" y="0" width="45.3" height="45.3" fill="{secondaryColor}"/><g fill="{color}"><path d="M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z"/></g></svg>',
            "dots": '<svg xmlns="http://www.w3.org/2000/svg" width="calc(13 * {scale})" height="calc(13 * {scale})" viewBox="0 0 20 20"><rect x="0" y="0" width="20" height="20" fill="{secondaryColor}"/><g fill="{color}"><circle cx="3" cy="3" r="3"/><circle cx="13" cy="13" r="3"/></g></svg>'
        };
        return SvgTemplateManager;
    }());

    /**
     * A class that manages the lifecycle of SVG's for a map instance.
     */
    var SvgManager = /** @class */ (function () {
        /************************
         * Constructor
         ***********************/
        /**
         * A class that manages the lifecycle of SVG's for a map instance.
         * @param map A maplibre-gl-js map instance.
         */
        function SvgManager(map) {
            //A list of all the image ids tand image source data.
            this._images = {};
            this._map = map;
        }
        /************************
         * Public functions
         ***********************/
        /**
         * Adds an SVG image to the maps image sprite.
         * @param id A unique ID to reference the image by. Use this to render this image in your layers. If the specified id matches the ID of a previously added image the new image will be ignored.
         * @param svg An inline SVG string, or URL to an SVG image.
         */
        SvgManager.prototype.add = function (id, svg, maxWidth, maxHeight) {
            var _this = this;
            if (maxWidth === void 0) { maxWidth = 100; }
            if (maxHeight === void 0) { maxHeight = 100; }
            return new Promise(function (resolve, reject) {
                var images = _this._images;
                var map = _this._map;
                // Take no action if the new image uses the id of a previously added image.
                if (images[id]) {
                    resolve();
                    return;
                }
                if (typeof svg === "string") {
                    var imageSrc_1;
                    // Assume an inline svg image string if icon doesn't start with "data:", but does include "<svg"
                    if (/<svg/i.test(svg) && !(/^data:/i.test(svg))) {
                        imageSrc_1 = "data:image/svg+xml;base64," + window.btoa(svg);
                    }
                    else {
                        imageSrc_1 = svg;
                    }
                    var request = {
                        url: imageSrc_1
                    };
                    //TODO: In the future consider using map.loadImage so that it goes through the request transform and image throttling. 
                    //Current not doing this as there is a breaking change in loadImage in version 4.0.0 of maplibre-gl-js (callbacks changed to promises). 
                    if (map._requestManager._transformRequestFn) {
                        request = map._requestManager.transformRequest(imageSrc_1, 'Image');
                    }
                    fetch(request.url, request).then(function (response) {
                        return response.blob();
                    }).then(function (blob) {
                        var imageElm = new Image();
                        // Wait for the blob to load into the element.
                        imageElm.onload = function () {
                            if (maxWidth > 0 || maxHeight > 0) {
                                var scale = Math.min(maxWidth / imageElm.width, maxHeight / imageElm.height);
                                imageElm.width = imageElm.width * scale;
                                imageElm.height = imageElm.height * scale;
                            }
                            map.addImage(id, imageElm);
                            images[id] = imageSrc_1;
                            resolve();
                        };
                        // Reject if the blob failed to load in the element.
                        imageElm.onerror = imageElm.onabort = function () {
                            reject("Failed to load \"".concat(id, "\" image."));
                        };
                        // Convert the blob to a data url then load it into an Image element.
                        imageElm.src = URL.createObjectURL(blob);
                    }).catch(function () {
                        reject("Failed to load \"".concat(id, "\" image."));
                    });
                }
            });
        };
        /**
         * Removes all SVG images loaded into the maps sprite.
         */
        SvgManager.prototype.clear = function () {
            var self = this;
            Object.keys(self._images).forEach(function (id) {
                self._map.removeImage(id);
            });
            // Clear the list of user added image ids.
            self._images = {};
        };
        /**
         * Gets a list of all the image ids that have been added to the maps image sprite.
         */
        SvgManager.prototype.getImageIds = function () {
            return Object.keys(this._images);
        };
        /**
         * Checks to see if an image is already loaded into the maps image sprite.
         * @param id The id to check the map's image sprite for.
         */
        SvgManager.prototype.hasImage = function (id) {
            return this._images[id] ? true : false;
        };
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
        SvgManager.prototype.createFromTemplate = function (id, templateName, color, secondaryColor, scale, text) {
            if (color === void 0) { color = '#1A73AA'; }
            if (secondaryColor === void 0) { secondaryColor = 'white'; }
            if (scale === void 0) { scale = 1; }
            if (text === void 0) { text = ''; }
            var html = SvgTemplateManager._applyStyle(templateName, text, color, secondaryColor, scale);
            return this.add(id, html);
        };
        /**
         * Removes an SVG image from the maps image sprite.
         * @param id The ID of the image to remove from the maps image sprite.
         */
        SvgManager.prototype.remove = function (id) {
            this._map.removeImage(id);
            delete this._images[id];
        };
        /**
         * It's possible that the map's image sprite may be cleared by the user outside of this manager.
         * Calling this method will reload all images in this manager.
         */
        SvgManager.prototype.reload = function () {
            var _this = this;
            var self = this;
            Object.keys(self._images).forEach(function (id) {
                //Verify map doesn't already have the image in the sprite.
                if (!self._map.hasImage(id)) {
                    //Load the image source into an image element.
                    var imageElm_1 = new Image();
                    imageElm_1.onload = function () {
                        //Add the image to the map's image sprite.
                        self._map.addImage(id, imageElm_1);
                    };
                    imageElm_1.src = _this._images[id];
                }
            });
        };
        return SvgManager;
    }());

    exports.SvgManager = SvgManager;
    exports.SvgTemplateManager = SvgTemplateManager;

}(this.maplibregl = this.maplibregl || {}));
