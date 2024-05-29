(function (root, factory) {
    if (typeof(define) === "function" && define.amd) {
        define("loader", ["knockout"], factory);
    } 
    else {
        factory(root.ko);
    }
}(typeof(self) !== "undefined" ? self : this, function (ko) {
    //#region [ Fields ]
    
    let global = (function() { return this; })();

    //#endregion
    
    
    //#region [ Constructors ]
    
    /**
     * Constructor.
     * 
     * @param {object} args Arguments.
     */
    let Loader = function (args = {}) {
        console.debug("Loader()");
    };

    //#endregion


    //#region [ Methods : Public ]

    /**
     * 
     * @param {string} name 
     * @param {function} callback 
     */
    Loader.prototype.getConfig = function(name, callback) {
        callback({
            template: {
                html: `./content/${name}/_template.html`,
                css: `./content/${name}/_style.css`
            },
            viewModel: {
                js: `./content/${name}/_viewmodel.js`,
                md: `./content/${name}/${name}.md`
            }
        });
    };


    /**
     * Use custom logic to supply DOM nodes for a given template configuration.
     * 
     * @param {string} name Component name.
     * @param {string} config The template property from any componentConfig object.
     * @param {function} callback To supply an array of DOM nodes, call callback(domNodeArray).
     */ 
    Loader.prototype.loadTemplate = function (name, config, callback) {
        let missingTemplate = 
        `<div class="mdc-layout-grid ${name}">
            <div class="mdc-layout-grid__inner container">
                <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12" data-bind="html: content"></div>
            </div>
         </div>`;

        Promise.all([
            fetch(config.html).then((response) => response.ok ? response.text() : ""),
            fetch(config.css).then((response) => response.ok ? response.text() : "")
        ]).then((response) => {
            let html = response[0]; 
            let css = response[1]; 

            // We can use the default loader to convert to the required format
            ko.components.defaultLoader.loadTemplate(name, html || missingTemplate, callback);

            // Append styles
            if (!global.document.head.querySelectorAll(`style[id=${name}-style]`).length && css) {
                var el = global.document.createElement("style");
                el.setAttribute("id", `${name}-style`);
                el.innerHTML = css;
                global.document.head.appendChild(el);
            }
        })
        .catch(() => ko.components.defaultLoader.loadTemplate(name, `<span style="color:red">${name.toUpperCase()} : ERROR</span>`, callback));
    };


    /**
     * Use custom logic to supply a viewmodel factory.
     * 
     * @param {string} name Component name.
     * @param {object} config Configuration.
     * @param {function} callback Callback.
     */
    Loader.prototype.loadViewModel = function(name, config, callback) {
        Promise.all([
            fetch(config.js).then((response) => response.ok ? response.text() : ""),
            fetch(config.md).then((response) => response.ok ? response.text() : `${name.toUpperCase()} : TODO`)
        ]).then((response) => {
            let script = response[0]; 
            let content = response[1]; 

            let lambda = Function("params", "componentInfo", 
                `params = params || {};
                 params.name = "${name.replace(/\w+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase())}";
                 params.content = "${content}";
                 params.element = componentInfo.element.querySelector ? componentInfo.element : componentInfo.element.parentElement || componentInfo.element.parentNode;
                
                 ${script || "let Model = function (args = {}) { this.content = args.content; };"}

                 Model.prototype.koDescendantsComplete = function (node) {
                     node.replaceWith(node.firstElementChild);
                 };

                 return new Model(params);`);
            callback(lambda);
        });
    };

    //#endregion


    //#region [ Registration ]

    ko.components.loaders.unshift(new Loader());


    /**
     * We want to have different custom element tag names.
     * 
     * @param {HTMLElement} node HTML element. 
     * @returns null or component name.
     */
    ko.components.getComponentNameForNode = function(node) {
        var tagName = node.tagName && node.tagName.toLowerCase();
     
        // If the element's name exactly matches a preregistered component, use that component
        if (ko.components.isRegistered(tagName)) {
            return tagName;
        } 

        // For the element <ko-...> use the custom component
        if (tagName.startsWith("ko-")) {
            return tagName.substring(3);
        }

        // Treat anything else as not representing a component
        return null;
    }

    //#endregion
}));