import Maths from '../../hd/hd.math';

/**
 * AI algoritmusok vezérlése
 * @type {Object}
 */
const Strategy = {

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
     * @description
     *  storage = {
     *      <algoritmus> : {      // algoritmus metódus neve
     *          <adat1> : Mixed   // adatok
     *          ...
     *      }
     *  }
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
        Strategy.players = Game.players;
        Strategy.grid = Game.grid;
        Strategy.Mediator = Mediator;
    },

    /**
     * Algoritmus lefuttatása
     * @param {String} status - az AI meghívási módja ('next'|'end')
     * @return {Number} mező azonosító
     */
    run : function(status){
        let placeFieldID = null;
        const ai = Strategy.players[Strategy.Mediator.currentPlayerID()].strategy;
        if (status === 'next'){
            placeFieldID = Strategy[ai](Strategy.storage[ai]);
        }
        return placeFieldID;
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
