import { Game as MainGame } from './scenes/Game';
import {Home as HomeMenu} from './scenes/Home'
import {PreparationScene as prepare} from './scenes/PreparationScene'
import {Puzzle as PuzzleScene} from './scenes/Puzzle'
import { TekaTeki as tk } from './scenes/TekaTeki';
import { AUTO, Scale,Game, DOM } from 'phaser';


// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    backgroundColor: '#1a237e',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        HomeMenu,
        prepare,
        PuzzleScene,
        tk
    ],
    dom: {
        createContainer: true
    }
};


const StartGame = (parent) => {
    return new Game({ ...config, parent });
}

export default StartGame;
