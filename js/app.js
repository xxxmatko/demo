(function(global) {
    //#region [ Fields ]

    const doc = global.document;
    const mdc = global.mdc;
    const ko = global.ko;
    const moment = global.moment;
    const token = ["E","J","g","V","T","3","4","T","4","w","r","7","L","4","E","A","d","f","4","I","D","j","d","l","a","a","J","L","A","5","D","8","S","u","0","B","_","p","h","g"].toReversed().join("");
    const apiUrl = "https://api.github.com/repos/xxxmatko/demo/contents";
    const apiVersion = "2022-11-28";

    //#endregion


    //#region [ Constructors ]

    /**
     * Creates new instance of the Application.
     */
    let App = function (args) {
        console.debug("App()");
    };

    //#endregion


    //#region [ Methods : Public ]

    /**
     * Fetch the resource.
     * 
     * @param {string} url Url to fetch. 
     * @param {string} accept Accepted content type. 
     */
    App.prototype.fetch = function(url, accept = App.FETCH_CONTENT_TYPE.raw, method = "GET") {
        url = url.startsWith(".") ? url.substring(1) : url;

        return fetch(`${apiUrl}${url}`, {
            method: method,
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "Accept": accept,
                "X-GitHub-Api-Version": `${apiVersion}`,
                "Authorization": `Bearer ${token}`
            }
        });
    };

    //#endregion


    //#region [ Event Handlers ]
    //#endregion


    //#region [ Enums ]

    /**
     * Button types.
     */
    App.FETCH_CONTENT_TYPE = {
        raw: "application/vnd.github.raw",
        html: "application/vnd.github.html"
    };

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

        global.App = App;
        let app = global.app = new App({});
        ko.applyBindings(app, doc.body);
    });

    //#endregion    
})((function(){ return this; })());