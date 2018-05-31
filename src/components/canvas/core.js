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
     * Pálya pillanatnyi állapota egyszerűsített formában (playerID-k tömbje; belső használatra)
     * @type {Array}
     */
    grid : [],

    /**
     * [changeState description]
     * @type {Function}
     */
    changeState : null,

    /**
     * [description]
     * @param {HTMLCanvasElement} canvas
     * @param {Object} props
     */
    init : function(canvas, props){
        Core.grid = Array(props.options.gridSize_x * props.options.gridSize_y).fill(null);
        Core.changeState = props.changeState;
        Game.init(canvas, props);
        Graphics.init(Game);
        Interaction.init(Game, Core.Mediator);
        Strategy.init(Game, Core.Mediator);
        Gameplay.init(Game, Core.Mediator);
    },

    /**
     * Belső státusz módosítása
     * @param {Number} newFieldID
     * @param {Number} newPlayerID
     */
    changeGrid : function(newFieldID, newPlayerID){
        Core.grid[newFieldID] = newPlayerID;
        Game.grid[newFieldID].playerID = newPlayerID;
        Graphics.drawStone(Game.grid[newFieldID], Game.players[newPlayerID].stone);
    },

    /**
     * [description]
     * @param {Object} winner [description]
     * @description winner = {
     *     playerID : Number,
     *     sequence : Array(fieldID)
     * }
     */
    endGame : function(winner){
        if (winner.sequence.length){
            winner.sequence.forEach(fieldID => {
                Graphics.repaintField(Game.grid[fieldID], Game.players[winner.playerID].winColor);
            });
        }
        Core.changeState('winnerID', winner.playerID);
    },

    /**
     * Objektumok összekapcsolása
     * Mediator (illesztő) minta
     * @type {Object}
     */
    Mediator : {

        /**
         * [description]
         * @param {Number} fieldID
         * @param {Number} playerID
         */
        changeGridState : function(fieldID, playerID){
            Core.changeGrid(fieldID, playerID);
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
                Core.changeState('gameSection', set);
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
                Core.changeState('currentPlayerID', set);
                return set;
            }
            else {
                return Game.play.currentPlayerID;
            }
        },

        /**
         * [description]
         * @param {Object} winner
         * @description winner = {
         *     playerID : Number,
         *     sequence : Array(fieldID)
         * }
         */
        endGame : function(winner){
            Game.play.winner = winner;
            Core.endGame(winner);
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
