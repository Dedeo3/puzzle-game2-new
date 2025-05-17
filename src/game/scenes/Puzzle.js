import { Scene } from "phaser";

export class Puzzle extends Scene {
  constructor() {
    super("Puzzle");
    this.elapsedTime = 0;
    this.emptyPos = { row: 2, col: 2 };
    this.tiles = [];
    this.gridSize = 3; // 3x3 puzzle
  }

  preload() {
    // this.load.image("puzzle", "assets/paruu.jpg");
    for (let i = 1; i <= 9; i++) { // Misalnya 9 gambar berbeda
      this.load.image(`puzzle${i}`, `assets/grid${i}.png`);
    }
    this.load.image("background", "assets/bgPuz.jpg");
    this.load.audio('puz', 'music/puz.mp3')
    this.load.audio("klik", 'music/klik.wav')
    this.load.audio("swipe", 'music/swipe.mp3')
  }

  create() {
    this.sound.play('puz', {
      loop: true,
      volume: 0.5
    });
    const clickSound = this.sound.add('klik');
    const width = this.scale.width;
    const height = this.scale.height;

    // Background
    this.add.image(width / 2, height / 2, "background").setDisplaySize(width, height).setDepth(-1);

    // Timer
    this.timeText = this.add.text(width / 2, height * 0.05, "Time: 00:00", {
      fontFamily: "Arial",
      fontSize: `${Math.floor(height * 0.05)}px`,
      color: "#FFC000",
      fontStyle: "bold",
    }).setOrigin(0.5);

    // Instruction text
    this.add.text(width / 2, height * 0.15, "Selesaikan potongan puzzle ini !!", {
      fontFamily: "Arial",
      fontSize: `${Math.floor(height * 0.05)}px`,
      color: "#ffffff",
      fontStyle: "bold",
    }).setOrigin(0.5);

    const gridSize = this.gridSize;
    const puzzleSize = Math.min(width * 0.6, height * 0.6);
    const tileSize = Math.floor(puzzleSize / gridSize);

    // Center the puzzle
    const startX = (width - tileSize * gridSize) / 2;
    const startY = (height - tileSize * gridSize) / 2 + height * 0.05;

    this.tileSize = tileSize;
    this.startX = startX;
    this.startY = startY;

    // Create blue border around the entire puzzle
    this.add.rectangle(
      width / 2,
      startY + (tileSize * gridSize) / 2,
      tileSize * gridSize + 4,
      tileSize * gridSize + 4,
      0x0088ff
    ).setStrokeStyle(4, 0x0088ff);

    let positions = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (row === this.emptyPos.row && col === this.emptyPos.col) continue;
        positions.push({ row, col });
      }
    }

    // Shuffle positions
    const easySwapCount = 2;
    for (let i = 0; i < easySwapCount; i++) {
      const a = Math.floor(Math.random() * positions.length);
      let b;
      do {
        b = Math.floor(Math.random() * positions.length);
      } while (b === a);
      [positions[a], positions[b]] = [positions[b], positions[a]];
    }

    this.grid = Array(gridSize).fill().map(() => Array(gridSize).fill(null));

    let index = 0;
    for (let origRow = 0; origRow < gridSize; origRow++) {
      for (let origCol = 0; origCol < gridSize; origCol++) {
        if (origRow === this.emptyPos.row && origCol === this.emptyPos.col)
          continue;

        const shuffledPos = positions[index++];
        const x = this.getTileX(shuffledPos.col);
        const y = this.getTileY(shuffledPos.row);

        const container = this.add.container(x, y)
          .setSize(tileSize, tileSize)
          .setInteractive(new Phaser.Geom.Rectangle(0, 0, tileSize, tileSize), Phaser.Geom.Rectangle.Contains);

        // Background tile
        const tileBackground = this.add.rectangle(0, 0, tileSize, tileSize, 0x0088ff).setOrigin(0.5);
        container.add(tileBackground);

        // Puzzle image
        const tileIndex = origRow * this.gridSize + origCol + 1;
        const tile = this.add.image(0, 0, `puzzle${tileIndex}`)
          .setDisplaySize(tileSize - 2, tileSize - 2)
          .setOrigin(0.5);
        container.add(tile);

        // Border
        const border = this.add.rectangle(0, 0, tileSize, tileSize, 0x000000, 0)
          .setStrokeStyle(1, 0xffffff);
        container.add(border);

        container.setSize(tileSize, tileSize);
        container.setInteractive({ useHandCursor: true });
        this.input.setDraggable(container);

        container.gridPos = { row: shuffledPos.row, col: shuffledPos.col };
        container.originalPos = { row: origRow, col: origCol };
        container.tileIndex = tileIndex;

        this.tiles.push(container);
        this.grid[shuffledPos.row][shuffledPos.col] = container;
      }
    }

    // Empty tile
    const emptyTile = this.add.rectangle(
      this.getTileX(this.emptyPos.col),
      this.getTileY(this.emptyPos.row),
      this.tileSize,
      this.tileSize,
      0xFFFFFF
    );

    // Calculate button positions (right side of puzzle)
    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonX = startX + tileSize * gridSize + buttonWidth / 2 + 20; // Right of puzzle with 20px padding
    const buttonY = startY + tileSize * gridSize / 2 - buttonHeight; // Center vertically

    // Check result button
    const checkButton = this.add.rectangle(buttonX, buttonY, buttonWidth, buttonHeight, 0xff9800)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(2, 0xc87030);

    this.add.text(buttonX, buttonY, "Check result", {
      fontFamily: "Arial",
      fontSize: "20px",
      color: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5);

    checkButton.on('pointerover', () => checkButton.setFillStyle(0xffb070));
    checkButton.on('pointerout', () => checkButton.setFillStyle(0xff9800));
    checkButton.on('pointerdown', () => {
      clickSound.play()
      this.checkWin()
    });

    // Help button (below check button)
    const helpButton = this.add.rectangle(buttonX, buttonY + 70, buttonWidth, buttonHeight, 0x60a0f0)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(2, 0x305080);

    this.add.text(buttonX, buttonY + 70, "Help", {
      fontFamily: "Arial",
      fontSize: "20px",
      color: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5);

    helpButton.on('pointerover', () => helpButton.setFillStyle(0x70b0ff));
    helpButton.on('pointerout', () => helpButton.setFillStyle(0x60a0f0));
    helpButton.on('pointerdown', () => {
      clickSound.play()
      this.showHelp()
    });

    // Drag Events
    this.input.on("dragstart", (pointer, gameObject) => {
      gameObject.setAlpha(0.7);
    });

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on("dragend", (pointer, gameObject) => {
      gameObject.setAlpha(1);

      const { row, col } = gameObject.gridPos;
      const dx = Math.abs(col - this.emptyPos.col);
      const dy = Math.abs(row - this.emptyPos.row);

      this.input.on("dragend", (pointer, gameObject) => {
        gameObject.setAlpha(1);

        const { row, col } = gameObject.gridPos;

        // Posisi target (kotak kosong)
        const newX = this.getTileX(this.emptyPos.col);
        const newY = this.getTileY(this.emptyPos.row);

        const oldEmpty = { ...this.emptyPos };
        this.emptyPos = { ...gameObject.gridPos };
        gameObject.gridPos = { ...oldEmpty };

        this.grid[oldEmpty.row][oldEmpty.col] = gameObject;
        this.grid[this.emptyPos.row][this.emptyPos.col] = null;

        // Update posisi tile kosong
        emptyTile.x = this.getTileX(this.emptyPos.col);
        emptyTile.y = this.getTileY(this.emptyPos.row);

        this.sound.play('swipe', {
          volume: 6
        });

        this.tweens.add({
          targets: gameObject,
          x: newX,
          y: newY,
          duration: 200,
          ease: 'Power2'
        });
      });
    });
  }

  showHelp() {
    const clickSound = this.sound.add('klik');
    const width = this.scale.width;
    const height = this.scale.height;

    const overlay = this.add.rectangle(width / 2, height / 2, width * 0.8, height * 0.6, 0x000000, 0.8).setDepth(20);

    const helpText = this.add.text(width / 2, height / 2 - 40,
      "🎯 Tujuan:\nSusun potongan-potongan gambar hingga membentuk gambar utuh.\n\n🕹️ Cara Bermain:\nGeser ubin ke arah ruang kosong.\nUlangi sampai semua ubin berada di posisi semestinya.\n\n💡 Tips:\nMulai dari baris atas lalu susun ke bawah.",
      {
        fontFamily: "Arial",
        fontSize: "18px",
        color: "#ffffff",
        align: "left",
        wordWrap: { width: width * 0.7 }
      }).setOrigin(0.5).setDepth(21);

    const closeButton = this.add.rectangle(width / 2, height / 2 + height * 0.25 - 30, 120, 40, 0xff4444)
      .setInteractive().setDepth(22);

    const closeButtonText = this.add.text(closeButton.x, closeButton.y, "Tutup", {
      fontFamily: "Arial",
      fontSize: "20px",
      color: "#ffffff"
    }).setOrigin(0.5).setDepth(23);

    closeButton.on("pointerover", () => closeButton.setFillStyle(0xff6666));
    closeButton.on("pointerout", () => closeButton.setFillStyle(0xff4444));
    closeButton.on("pointerdown", () => {
      clickSound.play();
      overlay.destroy();
      helpText.destroy();
      closeButton.destroy();
      closeButtonText.destroy();
    });
  }

  getTileX(col) {
    return this.startX + col * this.tileSize + this.tileSize / 2;
  }

  getTileY(row) {
    return this.startY + row * this.tileSize + this.tileSize / 2;
  }

  update(time, delta) {
    this.elapsedTime += delta / 1000;

    const minutes = Math.floor(this.elapsedTime / 60);
    const seconds = Math.floor(this.elapsedTime % 60);
    const timeString = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    this.timeText.setText(timeString);
  }

  checkWin() {
    let isWin = true;

    for (let tile of this.tiles) {
      const { row, col } = tile.gridPos;
      const { row: origRow, col: origCol } = tile.originalPos;
      const currentImageKey = tile.list[1].texture.key;
      const correctImageKey = `puzzle${tile.tileIndex}`;

      if (row !== origRow || col !== origCol ||
        currentImageKey !== correctImageKey ||
        tile.list[1].angle % 360 !== 0) {
        isWin = false;
        break;
      }
    }

    if (isWin) {
      const centerX = this.scale.width / 2;
      const centerY = this.scale.height / 2;

      this.add.rectangle(centerX, centerY, this.scale.width * 0.7, this.scale.height * 0.4, 0x000000, 0.9).setDepth(10);

      this.add.text(centerX, centerY - 20, `Selamat!\nAnda Menyelesaikan Puzzle!`, {
        fontFamily: 'Arial',
        fontSize: `${Math.floor(this.scale.height * 0.04)}px`,
        color: '#ffffff',
        align: 'center',
        lineSpacing: 10
      }).setOrigin(0.5).setDepth(11);

      this.add.text(centerX, centerY + 30, `Waktu: ${Math.floor(this.elapsedTime)} detik`, {
        fontFamily: 'Arial',
        fontSize: `${Math.floor(this.scale.height * 0.035)}px`,
        color: '#ffff00',
        align: 'center'
      }).setOrigin(0.5).setDepth(11);

      const restartButton = this.add.rectangle(centerX, centerY + 80, 200, 50, 0x4CAF50).setDepth(11).setInteractive();
      this.add.text(centerX, centerY + 80, 'Next', {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#ffffff'
      }).setOrigin(0.5).setDepth(12);

      restartButton.on('pointerover', () => restartButton.setFillStyle(0x45a049));
      restartButton.on('pointerout', () => restartButton.setFillStyle(0x4CAF50));
      restartButton.on('pointerdown', () => {
        this.sound.stopByKey('puz')
        this.scene.start('TekaTeki')
      });
    } else {
      const centerX = this.scale.width / 2;
      const centerY = this.scale.height / 2;

      const messageBox = this.add.rectangle(centerX, centerY, 400, 150, 0x000000, 0.8).setDepth(10);

      const messageText = this.add.text(centerX, centerY, "Puzzle belum selesai!\nCoba lagi.", {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#ffffff',
        align: 'center'
      }).setOrigin(0.5).setDepth(11);

      this.time.delayedCall(2000, () => {
        this.tweens.add({
          targets: [messageBox, messageText],
          alpha: 0,
          duration: 500,
          onComplete: () => {
            messageBox.destroy();
            messageText.destroy();
          }
        });
      });
    }
  }
}