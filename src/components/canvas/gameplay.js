import Util from '../../hd/hd.utility';

/**
 * Interakciós segédfüggvények
 * @type {Object}
 */
const Gameplay = {

    /**
     * Game.play
     * @type {Object}
     */
    play : null,

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
     * Game.sizes.grid
     * @type {Object}
     */
    gridSize : null,

    /**
     * ?
     * @param {Object} Game
     * @param {Object} Mediator
     */
    init : function(Game, Mediator){
        Gameplay.play = Game.play;
        Gameplay.players = Game.players;
        Gameplay.grid = Game.grid;
        Gameplay.gridSize = Game.sizes.grid;
        Gameplay.Mediator = Mediator;

        Gameplay.startGame();
    },

    /**
     * Lehetséges interakció meghatározása (jelenlegi játékos)
     * @return {String} interakció típusa ('none'|'click')
     */
    getInteraction : function(){
        return Util.Misc.switching(Gameplay.players[Gameplay.play.currentPlayerID].status, {
            'init' : 'none',
            'play' : 'click',
            'wait' : 'none',
            'end'  : 'none'
        });
    },

    /**
     * Következő játékszakasz beállítása
     * @param {Number} [lastFieldID=null] - a legutóbb lerakott kő helye
     * @return {String}
     */
    gameNextSection : function(lastFieldID = null){
        if (Gameplay.play.gameSection === 'init'){
            Gameplay.play.gameSection = 'playing';
        }
        else if (Gameplay.play.gameSection === 'playing'){
            if (Gameplay.isEndGame(lastFieldID)){
                Gameplay.play.gameSection = 'end';
            }
        }
        return Gameplay.play.gameSection;
    },

    /**
     * Játék indítása
     */
    startGame : function(){
        const firstPlayerID = Gameplay.players.findIndex(player => player.isFirst);
        Gameplay.Mediator.gameSection('init');
        Gameplay.Mediator.currentPlayerID(firstPlayerID);
        Gameplay.play.currentPlayerID = firstPlayerID;

        Gameplay.players.forEach((player, id) => {
            Gameplay.players[id].status = 'wait';
        });
        Gameplay.players[firstPlayerID].status = 'play';
        const newGameSection = Gameplay.gameNextSection();
        Gameplay.Mediator.gameSection(newGameSection);
        if (Gameplay.players[firstPlayerID].strategy !== 'human'){
            const fieldID = Gameplay.Mediator.strategy('next');
            Gameplay.nextPlayer(fieldID);
        }
    },

    /**
     * Játékos váltása
     * @param {Number} fieldID - mező azonosító amire követ rakott
     * @return {String} eredmény - ('next'|'end')
     */
    nextPlayer : function(fieldID){
        // következő játékos
        const currentPlayerID = (Gameplay.play.currentPlayerID + 1) % Gameplay.players.length;
        Gameplay.players.forEach((player, id) => {
            Gameplay.players[id].status = 'wait';
        });
        Gameplay.players[currentPlayerID].status = 'play';

        // egyéb módosítások
        const newGameSection = Gameplay.gameNextSection(fieldID);
        Gameplay.Mediator.gameSection(newGameSection);
        if (newGameSection !== 'end'){
            Gameplay.Mediator.currentPlayerID(currentPlayerID);
            if (Gameplay.players[currentPlayerID].strategy !== 'human'){
                const nextFieldID = Gameplay.Mediator.strategy('next');
                Gameplay.nextPlayer(nextFieldID);
            }
            return 'next';
        }
        else {
            Gameplay.players.forEach((player, id) => {
                Gameplay.players[id].status = 'end';
            });
            Gameplay.Mediator.endGame(Gameplay.play.winner.playerID);
            return 'end';
        }
    },

    /**
     * Vége van-e a játéknak
     * @param {Number} lastFieldID - a legutóbb lerakott kő helye
     * @return {Boolean} true: vége
     */
    isEndGame : function(lastFieldID){
        let isEnd = false;
        let sequence, sequenceLength;
        const directions = ['horizontal', 'vertical', 'diagonal-asc', 'diagonal-desc'];

        if (!Gameplay.grid.find(field => field.playerID === null)){
            isEnd = true;
        }
        else if (!lastFieldID){
            isEnd = false;
        }
        else {
            isEnd = directions.some(direction => {
                sequence = [];
                sequenceLength = Gameplay.neighbouringPlayerFields(lastFieldID, direction, function(field){
                    sequence.push(field);
                });
                if (sequenceLength >= Gameplay.play.connectNum){
                    Gameplay.play.winner = {
                        playerID : Gameplay.grid[lastFieldID].playerID,
                        sequence : sequence
                    };
                    return true;
                }
                else {
                    return false;
                }
            });
        }
        return isEnd;
    },

    /* eslint-disable complexity */

    /**
     * Egy mezővel sorozatot alkotó mezők bejárása
     * @param {Number} fieldID - kiindulási mező azonosítója
     * @param {String} direction - irány ("horizontal"|"vertical"|"diagonal-asc"|"diagonal-desc")
     * @param {Function} [callback] - elemeken végrehajtandó függvény
     * @return {Number} callback-lefutások száma
     */
    neighbouringPlayerFields : function(fieldID, direction, callback = () => {}){
        let x, y, full;
        const grid = [];
        const gridSize = Gameplay.gridSize;
        const field = Gameplay.grid[fieldID];
        const step = function(thisField){
            if (thisField.playerID === field.playerID){
                full++;
                return callback(thisField);
            }
            else {
                return false;
            }
        };

        // 2 dimenziós grid létrehozása
        Gameplay.grid.forEach(f => {
            grid[f.row] = grid[f.row] || [];
            grid[f.row][f.col] = f;
        });

        full = 0;
        if (direction === 'horizontal'){
            for (x = field.col; x >= 0; x--){
                if (step(grid[field.row][x]) === false) break;
            }
            for (x = field.col + 1; x < gridSize.x; x++){
                if (step(grid[field.row][x]) === false) break;
            }
        }
        if (direction === 'vertical'){
            for (y = field.row; y >= 0; y--){
                if (step(grid[y][field.col]) === false) break;
            }
            for (y = field.row + 1; y < gridSize.y; y++){
                if (step(grid[y][field.col]) === false) break;
            }
        }
        if (direction === 'diagonal-asc'){
            for (x = field.col, y = field.row; x < gridSize.x && y >= 0; x++, y--){
                if (step(grid[y][x]) === false) break;
            }
            for (x = field.col - 1, y = field.row + 1; x >= 0 && y < gridSize.y; x--, y++){
                if (step(grid[y][x]) === false) break;
            }
        }
        if (direction === 'diagonal-desc'){
            for (x = field.col, y = field.row; x >= 0 && y >= 0; x--, y--){
                if (step(grid[y][x]) === false) break;
            }
            for (x = field.col + 1, y = field.row + 1; x < gridSize.x && y < gridSize.y; x++, y++){
                if (step(grid[y][x]) === false) break;
            }
        }
        return full;
    }

    /* eslint-enable complexity */

};

export default Gameplay;
