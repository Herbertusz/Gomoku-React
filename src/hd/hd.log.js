/**
 * HD-keret Log
 *
 * @description Kliens-oldalról érkező hibák logolása
 * @requires HD.DOM
 */

import DOM from './hd.dom';

/**
 * Kliens oldali logolás
 * @type {Object}
 */
const Log = {

    /**
     * Hiba fájlba írása
     * @param {Error} data
     */
    error : function(data){
        const errorName = encodeURIComponent(data.name);
        const errorMessage = encodeURIComponent(data.message);
        const errorStack = encodeURIComponent(data.stack);

        DOM.ajax({
            method : 'POST',
            url : '/chat/clientlog',
            data : `type=error&name=${errorName}&message=${errorMessage}&stack=${errorStack}`
        });
    },

    /**
     * Nem hiba jellegű log fájlba írása
     * @param {String} message
     */
    info : function(message){
        DOM.ajax({
            method : 'POST',
            url : '/chat/clientlog',
            data : `type=info&message=${message}`
        });
    }

};

export default Log;
