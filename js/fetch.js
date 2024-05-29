(function(global) {
    //#region [ Fields ]

    const uri = "https://api.github.com/repos/xxxmatko/demo/contents";
    const token = "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";
    const apiVersion = "2022-11-28";

    //#endregion


    //#region [ Methods : Public ]
    
    /**
     * Fetches the raw content.
     * 
     * @param {string} url Url of the resource. 
     */
    function fetchRaw(url) {
        return fetch(`${uri}${url}`, {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/vnd.github.raw",
                "X-GitHub-Api-Version": `${apiVersion}`,
                "Authorization": `Bearer ${token}`
            }
        });
    };


    /**
     * Fetches the markdown content.
     * 
     * @param {string} url Url of the resource. 
     */
    function fetchMarkdown(url) {
        return fetch(`${uri}${url}`, {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/vnd.github.html",
                "X-GitHub-Api-Version": `${apiVersion}`,
                "Authorization": `Bearer ${token}`
            }
        });
    };
    
    //#endregion

    global.fetchRaw = fetchRaw;
    global.fetchMarkdown = fetchMarkdown;
})((function(){ return this; })());