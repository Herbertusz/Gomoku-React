/**
 * HD-keret Timer
 *
 * @description Idő alapú számláló
 * @requires hd/DateTime
 * @example
 *  Óra:
 *   const clock = new Timer(1);
 *   clock
 *       .set(Math.round(Date.now() / 1000))
 *       .start(function(){
 *           elementDisplay.innerHTML = clock.get('hh:mm:ss');
 *       });
 *  // ----------------------------------------------------------------
 *  Visszaszámláló:
 *   const countDown = new Timer(-1);
 *   countDown.set('35:20:00:00'); // Fixen 35 nap 20 óra; az alábbi egy életszerűbb példa:
 *   // countDown.set(Math.round((Date.parse('1 Jan 2018 00:00:00 GMT') - Date.now()) / 1000));
 *   countDown
 *       .start(function(){
 *           elementDisplay.innerHTML = countDown.get('D nap, hh:mm:ss');
 *       })
 *       .reach(0, function(){
 *           countDown.stop();
 *       });
 *  // ----------------------------------------------------------------
 *  Stopper (tizedmásodperc pontosságú):
 *   const stopWatch = new Timer(0.1);
 *   elementStart.addEventListener('click', function(){
 *       stopWatch.start(function(){
 *           elementDisplay.innerHTML = stopWatch.get('mm:ss.') + Math.round(stopWatch.get() * 10) % 10;
 *       });
 *   });
 *   elementPause.addEventListener('click', function(){
 *       stopWatch.pause();
 *   });
 *   elementStop.addEventListener('click', function(){
 *       stopWatch.stop();
 *       elementDisplay.innerHTML = '00:00.0';
 *   });
 */

import DateTime from './hd.datetime';

/**
 * Időmérő objektum (Module minta)
 * @param {Number} add - lépegetés (pl: stoppernél 1, visszaszámlálónál -1)
 * @param {Number} [stepInterval=null] - lépések között eltelt idő (ms)
 * @return {Object} timer felület
 */
const Timer = function(add, stepInterval = null){

    /**
     * Eltelt időegység (másodpercben)
     * @type {Number}
     * @private
     */
    let T = 0;

    /**
     * Timeout ID
     * @type {Object}
     * @private
     */
    let timerID = null;

    /**
     * Időmérő állapota
     * @type {Boolean}
     * @private
     */
    let run = false;

    /**
     * Eseménykezelők
     * @type {Array}
     * @description
     *  events = [
     *      {
     *          value : Number,     // érték
     *          handler : Function, // eseménykezelő
     *          context : Object    // this = Timer
     *      }
     *  ]
     */
    const events = [];

    /**
     * Léptetés
     */
    const step = function(){
        T += add;
        events.forEach(event => {
            if (T === event.value){
                event.handler.call(event.context);
            }
        });
    };

    /**
     * Bevitt idő beolvasása
     * @param {String} str - időt leíró string (formátum: 'D:hh:mm:ss'|'hh:mm:ss'|'mm:ss'|'ss')
     * @return {Number} időegység értéke
     */
    const parse = function(str){
        return DateTime.parseTime(str, 's', 's');
    };

    /**
     * Idő kiírása olvasható formában
     * @param {Number} num - időegység értéke
     * @param {String} format - formátum (makrók: h, m, s, D, H, M, S, hh, mm, ss)
     * @return {String} kiírható string
     */
    const print = function(num, format){
        return DateTime.printTime(num, 's', format);
    };

    const Interface = {

        /**
         * Beállítás
         * @param {Number|String} value - kezdőérték
         * @return {Object} Timer objektum
         */
        set : function(value){
            if (typeof value === 'string'){
                T = parse(value);
            }
            else {
                T = value;
            }
            return this;
        },

        /**
         * Aktuális idő
         * @param {String} [format] - formátum
         * @return {Number|String} aktuális idő
         */
        get : function(format){
            if (typeof format === 'undefined'){
                return T;
            }
            else {
                return print(T, format);
            }
        },

        /**
         * Időmérés indítása
         * @param {Function} callback - minden lépés után meghívott függvény
         * @return {Object} Timer objektum
         */
        start : function(callback){
            if (!run){
                callback.call(this, this);
                timerID = setInterval(() => {
                    step();
                    callback.call(this, this);
                }, stepInterval);
                run = true;
            }
            return this;
        },

        /**
         * Időmérés szüneteltetése
         * @return {Object} Timer objektum
         */
        pause : function(){
            if (run){
                clearInterval(timerID);
                run = false;
            }
            return this;
        },

        /**
         * Időmérés leállítása
         * @return {Object} Timer objektum
         */
        stop : function(){
            if (run){
                clearInterval(timerID);
                run = false;
            }
            T = 0;
            return this;
        },

        /**
         * Eseménykezelő csatolása
         * @param {Number|String} value - időpont
         * @param {Function} callback - eseménykezelő
         * @return {Object} Timer objektum
         */
        reach : function(value, callback){
            if (typeof value === 'string'){
                value = parse(value);
            }
            events.push({
                value : value,
                handler : callback,
                context : this
            });
            return this;
        },

        /**
         * Időmérő fut vagy meg van állítva
         * @return {Boolean} true: fut
         */
        running : function(){
            return run;
        }

    };

    if (stepInterval === null){
        stepInterval = 1000 * add;
    }

    return Interface;

};

export default Timer;
