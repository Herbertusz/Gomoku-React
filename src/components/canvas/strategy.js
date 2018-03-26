import Maths from '../../hd/hd.math';

/**
 * AI algoritmusok vezérlése
 * @type {Object}
 */
const Strategy = {

    /**
     * Game.play.currentPlayerID
     * @type {Number}
     */
    currentPlayerID : null,

    /**
     * Game.players
     * @type {Array}
     */
    players : null,

    /**
     * Game.grid
     * @type {Object}
     */
    grid : null,

    /**
     * AI függvények adattárolója (pl előző lefutás eredménye, stb)
     * @type {Object}
     * @description szerkezet: {
     *     <algoritmus> : {      // algoritmus metódus neve
     *         <adat1> : Mixed   // adatok
     *         ...
     *     }
     * }
     */
    storage : {
        random : {
            lastPlaceField : null
        }
    },

    /**
     * ?
     * @param {Object} Game
     * @param {Object} Mediator
     */
    init : function(Game, Mediator){
        Strategy.currentPlayerID = Game.play.currentPlayerID;
        Strategy.players = Game.players;
        Strategy.grid = Game.grid;
        Strategy.mediator = Mediator;
    },

    /**
     * Algoritmus lefuttatása
     * @param {String} status - az AI meghívási módja ('next'|'end')
     * @return {Object} field objektum
     */
    run : function(status){
        let placeField = null;
        const ai = Strategy.players[Strategy.currentPlayerID].strategy;
        if (status === 'next'){
            placeField = Strategy[ai](Strategy.storage[ai]);
        }
        // Strategy.mediator.strategyAction(placeField);  // TODO: ezt muszáj így?
        return placeField;
    },

    /**
     * Véletlenszerű algoritmus
     * @param {Object} storage - adattároló
     * @return {Number} mező azonosító
     */
    random : function(storage){
        const emptyFields = Strategy.grid.filter(field => field.playerID === null);
        const placeField = emptyFields[Maths.rand(0, emptyFields.length - 1)];
        storage.lastPlaceField = placeField.id;  // példa az adattároló használatára
        return placeField.id;
    }

};

export default Strategy;
