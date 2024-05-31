(function(global) {
    //#region [ Fields ]

    const ko = global.ko;

    //#endregion

    
    //#region [ Constructor ]

    /**
     * Creates instance of the block component.
     * 
     * @param {object} args Arguments. 
     */
    let Block = function(args = {}) {
        this.id = (args.id || "").toLowerCase();
        this.isIndex = this.id.endsWith("-index");
        this.name = `${this.id.replace(/-index$/, "").replace(/\w+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).replace(/-/gi,"")}Block`;
        
        this.classes = ko.isObservableArray(args.classes) ? args.classes : ko.observableArray(args.classes || []);
        this.content = ko.isObservable(args.content) ? args.content : ko.observable(args.content || "");
        
        this.classes.push(this.name.toLowerCase().replace(/block$/, ""));
        
        this.load();

        console.debug(`${this.name}()`);
    };

    //#endregion


    //#region [ Methods : Public ]

    /**
     * Direct method to receive a descendantsComplete notification.
     * Knockout will call it with the component’s node once all descendants are bound.
     * 
     * @param {element} node Html element. 
     */
    Block.prototype.koDescendantsComplete = function (node) {
        node.replaceWith(node.firstElementChild);
        //this.mdcComponent = new mdc.ripple.MDCRipple(root);
    };


    /**
     * Loads content.
     */
    Block.prototype.load = function() {
        if (this.isIndex) {
            let url = `./content/${this.id.replace(/-/gi,"/")}.md`;
            global.app
                .fetch(url)
                .then((response) => response.ok ? response.text() : "")
                .then((yaml) => {
                    let children = global.frontmatter(yaml).attributes.children;
                    let xhrs = children.map((c) => {
                        let u = `./content/${this.id.replace(/index$/, c).replace(/-/gi,"/")}.md`
                        return global.app
                            .fetch(u, global.App.FETCH_CONTENT_TYPE.html)
                            .then((response) => response.ok ? response.text() : `${c.toUpperCase()} : TODO`);
                    })

                    Promise.all(xhrs)
                        .then((response) => {
                            let content = {};
                            children.forEach((c, i) => content[c] = response[i]);
                            this.content(content);
                        });
                })
            return;
        }

        let url = `./content/${this.id.replace(/-/gi,"/")}/${this.id.split("-").pop()}.md`;

        global.app
            .fetch(url, global.App.FETCH_CONTENT_TYPE.html)
            .then((response) => response.ok ? response.text() : `${this.id.toUpperCase()} : TODO`)
            .then(this.content);
    };


    /**
     * Dispose.
     */
    Block.prototype.dispose = function () {
        console.debug(`~${this.name}()`);
        //this.mdcComponent.destroy();
    };

    //#endregion


    //#region [ Methods : Static ]

    /**
     * Factory method.
     *
     * @param {object} params Parameters.
     * @param {object} componentInfo Component into.
     * @returns {object} Instance of the model.
     */
    Block.createViewModel = function (params, componentInfo) {
        params = params || {};
        params.element = componentInfo.element.querySelector ? componentInfo.element : componentInfo.element.parentElement || componentInfo.element.parentNode;

        return new Block(params);
    };

    //#endregion


    //#region [ Registration ]

    ko.components.register("app-block", {
        viewModel: { 
            createViewModel: Block.createViewModel 
        },
        template: 
            `<div class="block" data-bind="class: classes().join(' '), template: { nodes: $componentTemplateNodes, data: $data }"></div>`
    });

    //#endregion
})((function(){ return this; })());