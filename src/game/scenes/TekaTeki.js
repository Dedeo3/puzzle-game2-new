import { Scene } from "phaser";

export class TekaTeki extends Scene {
    constructor() {
        super("TekaTeki");
    }

    preload() {
        this.load.audio("tk", "music/tk.mp3");
        this.load.image("bg", "assets/bgT.jpg");
    }

    init() {
        this.selectedCell = null;
        this.gameWidth = this.sys.game.config.width;
        this.gameHeight = this.sys.game.config.height;
        this.isMobile = this.sys.game.device.os.android || this.sys.game.device.os.iOS;

        const rows = 14;
        const cols = 18;
        this.answerKey = Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => '')
        );


        this.daftarkata = [
            {
                no: 1,
                kata: 'OLAHRAGA',
                petunjuk: 'Cara menjaga organ pernafasan manusia adalah',
                row: 0,
                col: 2,
                arah: 'MENURUN'
            },
            {
                no: 2,
                kata: 'PARUPARU',
                petunjuk: 'Organ pernafasan manusia',
                row: 0,
                col: 9,
                arah: 'MENURUN'
            },
            {
                no: 3,
                kata: 'INFLUENZA',
                petunjuk: 'Gangguan sistem pernafasan yang bergejala batuk pilek demam adalah',
                row: 1,
                col: 0,
                arah: 'MENURUN'
            },
            {
                no: 4,
                kata: 'BRONKUS',
                petunjuk: 'Saluran pernafasan sebelum bronkiolus',
                row: 1,
                col: 4,
                arah: 'MENURUN'
            },
            {
                no: 5,
                kata: 'DIAFRAGMA',
                petunjuk: 'Rongga dada dan rongga perut di batasi oleh',
                row: 2,
                col: 7,
                arah: 'MENURUN'
            },
            {
                no: 6,
                kata: 'HIDUNG',
                petunjuk: 'Alat pernafasan yang berfungsi menyaring udara',
                row: 3,
                col: 6,
                arah: 'MENDATAR'
            },
            {
                no: 7,
                kata: 'LARING',
                petunjuk: 'Yang menghubungkan faring dan trakea adalah',
                row: 4,
                col:0,
                arah: 'MENDATAR'
            },
            {
                no: 8,
                kata: 'UMUR',
                petunjuk: 'Frekuensi pernafasan dipengaruhi oleh',
                row: 6,
                col: 4,
                arah: 'MENDATAR'
            },
            {
                no: 9,
                kata: 'Asma',
                petunjuk: 'Penyakit yang disebabkan oleh penyempitan bronkiolus sehingga penderita kesulitan bernafas ',
                row: 9,
                col: 0,
                arah: 'MENDATAR'
            },
            {
                no: 10,
                kata: 'TRAKEA',
                petunjuk: 'Salah satu organ tubuh dalam sistem pernafasan',
                row: 10,
                col: 5,
                arah: 'MENDATAR'
            }
        ];
        

        this.daftarkata.forEach(item => {
            const { kata, row, col, arah } = item;
            for (let i = 0; i < kata.length; i++) {
                const r = arah === 'MENURUN' ? row + i : row;
                const c = arah === 'MENURUN' ? col : col + i;
                if (r < rows && c < cols) {
                    this.answerKey[r][c] = kata[i].toUpperCase();
                }
            }
        });

        this.answers = this.answerKey.map(row => row.map(cell => cell.toUpperCase()));
        this.grid = [];
        this.hasChecked = false;
    }

    create() {
        const { gameWidth, gameHeight, isMobile } = this;

        // Responsive background
        const bg = this.add.image(gameWidth / 2, gameHeight / 2, "bg");
        const scaleX = gameWidth / bg.width;
        const scaleY = gameHeight / bg.height;
        const scale = Math.max(scaleX, scaleY);
        bg.setScale(scale).setDepth(-1);

        this.createHeader();
        this.sound.play("tk", { loop: true, volume: 0.3 });

        // Calculate cell size based on screen size
        const baseCellSize = isMobile ? 45 : 60;
        const maxGridWidth = gameWidth * (isMobile ? 0.95 : 0.85);
        const maxGridHeight = gameHeight * (isMobile ? 0.7 : 0.8);

        const rows = this.answers.length;
        const cols = this.answers[0].length;

        // Calculate cell size that fits the screen
        const cellSize = Math.min(
            baseCellSize,
            maxGridWidth / cols,
            maxGridHeight / rows
        );

        const gridWidth = cols * cellSize;
        const gridHeight = rows * cellSize;

        // Position grid differently for mobile vs desktop
        let gridX, gridY;
        if (isMobile) {
            // Mobile layout - grid on top, clues below
            gridX = gameWidth / 2 - gridWidth / 2;
            gridY = 100;
        } else {
            // Desktop layout - grid on left, clues on right
            // gridX = gameWidth * 0.05;
            gridX = (gameWidth - gridWidth) / 2;
            gridY = 120;
        }

        // Background for grid
        this.add.rectangle(gridX - 8, gridY - 8, gridWidth + 16, gridHeight + 16, 0x333333)
            .setOrigin(0);

        const clueNumbers = {};
        this.daftarkata.forEach(k => {
            const r = k.arah === 'MENURUN' ? k.row : k.row;
            const c = k.arah === 'MENURUN' ? k.col : k.col;
            clueNumbers[`${r},${c}`] = k.no;
        });

        // Keyboard input
        this.input.keyboard.on("keydown", (event) => {
            if (!this.selectedCell) return;
            const key = event.key.toUpperCase();

            if (/^[A-Z]$/.test(key)) {
                this.selectedCell.text.setText(key);
                if (this.hasChecked) {
                    this.resetCellColors();
                    this.hasChecked = false;
                }
            } else {
                const { row, col } = this.selectedCell;
                if (event.key === "ArrowRight" && col < cols - 1) this.selectCell(row, col + 1);
                if (event.key === "ArrowLeft" && col > 0) this.selectCell(row, col - 1);
                if (event.key === "ArrowDown" && row < rows - 1) this.selectCell(row + 1, col);
                if (event.key === "ArrowUp" && row > 0) this.selectCell(row - 1, col);
            }
        });

        // Create grid cells
        for (let row = 0; row < rows; row++) {
            this.grid[row] = [];
            for (let col = 0; col < cols; col++) {
                const x = gridX + col * cellSize;
                const y = gridY + row * cellSize;
                const isActive = this.answers[row][col] !== '';

                const cellBg = this.add.rectangle(x, y, cellSize - 2, cellSize - 2, isActive ? 0xffffff : 0x888888)
                    .setOrigin(0)
                    .setStrokeStyle(1, 0x000000);

                const letter = this.add.text(x + cellSize / 2, y + cellSize / 2, '', {
                    fontSize: `${Math.floor(cellSize * 0.55)}px`,
                    color: '#000000',
                    fontFamily: 'Arial',
                    fontStyle: 'bold'
                }).setOrigin(0.5);

                const cell = { bg: cellBg, text: letter, row, col, isActive };

                if (isActive) {
                    const key = `${row},${col}`;
                    if (clueNumbers[key]) {
                        this.add.text(x + 2, y + 2, clueNumbers[key], {
                            fontSize: `${Math.floor(cellSize * 0.5)}px`,
                            color: '#000000',
                            fontFamily: 'Arial',
                            fontStyle: 'bold'
                        }).setOrigin(0);
                    }

                    cellBg.setInteractive().on("pointerdown", () => {
                        this.selectCell(row, col);
                    });
                }

                this.grid[row][col] = cell;
            }
        }

        // Create clues based on device type
        if (isMobile) {
            // Mobile - clues below the grid
            this.createCluesMobile(gridX, gridY + gridHeight + 20, gridWidth);
        } else {
            // Desktop - clues to the right of the grid
            this.createCluesDesktop(gridX - 320, gridY);

        }

        // Position submit button to the right of the grid for desktop
        const buttonX = isMobile ?
            gameWidth / 2 : // center for mobile 
            gridX + gridWidth + 110; // right of grid for desktop
        const buttonY = isMobile ?
            gridY + gridHeight + 250 : // below grid for mobile 
            gridY + gridHeight - 200; // bottom of grid for desktop

        // Create submit button
        this.createCheckButton(buttonX, buttonY);

        // Create "Lihat Materi" button below the submit button
        // Calculate position for "Lihat Materi" button (below submit button)
        const materiButtonX = buttonX;
        const materiButtonY = buttonY + 60; // 60 pixels below the submit button

        this.createLihatMateri(materiButtonX, materiButtonY);
    }

    createHeader() {
        const headerHeight = this.isMobile ? 50 : 60;
        const headerWidth = this.isMobile ? this.gameWidth * 0.9 : 700;
        const fontSize = this.isMobile ? '16px' : '20px';

        this.add.rectangle(this.gameWidth / 2, 40, headerWidth, headerHeight, 0xffffff)
            .setStrokeStyle(2, 0x000000)
            .setAlpha(0.85)
            .setOrigin(0.5);

        this.add.text(this.gameWidth / 2, 40, "TEKA-TEKI SILANG: SISTEM PEREDARAN DARAH", {
            fontSize: fontSize,
            color: '#222222',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            wordWrap: { width: headerWidth - 40 }
        }).setOrigin(0.5);


    }

    createCluesDesktop(x, y) {
        const cluesMendatar = [
            { no: 6, text: "Alat pernafasan yang berfungsi menyaring udara" },
            { no: 7, text: "Yang menghubungkan faring dengan trakea adalah" },
            { no: 8, text: "Frekuensi pernafasan dipengaruhi oleh" },
            { no: 9, text: "Penyakit yang disebabkan oleh penyempitan bronkiolus sehingga penderita mengalami kesulitan bernafas" },
            { no: 10, text: "Salah satu organ tubuh dalam sistem pernafasan" },
        ];
        

        const cluesMenurun = [
            { no: 1, text: "Cara menjaga organ pernafasan manusia dengan" },
            { no: 2, text: "Organ pernafasan manusia" },
            { no: 3, text: "Gangguan sistem pernafasan yang bergejala batuk pilek demam adalah" },
            { no: 4, text: "Saluran pernafasan sebelum bronkiolus" },
            { no: 5, text: "Rongga dada dan rongga perut di batasi oleh" },
        ];
        

        // Constants for styling
        const tabWidth = 140;
        const tabHeight = 35;
        const clueWidth = 290;
        const clueHeight = 450;
        const fontSize = 17;
        const questionSpacing = 15;

        // Create tab container and content area
        const tabBg = this.add.rectangle(x - 10, y - 10, clueWidth + 20, clueHeight + tabHeight + 20, 0xffffff)
            .setOrigin(0)
            .setStrokeStyle(1, 0xdddddd)
            .setAlpha(0.9);

        // Tab buttons
        const tabMendatar = this.add.rectangle(x, y, tabWidth, tabHeight, 0x8B0000)
            .setOrigin(0)
            .setInteractive({ useHandCursor: true });

        const tabMenurun = this.add.rectangle(x + tabWidth, y, tabWidth, tabHeight, 0xBB5555)
            .setOrigin(0)
            .setInteractive({ useHandCursor: true });

        // Tab text
        const tabTextMendatar = this.add.text(x + tabWidth / 2, y + tabHeight / 2, 'MENDATAR', {
            fontSize: '18px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            fill: '#FFFFFF'
        }).setOrigin(0.5);

        const tabTextMenurun = this.add.text(x + tabWidth + tabWidth / 2, y + tabHeight / 2, 'MENURUN', {
            fontSize: '18px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            fill: '#FFFFFF'
        }).setOrigin(0.5);

        // Create content containers for clues
        const contentY = y + tabHeight + 10;

        // Container for Mendatar clues (visible by default)
        const mendatarContainer = this.add.container(x, contentY);

        // Container for Menurun clues (hidden by default)
        const menurunContainer = this.add.container(x, contentY);
        menurunContainer.setVisible(false);

        // Style for clues
        const clueStyle = {
            fontSize: `${fontSize}px`,
            fontFamily: 'Arial',
            fill: '#333',
            wordWrap: {
                width: clueWidth,
                useAdvancedWrap: true
            },
            lineSpacing: 6,
            align:"start",
        
        };

        // Add Mendatar clues to container
        let currentY = 0;
        cluesMendatar.forEach(item => {
            const clueText = this.add.text(10, currentY, `${item.no}. ${item.text}`, clueStyle);
            mendatarContainer.add(clueText);

            // Calculate next position
            const actualHeight = clueText.height;
            currentY += actualHeight + questionSpacing;
        });

        // Add Menurun clues to container
        currentY = 0;
        cluesMenurun.forEach(item => {
            const clueText = this.add.text(10, currentY, `${item.no}. ${item.text}`, clueStyle);
            menurunContainer.add(clueText);

            // Calculate next position
            const actualHeight = clueText.height;
            currentY += actualHeight + questionSpacing;
        });

        // Tab switching logic
        tabMendatar.on('pointerdown', () => {
            // Activate Mendatar tab
            tabMendatar.fillColor = 0x8B0000; // Dark red
            tabMenurun.fillColor = 0xBB5555;  // Lighter red

            // Show Mendatar content, hide Menurun
            mendatarContainer.setVisible(true);
            menurunContainer.setVisible(false);
        });

        tabMenurun.on('pointerdown', () => {
            // Activate Menurun tab
            tabMendatar.fillColor = 0xBB5555;  // Lighter red
            tabMenurun.fillColor = 0x8B0000;   // Dark red

            // Show Menurun content, hide Mendatar
            mendatarContainer.setVisible(false);
            menurunContainer.setVisible(true);
        });

        // Store references to containers and tabs in scene for later access if needed
        this.mendatarContainer = mendatarContainer;
        this.menurunContainer = menurunContainer;
        this.tabMendatar = tabMendatar;
        this.tabMenurun = tabMenurun;
    }

    createCluesMobile(x, y, width) {
        const cluesMendatar = [
            { no: 6, text: "Alat pernafasan yang berfungsi menyaring udara" },
            { no: 7, text: "Yang menghubungkan faring dengan trakea adalah" },
            { no: 8, text: "Frekuensi pernafasan dipengaruhi oleh" },
            { no: 9, text: "Penyakit yang disebabkan oleh penyempitan bronkiolus sehingga penderita mengalami kesulitan bernafas" },
            { no: 10, text: "Salah satu organ tubuh dalam sistem pernafasan" },
        ];


        const cluesMenurun = [
            { no: 1, text: "Cara menjaga organ pernafasan manusia dengan" },
            { no: 2, text: "Organ pernafasan manusia" },
            { no: 3, text: "Gangguan sistem pernafasan yang bergejala batuk pilek demam adalah" },
            { no: 4, text: "Saluran pernafasan sebelum bronkiolus" },
            { no: 5, text: "Rongga dada dan rongga perut di batasi oleh" },
        ];

        const titleStyle = {
            font: 'bold 14px Arial',
            fill: '#8B0000',
            padding: { bottom: 8 }
        };

        const clueStyle = {
            font: '12px Arial',
            fill: '#333',
            wordWrap: {
                width: width - 20,
                useAdvancedWrap: true
            },
            lineSpacing: 4
        };

        // Background for clues
        this.add.rectangle(x + width / 2, y + 120, width, 240, 0xffffff)
            .setStrokeStyle(1, 0xdddddd)
            .setAlpha(0.9);

        this.add.text(x, y, 'MENDATAR', titleStyle);

        let currentY = y + 20;
        cluesMendatar.forEach(item => {
            this.add.text(x, currentY, `${item.no}. ${item.text}`, clueStyle);
            currentY += 30;
        });

        currentY += 10;
        this.add.text(x, currentY, 'MENURUN', titleStyle);
        currentY += 20;

        cluesMenurun.forEach(item => {
            this.add.text(x, currentY, `${item.no}. ${item.text}`, clueStyle);
            currentY += 30;
        });
    }

    createCheckButton(x, y) {
        const buttonWidth = this.isMobile ? 120 : 160;
        const buttonHeight = this.isMobile ? 40 : 45;
        const fontSize = this.isMobile ? '14px' : '16px';

        const button = this.add.rectangle(x, y, buttonWidth, buttonHeight, 0x2196F3)
            .setInteractive()
            .setOrigin(0.5)
            .setStrokeStyle(2, 0x000000);

        this.add.text(x, y, 'Submit', {
            fontSize: fontSize,
            color: '#FFFFFF',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        button.on('pointerdown', () => {
            this.checkAnswers();
        });
    }

    createLihatMateri(x, y) {
        const buttonWidth = this.isMobile ? 120 : 160;
        const buttonHeight = this.isMobile ? 40 : 45;
        const fontSize = this.isMobile ? '14px' : '16px';

        const button = this.add.rectangle(x, y, buttonWidth, buttonHeight, 0x45a049)
            .setInteractive()
            .setOrigin(0.5)
            .setStrokeStyle(2, 0x000000);

        this.add.text(x, y, 'Check material', {
            fontSize: fontSize,
            color: '#FFFFFF',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        button.on('pointerdown', () => {
            this.checkMateri();
        });
    }


    checkMateri() {
        // Store the target scene name in localStorage
        localStorage.setItem('targetScene', 'PreparationScene');

        // Get the base URL of your application
        const baseUrl = window.location.origin + window.location.pathname;

        // Open a new tab with a query parameter to indicate which scene to start
        window.open(baseUrl + '?scene=PreparationScene', '_blank');
    }

    checkAnswers() {
        let score = 0;
        this.hasChecked = true;
        this.resetCellColors();

        this.daftarkata.forEach(({ kata, row, col, arah }) => {
            let benar = true;

            for (let i = 0; i < kata.length; i++) {
                const r = arah === 'MENURUN' ? row + i : row;
                const c = arah === 'MENURUN' ? col : col + i;

                const cell = this.grid[r][c];
                const jawabanUser = cell.text.text.toUpperCase();
                const jawabanBenar = kata[i].toUpperCase();

                if (jawabanUser !== jawabanBenar) {
                    benar = false;
                    cell.bg.setFillStyle(0xffcccc); // merah muda jika salah
                } else {
                    cell.bg.setFillStyle(0xccffcc); // hijau muda jika benar
                }
            }

            if (benar) score += 10;
        });

        this.showScoreAlert(score, this);
    }

    resetCellColors() {
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].length; col++) {
                const cell = this.grid[row][col];
                if (cell.isActive) {
                    cell.bg.setFillStyle(0xffffff);
                }
            }
        }
    }

    showScoreAlert(score, scene) {
        let message = '';
        let color = 0x28a745; // hijau default
        let iconEmoji = '🎉';

        if (score >= 80) {
            message = `Keren! Skormu ${score} 🎉\nKamu luar biasa!`;
            color = 0x28a745; // hijau
            iconEmoji = '🏆';
        } else if (score >= 60) {
            message = `Bagus! Skormu ${score} ⭐\nTerus tingkatkan ya!`;
            color = 0xffc107; // kuning
            iconEmoji = '💪';
        } else {
            message = `Skormu ${score} 😢\nJangan menyerah, terus semangat!`;
            color = 0xdc3545; // merah
            iconEmoji = '🔥';
        }

        // Background overlay
        const overlay = scene.add.rectangle(scene.scale.width / 2, scene.scale.height / 2,
            scene.scale.width, scene.scale.height, 0x000000, 0.5);
        overlay.setDepth(1000);

        // Alert box
        const boxWidth = scene.isMobile ? 280 : 320;
        const boxHeight = scene.isMobile ? 160 : 180;
        const alertBox = scene.add.rectangle(scene.scale.width / 2, scene.scale.height / 2,
            boxWidth, boxHeight, 0xffffff);
        alertBox.setStrokeStyle(3, color);
        alertBox.setDepth(1001);

        // Emoji Icon
        const icon = scene.add.text(scene.scale.width / 2, scene.scale.height / 2 - (scene.isMobile ? 40 : 55),
            iconEmoji, { fontSize: scene.isMobile ? '30px' : '36px' })
            .setOrigin(0.5).setDepth(1002);

        // Message
        const alertText = scene.add.text(scene.scale.width / 2, scene.scale.height / 2 - (scene.isMobile ? 5 : 10),
            message, {
            fontSize: scene.isMobile ? '14px' : '16px',
            color: '#000000',
            align: 'center',
            fontFamily: 'Arial',
            wordWrap: { width: boxWidth - 40 }
        }).setOrigin(0.5).setDepth(1002);

        // OK button
        const button = scene.add.rectangle(scene.scale.width / 2,
            scene.scale.height / 2 + (scene.isMobile ? 45 : 55),
            scene.isMobile ? 80 : 90,
            scene.isMobile ? 25 : 30,
            color);
        button.setInteractive({ useHandCursor: true });
        button.setDepth(1002);

        const buttonText = scene.add.text(button.x, button.y, 'OK', {
            fontSize: scene.isMobile ? '12px' : '14px',
            color: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setDepth(1003);

        // Destroy all when OK is clicked
        button.on('pointerdown', () => {
            overlay.destroy();
            alertBox.destroy();
            alertText.destroy();
            button.destroy();
            buttonText.destroy();
            icon.destroy();
        });
    }

    selectCell(row, col) {
        if (!this.grid[row] || !this.grid[row][col] || !this.grid[row][col].isActive) return;
        if (this.selectedCell) {
            this.selectedCell.bg.setStrokeStyle(1, 0x000000);
        }
        this.selectedCell = this.grid[row][col];
        this.selectedCell.bg.setStrokeStyle(3, 0xff9800); // oranye terang
    }
}