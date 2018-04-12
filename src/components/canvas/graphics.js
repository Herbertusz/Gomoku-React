import Util from '../../hd/hd.utility';
import Canvas from '../../hd/hd.canvas';

/**
 * Grafikai műveletek
 * @type {Object}
 */
const Graphics = {

    /**
     * Gyorsítótár (pálya rajza)
     * @type {HTMLElement}
     */
    cacheCanvas : null,

    /**
     * Canvas rajzoló kontextusa
     * @type {CanvasRenderingContext2D}
     */
    ctx : null,

    /**
     * Canvas rétegek
     * @type {Object}
     */
    layers : {},

    /**
     * Game.sizes.level
     * @type {Object}
     */
    level : null,

    /**
     * Game.sizes.grid
     * @type {Object}
     */
    gridSize : null,

    /**
     * Kövek színei (kulcs: stone)
     * @type {Array}
     */
    stoneColors : null,

    /**
     * Pálya vonalainak vastagsága
     * @type {Number}
     */
    lineWidth : 0,

    /**
     * Cache canvas létrehozása és paraméterek feltöltése
     * @param {Object} Game
     */
    init : function(Game){

        Graphics.level = Game.sizes.level;
        Graphics.gridSize = Game.sizes.grid;
        Graphics.lineWidth = Game.graphics.lineWidth;
        Graphics.stoneColors = Game.players.slice().sort((p1, p2) => {
            return p1.stone > p2.stone;
        }).map(player => player.stoneColor);

        Graphics.ctx = Game.element.getContext('2d');
        Graphics.layers = {
            level : Canvas.Layer('2d'),  // pálya rétege
            play : Canvas.Layer('2d')    // kövek rétege
        };
        Canvas.Layerset(Game.element, Graphics.layers.level, Graphics.layers.play);

        const drawGrid = function(canvas){
            // rajzolás cacheCanvas-ra
            const ctxCache = canvas.getContext('2d');
            const grid = Game.grid;

            // vonalak rajzolása
            ctxCache.strokeStyle = Game.graphics.lineColor;
            ctxCache.lineWidth = Graphics.lineWidth;
            ctxCache.beginPath();

            Util.Array.fromNum(Graphics.gridSize.y).forEach(row => {
                // vízszintes vonalak
                const n = row * Graphics.gridSize.x;
                const field = grid[n];
                const lastInRow = (row + 1) * Graphics.gridSize.x - 1;
                if (n > 0){
                    if (Graphics.lineWidth % 2 === 1 && field.y % 1 === 0){
                        field.y += 0.5;
                        grid[lastInRow].y += 0.5;
                    }
                    ctxCache.moveTo(field.x, field.y);
                    ctxCache.lineTo(grid[lastInRow].x + grid[lastInRow].w, grid[lastInRow].y);
                }
            });
            Util.Array.fromNum(Graphics.gridSize.x).forEach(col => {
                // függőleges vonalak
                const n = col;
                const field = grid[n];
                const lastInCol = (Graphics.gridSize.y - 1) * Graphics.gridSize.x + col;
                if (n > 0){
                    if (Graphics.lineWidth % 2 === 1 && field.x % 1 === 0){
                        field.x += 0.5;
                        grid[lastInCol].x += 0.5;
                    }
                    ctxCache.moveTo(field.x, field.y);
                    ctxCache.lineTo(grid[lastInCol].x, grid[lastInCol].y + grid[lastInCol].h);
                }
            });
            ctxCache.stroke();
        };

        Graphics.layers.level.draw(function(canvas, ctx){
            if (!Graphics.cacheCanvas){
                // rajzolás cacheCanvas-ra
                Graphics.cacheCanvas = document.createElement('canvas');
                Graphics.cacheCanvas.width = Game.sizes.canvas.w;
                Graphics.cacheCanvas.height = Game.sizes.canvas.h;
                drawGrid(Graphics.cacheCanvas);
            }
            ctx.drawImage(Graphics.cacheCanvas, 0, 0);
        });

    },

    /**
     * Kő kirajzolása játékosonként
     * @type {Array}
     */
    drawStoneByPlayer : [

        /**
         * "X" játékos
         * @param {CanvasRenderingContext2D} ctx - canvas 2D rajzoló kontextus
         * @param {Object} pos - {x : Number, y : Number, w : Number, h : Number}
         */
        function(ctx, pos){
            const corrH = Math.round(Graphics.level.w / Graphics.gridSize.x / 4);
            const corrV = Math.round(Graphics.level.h / Graphics.gridSize.y / 4);
            ctx.strokeStyle = Graphics.stoneColors[0];
            ctx.lineWidth = Math.floor(corrH / 2);
            ctx.beginPath();
            ctx.moveTo(pos.x + corrH, pos.y + corrV);
            ctx.lineTo(pos.x + pos.w - corrH, pos.y + pos.h - corrV);
            ctx.moveTo(pos.x + pos.w - corrH, pos.y + corrV);
            ctx.lineTo(pos.x + corrH, pos.y + pos.h - corrV);
            ctx.stroke();
        },

        /**
         * "O" játékos
         * @param {CanvasRenderingContext2D} ctx - canvas 2D rajzoló kontextus
         * @param {Object} pos - {x : Number, y : Number, w : Number, h : Number}
         */
        function(ctx, pos){
            const corr = Math.round(
                (Graphics.level.w / Graphics.gridSize.x + Graphics.level.h / Graphics.gridSize.y) / 8
            );
            ctx.strokeStyle = Graphics.stoneColors[1];
            ctx.lineWidth = Math.floor(corr / 2);
            ctx.beginPath();
            ctx.arc(pos.x + pos.w / 2, pos.y + pos.h / 2, pos.w / 2 - corr, 0, Math.PI * 2, true);
            ctx.stroke();
        },

        /**
         * "+" játékos
         * @param {CanvasRenderingContext2D} ctx - canvas 2D rajzoló kontextus
         * @param {Object} pos - {x : Number, y : Number, w : Number, h : Number}
         */
        function(ctx, pos){
            const corrH = Math.round(Graphics.level.w / Graphics.gridSize.x / 5);
            const corrV = Math.round(Graphics.level.h / Graphics.gridSize.y / 5);
            ctx.strokeStyle = Graphics.stoneColors[2];
            ctx.lineWidth = Math.floor(corrH * 0.8);
            ctx.beginPath();
            ctx.moveTo(pos.x + corrH, pos.y + pos.h / 2);
            ctx.lineTo(pos.x + pos.w - corrH, pos.y + pos.h / 2);
            ctx.moveTo(pos.x + pos.w / 2, pos.y + corrV);
            ctx.lineTo(pos.x + pos.w / 2, pos.y + pos.h - corrV);
            ctx.stroke();
        }

    ],

    /**
     * Egy kő kirajzolása a pos helyre
     * @param {Object} pos - koordináta és méret (bal felső sarok) {x : Number, y : Number, w : Number, h : Number}
     * @param {Number} stone - kő azonosítója (0|1|2)
     */
    drawStone : function(pos, stone){
        Graphics.layers.play.draw(function(canvas, ctx){
            Graphics.drawStoneByPlayer[stone](ctx, pos);
        });
    },

    /**
     * Kövek törlése
     */
    clearStones : function(){
        Graphics.layers.play.clear();
    },

    /**
     * Mező kiemelése (háttérszínnel)
     * @param {Object} field mező objektum
     * @param {String} color szín
     */
    repaintField : function(field, color){
        Graphics.layers.level.draw(function(canvas, ctx){
            const lw = Graphics.lineWidth;
            ctx.fillStyle = color;
            ctx.fillRect(field.x + lw, field.y + lw, field.w - 2 * lw, field.h - 2 * lw);
        });
    }

};

export default Graphics;
