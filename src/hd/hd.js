/**
 * HD-keret loader
 *
 * @description HD-keret modulok behúzása szerver-oldalra
 * @requires -
 * @example
 *  const HD = require('<path>/hd.js')(['utility', 'math', 'datetime.timer']);
 *  const timer = HD.DateTime.Timer(-1), id = HD.Number.getUniqueId();
 */

if (typeof module !== 'undefined' && module.exports){
    /**
     * HD-keret moduljainak behúzása
     * @param {Array} modules - modulok fájljainak listája hd.<module>.js alakban
     * @return {Object} HD névtér
     */
    module.exports = function(modules){
        const loaded = {};
        modules.forEach(item => {
            Object.assign(loaded, require(`./hd.${item}.js`));
        });
        return loaded;
    };
}
