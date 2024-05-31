(function(global) {
    //#region [ Fields ]

    const parser = global.jsyaml;
    const optionalByteOrderMark = "\\ufeff?";
    const platform = typeof (process) !== "undefined" ? process.platform : "";
    const pattern = '^(' +
                    optionalByteOrderMark +
                    '(= yaml =|---)' +
                    '$([\\s\\S]*?)' +
                    '^(?:\\2|\\.\\.\\.)\\s*' +
                    '$' +
                    (platform === 'win32' ? '\\r?' : '') +
                    '(?:\\n)?)';
    const regex = new RegExp(pattern, "m");

    //#endregion


    //#region [ Methods : Public ]

    /**
     * 
     * @param {string} string 
     * @param {object} options 
     * @returns 
     */
    function extractor(string, options) {
        let defaultOptions = { 
            allowUnsafe: false 
        };

        string = string || "";
        options = options instanceof Object ? { ...defaultOptions, ...options } : defaultOptions;
        options.allowUnsafe = Boolean(options.allowUnsafe);

        let lines = string.split(/(\r?\n)/);

        if (lines[0] && /= yaml =|---/.test(lines[0])) {
            return _parse(string, options.allowUnsafe);
        } 
        
        return {
            attributes: {},
            body: string,
            bodyBegin: 1
        };
    };

    //#endregion


    //#region [ Methods : Private ]

    /**
     * 
     * @param {object} match 
     * @param {string} body 
     * @returns 
     */
    function _computeLocation(match, body) {
        let line = 1;
        let pos = body.indexOf("\n");
        let offset = match.index + match[0].length;

        while (pos !== -1) {
            if (pos >= offset) {
                return line
            }
    
            line++;
            pos = body.indexOf("\n", pos + 1);
        }

        return line;
    };


    /**
     * 
     * @param {string} string 
     * @param {boolean} allowUnsafe 
     * @returns 
     */
    function _parse(string, allowUnsafe) {
        let match = regex.exec(string);
     
        if (!match) {
            return {
                attributes: {},
                body: string,
                bodyBegin: 1
            };
        };

        let loader = allowUnsafe ? parser.load : parser.safeLoad;
        let yaml = match[match.length - 1].replace(/^\s+|\s+$/g, '');
        let attributes = loader(yaml) || {};
        let body = string.replace(match[0], '');
        let line = _computeLocation(match, string);

        return {
            attributes: attributes,
            body: body,
            bodyBegin: line,
            frontmatter: yaml
        };
    };

    //#endregion


    //#region [ Registration ]

    global.frontmatter = extractor;

    //#endregion
})((function(){ return this; })());