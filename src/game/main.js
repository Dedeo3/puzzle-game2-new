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
    const game = new Game({ ...config, parent });

    // Check if there's a scene parameter in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const targetScene = urlParams.get('scene');

    if (targetScene) {
        // Wait for the game to be ready before starting the target scene
        game.events.once('ready', () => {
            // Stop the default scene (usually the first one)
            game.scene.stop('Home');

            // Start the requested scene
            game.scene.start(targetScene);

            console.log(`Started scene: ${targetScene}`);
        });
    }

    return game;
}

export default StartGame;
