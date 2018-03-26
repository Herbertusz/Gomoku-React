import Maths from '../../hd/hd.math';
import DOM from '../../hd/hd.dom';
import Labels from './labels';

/**
 * Interakciós segédfüggvények
 * @type {Object}
 */
const Interaction = {

    /**
     * Game.element
     * @type {HTMLElement}
     */
    element : null,

    /**
     * Game.grid
     * @type {Array}
     */
    grid : null,

    /**
     * ?
     * @param {Object} Game
     * @param {Object} Mediator
     */
    init : function(Game, Mediator){
        Interaction.element = Game.element;
        Interaction.grid = Game.grid;
        Interaction.Mediator = Mediator;

        // Interaction.onBeforeUnload();
        Interaction.onClick();
    },

    /**
     * BeforeUnload esemény csatolása
     */
    onBeforeUnload : function(){
        window.addEventListener('beforeunload', function(event){
            if (Interaction.Mediator.gameSection() === 'playing'){
                event.returnValue = Labels.message.beforeUnload;
                return Labels.message.beforeUnload;
            }
        }, false);
    },

    /**
     * Click esemény csatolása
     */
    onClick : function(){
        Interaction.element.addEventListener('click', function(event){
            Interaction.clickHandler(DOM.getMousePosition(event, Interaction.element));
        }, false);
    },

    /**
     * Click (mouseup) eseménykezelő
     * @param {Object} pos - egér pozíciója
     */
    clickHandler : function(pos){
        if (Interaction.Mediator.getInteraction() === 'none') return;
        const currentFieldID = Interaction.grid.findIndex(
            field => field.playerID === null && Maths.Geometry.isPointInsideRectangle(pos, field)
        );
        if (currentFieldID > -1){
            Interaction.runAction(currentFieldID);
        }
    },

    /**
     * Esemény lefuttatása
     * @param {Object} fieldID - mező azonosító
     */
    runAction : function(fieldID){
        Interaction.Mediator.changeGridState(fieldID, Interaction.Mediator.currentPlayerID());
    }

};

export default Interaction;
