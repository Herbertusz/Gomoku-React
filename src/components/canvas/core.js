import Game from './game';
import Graphics from './graphics';
import Interaction from './interaction';
import Gameplay from './gameplay';
import Strategy from './strategy';

/**
 * [description]
 * @type {Object}
 */
const Core = {

    /**
     * Ez a függvény a GameCanvas komponens setState metódusát hívja
     * @type {Function}
     */
    changeStateMethod : null,

    /**
     * [description]
     * @param {HTMLCanvasElement} canvas
     * @param {Object} props
     * @param {Function} changeStateMethod
     */
    init : function(canvas, props, changeStateMethod){
        Core.changeStateMethod = changeStateMethod;
        Game.init(canvas, props);
        Graphics.init(Game);
        Interaction.init(Game, Core.mediator);
        Gameplay.init(Game, Core.mediator);
    },

    /**
     * GameCanvas komponens státusz alkalmazása a canvas-ra
     * @param {Object} state
     * @description state = {
     *     gameSection : String,         // jelenlegi játékszakasz ('init'|'play'|'end')
     *     currentPlayerID : Number,     // jelenlegi játékos azonosítója (PlayArea kompoenens státusza)
     *     grid : Array(null|playerID),  // táblára rakott kövek
     *     winner : {
     *         playerID : Number,        // játékos azonosító
     *         sequence : Array(Number)  // kirakott sor (fieldID lista)
     *     }
     * }
     */
    applyState : function(state){
        if (state.gameSection !== 'end'){
            Graphics.clearStones();
            state.grid.forEach((playerID, fieldID) => {
                if (playerID !== null){
                    Game.grid[fieldID].playerID = playerID;
                    Graphics.drawStone(Game.grid[fieldID], Game.players[playerID].stone);
                }
            });
        }
        else {
            console.log(state.winner);
            // state.winner.playerID;
            state.winner.sequence.forEach(fieldID => {
                Graphics.repaintField(Game.grid[fieldID], Game.players[state.winner.playerID].winColor);
            });
        }
    },

    /**
     * Objektumok összekapcsolása
     * mediator (illesztő) minta
     * @type {Object}
     */
    mediator : {

        /**
         * [description]
         * @param {String|Object} property
         * @param {*} value
         */
        changeState : function(property, value = null){
            if (typeof property === 'object'){
                Core.changeStateMethod(property);
            }
            else {
                Core.changeStateMethod({
                    [property] : value
                });
            }
        },

        /**
         * [description]
         * @param {Number} fieldID
         * @param {Number} playerID
         */
        changeGridState : function(fieldID, playerID){
            Core.changeStateMethod({
                grid : {fieldID, playerID}
            });
            Gameplay.nextPlayer(fieldID);
        },

        /**
         * [description]
         * @param {String} set
         * @return {String}
         */
        gameSection : function(set = null){
            if (set !== null){
                Game.play.gameSection = set;
                Core.mediator.changeState('gameSection', set);
                return set;
            }
            else {
                return Game.play.gameSection;
            }
        },

        /**
         * [description]
         * @param {Number} set
         * @return {Number}
         */
        currentPlayerID : function(set = null){
            if (set !== null){
                Game.play.currentPlayerID = set;
                Core.mediator.changeState('currentPlayerID', set);
                return set;
            }
            else {
                return Game.play.currentPlayerID;
            }
        },

        /**
         * [description]
         * @param {Number} playerID
         */
        endGame : function(playerID){
            console.log('END');
        },

        /**
         * Lehetséges interakció meghatározása (jelenlegi játékos)
         * @return {String} interakció típusa ('none'|'click')
         */
        getInteraction : function(){
            return Gameplay.getInteraction();
        },

        /**
         * Algoritmus következő lépésének lefuttatása
         * @param {String} status - az AI meghívási módja ('next'|'end')
         * @return {Number} mező azonosító (Game.grid[n])
         */
        strategy : function(status){
            const fieldID = Strategy.run(status);
            Interaction.runAction(fieldID);
            return fieldID;
        }

    }

};

export default Core;
