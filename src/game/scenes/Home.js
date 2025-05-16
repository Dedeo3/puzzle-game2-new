import { Scene } from 'phaser';

export class Home extends Scene {
    constructor() {
        super('Home');
    }
    
    preload() {
        // Load audio
        this.load.audio("home", 'music/home.mp3');
        this.load.audio("klik", 'music/klik.wav');
    }
    
    create() {
        // Play background music (with error handling)
        try {
            this.sound.play('home', {
                loop: true,
                volume: 0.5
            });
        } catch (e) {
            console.warn("Could not play sound:", e);
        }
        
        const clickSound = this.sound.add('klik');
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;
        
        // Add background with gradient
        const background = this.add.graphics();
        background.fillGradientStyle(
            0x1a237e, // Dark blue (top)
            0x1a237e, // Dark blue (top)
            0x7e57c2, // Purple (bottom)
            0x7e57c2, // Purple (bottom)
            1
        );
        background.fillRect(0, 0, this.scale.width, this.scale.height);
        
        // Title text
        const title = this.add.text(centerX, centerY - 120, 'PUZZLE QUEST GAME', {
            fontFamily: 'Georgia, serif',
            fontSize: '50px',
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5);
        
        // Add some animation to the title
        this.tweens.add({
            targets: title,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Subtitle
        this.add.text(centerX, centerY - 70, 'Challenge Your Mind', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#f5f5f5',
            fontStyle: 'italic'
        }).setOrigin(0.5);
        
        // Create input background
        const inputBg = this.add.graphics();
        inputBg.fillStyle(0xffffff, 0.3);
        inputBg.fillRoundedRect(centerX - 150, centerY - 25, 300, 50, 15);
        inputBg.lineStyle(2, 0xffffff, 1);
        inputBg.strokeRoundedRect(centerX - 150, centerY - 25, 300, 50, 15);
        
        // Input field using DOM
        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.placeholder = 'Enter Your Name';
        inputElement.style.width = '280px';
        inputElement.style.height = '40px';
        inputElement.style.fontSize = '18px';
        inputElement.style.textAlign = 'center';
        inputElement.style.borderRadius = '10px';
        inputElement.style.border = 'none';
        inputElement.style.outline = 'none';
        inputElement.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        inputElement.style.color = '#333';
        inputElement.style.boxShadow = '0px 2px 5px rgba(0, 0, 0, 0.2)';
        
        // Add input to DOM
        const input = this.add.dom(centerX, centerY, inputElement);
        
        // Create button background
        const buttonBg = this.add.graphics();
        buttonBg.fillStyle(0xff9800, 1);  // Orange
        buttonBg.fillRoundedRect(centerX - 70, centerY + 40, 140, 50, 15);
        buttonBg.lineStyle(2, 0xffffff, 1);
        buttonBg.strokeRoundedRect(centerX - 70, centerY + 40, 140, 50, 15);
        
        
        // Button element using DOM
        const buttonElement = document.createElement('button');
        buttonElement.innerText = 'START GAME';
        buttonElement.style.width = '130px';
        buttonElement.style.height = '45px';
        buttonElement.style.fontSize = '18px';
        buttonElement.style.fontWeight = 'bold';
        buttonElement.style.backgroundColor = '#ff9800';
        buttonElement.style.color = 'white';
        buttonElement.style.border = 'none';
        buttonElement.style.borderRadius = '10px';
        buttonElement.style.cursor = 'pointer';
        buttonElement.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.3)';

        
        // Add button to DOM
        const button = this.add.dom(centerX, centerY + 65, buttonElement);
        
        // Error Text (hide by default)
        const errorText = this.add.text(centerX, centerY + 110, '', {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#ffeb3b',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // Button event
        buttonElement.addEventListener('click', () => {
            const name = inputElement.value.trim();
            try {
                clickSound.play();
            } catch (e) {
                console.warn("Could not play click sound:", e);
            }
            
            if (name) {
                this.registry.set('playerName', name);
                
                // Delay scene change slightly for better UX
                this.time.delayedCall(300, () => {
                    this.scene.start('PreparationScene');
                    try {
                        this.sound.stopByKey('home');
                    } catch (e) {
                        console.warn("Could not stop sound:", e);
                    }
                });
            } else {
                errorText.setText('Please enter your name');
                this.tweens.add({
                    targets: errorText,
                    alpha: 0,
                    duration: 2000,
                    ease: 'Power2',
                    onComplete: () => {
                        errorText.setAlpha(1);
                        errorText.setText('');
                    }
                });
            }
        });
        
        // Creator credit with style
        this.add.text(centerX, this.scale.height - 40, 'Created by: Putri Sulistiyanings', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#e0e0e0',
            fontStyle: 'italic'
        }).setOrigin(0.5);
        
        // Optional: handle screen resize
        this.scale.on('resize', this.resize, this);
        
        // For debugging - check DOM container
        console.log("DOM container exists:", !!this.sys.game.domContainer);
    }
    
    resize(gameSize) {
        const width = gameSize.width;
        const height = gameSize.height;
        this.cameras.resize(width, height);
    }
}