import Util from '../../hd/hd.utility';
import Maths from '../../hd/hd.math';

/**
 * A játék konstansainak adattárolója
 * @type {Object}
 */
const Game = {

    /**
     * Canvas elem
     * @type {HTMLCanvasElement}
     */
    element : null,

    /**
     * Grafikai beállítások
     * @type {Object}
     */
    graphics : {

        /**
         * Rácsvonalak színe
         * @type {String}
         */
        lineColor : null,

        /**
         * Rácsvonalak vastagsága
         * @type {Number}
         */
        lineWidth : null,

        /**
         * Egy szín világosabb változata
         * @param {String} color - hsla érték
         * @return {String} világosabb hsla érték
         * @todo megírni rendesen
         */
        lightColor : function(color){
            // const hsla = /hsla\((\d+),\s*(\d+)%,\s*(\d+)%,\s*([0-9.]+)\)/.exec(color);
            // if (hsla){
            //     const lightness = Math.min(Number(hsla[3]) + 40, 100);
            //     return `hsla(${hsla[1]}, ${hsla[2]}%, ${lightness}%, ${hsla[4]})`;
            // }
            // else {
            //     return null;
            // }
            return Util.Misc.switching(color, {
                'rgba(255, 0, 0, 1)' : 'rgba(255, 200, 200, 1)',
                'rgba(0, 150, 0, 1)' : 'rgba(150, 255, 150, 1)',
                'rgba(0, 0, 255, 1)' : 'rgba(200, 200, 255, 1)'
            });
        }

    },

    /**
     * Méretek
     * @type {Object}
     */
    sizes : {

        /**
         * Canvas méretei
         * @type {Object}
         * @description szerkezet: {
         *     w : Number,  // canvas szélessége
         *     h : Number   // canvas magassága
         * }
         */
        canvas : null,

        /**
         * Pálya mérete {x : 3 - 20, y : 3 - 30}
         * @type {Object}
         * @description szerkezet: {
         *     x : Number,  // grid oszlopainak száma
         *     y : Number   // grid sorainak száma
         * }
         */
        grid : null,

        /**
         * Pálya helyzete a canvas-on belül (element és sizes.grid alapján)
         * @type {Object}
         * @description szerkezet: {
         *     x : Number,
         *     y : Number,
         *     w : Number,
         *     h : Number
         * }
         */
        level : null

    },

    /**
     * Játékmenet adatai
     * @type {Object}
     */
    play : {

        /**
         * Nyeréshez szükséges sor (>= 3)
         * @type {Number}
         */
        connectNum : null,

        /**
         * Jelenlegi játékszakasz ('init'|'play'|'end')
         * @type {String}
         */
        gameSection : null,

        /**
         * Jelenlegi játékos azonosítója
         * @type {Number}
         */
        currentPlayerID : null,

        /**
         * Játék győztese
         * @type {Object}
         * @description szerkezet: {
         *     playerID : Number,        // játékos azonosító
         *     sequence : Array(Number)  // kirakott sor (fieldID lista)
         * }
         */
        winner : {
            playerID : null,
            sequence : []
        }

    },

    /**
     * Játékosok adatai
     * @type {Array}
     * @description szerkezet: [
     *     {
     *         strategy : String,    // algoritmus ('human': nem gép)
     *         name : String,        // név
     *         stone : Number,       // Kő azonosítója (0|1|2)
     *         isFirst : Boolean,    // kezdő játékos
     *         stoneColor : String,  // kő színe
     *         winColor : String     // kirakott sor háttérszíne
     *         time : Number,        // aktuális lépésidő
     *         status : String       // állapot ('init'|'play'|'wait'|'end')
     *     },
     *     ...
     * ]
     */
    players : null,

    /**
     * Pálya pillanatnyi állapota
     * @type {Array}
     * @description szerkezet: [
     *     <fieldID> => {               // (field objektum)
     *         id : Number,             // mező azonosító
     *         row : Number,            // oszlop azonosító
     *         col : Number,            // sor azonosító
     *         playerID : null|Number,  // játékos azonosító
     *         x : Number,              // mező bal felső sarkának x koordinátája
     *         y : Number,              // mező bal felső sarkának y koordinátája
     *         w : Number,              // mező szélessége
     *         h : Number               // mező magassága
     *     },
     *     ...
     * ]
     */
    grid : null,

    /**
     * Adattároló feltöltése
     * @param {HTMLCanvasElement} canvas - ?
     * @param {Object} props - ?
     */
    init : function(canvas, props){
        Game.element = canvas;
        Game.play.connectNum = props.options.connectNum;

        // játékosok
        Game.players = Util.Array.fromNum(props.options.playerNum).map(id => {
            return {
                strategy   : props.options.playerAIs[id],
                name       : props.options.playerNames[id],
                stone      : props.options.playerStones[id],
                isFirst    : props.options.firstPlayerID === id,
                stoneColor : props.options.stoneColors[id],
                winColor   : Game.graphics.lightColor(props.options.stoneColors[id]),
                time       : null,
                status     : null
            };
        });

        // grafika és méretek
        Game.graphics.lineColor = props.options.lineColor;
        Game.graphics.lineWidth = props.options.lineWidth;
        Game.sizes.canvas = {
            w : props.width,
            h : props.height
        };
        Game.sizes.grid = {
            x : props.options.gridSize_x,
            y : props.options.gridSize_y
        };
        Game.sizes.connectNum = props.options.connectNum;

        Game.sizes.level = {};
        Game.sizes.level.h = Number(Game.sizes.canvas.h);
        Game.sizes.level.w = Math.round(Game.sizes.level.h * (Game.sizes.grid.x / Game.sizes.grid.y));
        Game.sizes.level.x = (Game.sizes.canvas.w - Game.sizes.level.w) / 2;
        Game.sizes.level.y = 0;

        const relativeCoords = [];
        Util.Array.fromNum(Game.sizes.grid.y).forEach(y => {
            Util.Array.fromNum(Game.sizes.grid.x).forEach(x => {
                const n = y * Game.sizes.grid.x + x;
                relativeCoords[n] = [
                    x * (100 / Game.sizes.grid.x),
                    y * (100 / Game.sizes.grid.y)
                ];
            });
        });

        const coords = Maths.Geometry.getAbsoluteCoords(
            relativeCoords,
            Game.sizes.level.w,
            Game.sizes.level.h,
            Game.sizes.level.x,
            Game.sizes.level.y
        );

        // mezők
        Game.grid = [];
        const fieldW = Math.floor(Game.sizes.level.w / Game.sizes.grid.x);
        const fieldH = Math.floor(Game.sizes.level.h / Game.sizes.grid.y);
        Util.Array.fromNum(Game.sizes.grid.y).forEach(y => {
            Util.Array.fromNum(Game.sizes.grid.x).forEach(x => {
                const n = y * Game.sizes.grid.x + x;
                Game.grid[n] = {
                    id : n,
                    row : y,
                    col : x,
                    playerID : null,
                    x : coords[n].x,
                    y : coords[n].y,
                    w : fieldW,
                    h : fieldH
                };
            });
        });
    }

};

export default Game;
