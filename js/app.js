(function(global) {
    //#region [ Fields ]

    var doc = global.document;
    var mdc = global.mdc;
    var ko = global.ko;
    var moment = global.moment;

    //#endregion


    //#region [ Constructors ]

    /**
     * Creates new instance of the Application.
     */
    var App = function (args) {
        console.debug("App()");
    };

    //#endregion


    //#region [ Methods : Public ]
    //#endregion


    //#region [ Event Handlers ]
    //#endregion


    //#region [ Methods ]

    /**
     * Fires function when DOM is ready.
     *
     * @param {function} fn Function.
     */
    function ready(fn) {
        if (doc.attachEvent ? (doc.readyState === "complete") : (doc.readyState !== "loading")) {
            fn();
        }
        else {
            doc.addEventListener("DOMContentLoaded", fn);
        }
    };

    //#endregion


    //#region [ Start ]

    /**
     * Starts the web.
     */
    ready(function () {
        mdc.autoInit();
        moment.locale("sk");

        var app = global.app = new App({});
        ko.applyBindings(app, doc.body);
    });

    //#endregion    
})((function(){ return this; })());