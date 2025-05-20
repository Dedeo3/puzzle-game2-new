export class PreparationScene extends Phaser.Scene {
  constructor() {
    super("PreparationScene");
  }

  preload() {
    this.load.audio('prepar', 'music/prepar.mp3');
    this.load.audio("klik", 'music/klik.wav');
    this.load.image("1", "assets/1.png");
    this.load.video('2', "assets/2.mp4");
    this.load.video('3', "assets/video per.mp4")
    this.load.image("4", "assets/3.png");
    this.load.image("5", "assets/4.png");
    this.load.image("6", "assets/5.png");
    this.load.image("7", "assets/6.png");
    this.load.image("8", "assets/7.png");
    this.load.image("9", "assets/8.png");
    this.load.image("10", "assets/9.png");
    this.load.image("11", "assets/10.png");
    this.load.image("12", "assets/11.png");
    this.load.image("13", "assets/12.png");
    this.load.image("14", "assets/13.png");
    this.load.image("15", "assets/14.png");
    this.load.image("16", "assets/15.png");
    this.load.image("17", "assets/16.png");
    this.load.image("18", "assets/17.png");
    this.load.image("19", "assets/18.png");
    this.load.image("20", "assets/19.png");
    this.load.image("21", "assets/20.png");

    // Load additional UI assets
    // this.load.image('panel', 'assets/ui/panel.png'); // A semi-transparent panel for text
    // this.load.image('button', 'assets/ui/button.png'); // A nice button texture
    // this.load.image('arrow', 'assets/ui/arrow.png'); // Arrow buttons
  }

  create() {
    // Play background music
    let isBgmPlaying = true;
    this.sound.play('prepar', {
      loop: true,
      volume: 0.5
    });
    const clickSound = this.sound.add('klik');

    const width = this.scale.width;
    const height = this.scale.height;

    const background = this.add.graphics();
    background.fillGradientStyle(
      0x1a237e, // Dark blue (top)
      0x1a237e, // Dark blue (top)
      0x7e57c2, // Purple (bottom)
      0x7e57c2, // Purple (bottom)
      1
    );
    background.fillRect(0, 0, this.scale.width, this.scale.height);

    const titlePanel = this.add.graphics();
    titlePanel.fillStyle(0xffffff, 0.2);
    titlePanel.lineStyle(2, 0xffffff, 1);
    titlePanel.fillRoundedRect(width * 0.2, height * 0.05, width * 0.6, height * 0.1, 15);
    titlePanel.strokeRoundedRect(width * 0.2, height * 0.05, width * 0.6, height * 0.1, 15);

    const arrowSize = height * 0.08;
    const arrowColor = 0xf97316;
    const arrowHoverColor = 0xff8c00;

    const slides = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21'];
    let currentIndex = 0;
    let currentMedia;

    // Page indicator
    let pageIndicator;

    // Function to update page indicator
    const updatePageIndicator = () => {
      if (pageIndicator) {
        pageIndicator.destroy();
      }
      pageIndicator = this.add.text(
        width / 2,
        height * 0.75,
        `${currentIndex + 1}/${slides.length}`,
        {
          fontFamily: "Arial, sans-serif",
          fontSize: `${Math.floor(height * 0.030)}px`,
          color: "#000000FF",
          fontStyle:'bold'
        }
      ).setOrigin(0.5);
    };

    // Function to display the current slide
    const showCurrentSlide = () => {
      if (currentMedia) {
        currentMedia.destroy();
      }

      const slideKey = slides[currentIndex];

      // Variable for loading text
      let loadingText;

      if (slideKey === '2' || slideKey === '3') {
        if (isBgmPlaying) {
          this.sound.stopByKey('prepar');
          isBgmPlaying = false;
        }

        // 1. Show loading text
        loadingText = this.add.text(width / 2, height * 0.45, 'Loading...', {
          font: '24px Arial',
          color: '#ffffff'
        }).setOrigin(0.5);

        // 2. Add video (without playing immediately)
        currentMedia = this.add.video(width / 2, height * 0.45, slideKey)
          .setOrigin(0.5)
          .on('play', function () {
            // 3. Remove loading text when video starts
            if (loadingText) {
              loadingText.destroy();
            }

            currentMedia.setDisplaySize(width * 0.6, height * 0.6);
          });

        // 4. Play after a slight delay so loading text is visible
        this.time.delayedCall(100, () => {
          currentMedia.play(true);
        });

      } else {
        if (!isBgmPlaying) {
          this.sound.play('prepar', {
            loop: true,
            volume: 0.5
          });
          isBgmPlaying = true;
        }

        currentMedia = this.add.image(width / 2, height * 0.45, slideKey)
          .setDisplaySize(width * 0.6, height * 0.6)
          .setOrigin(0.5);
      }

      // Update page indicator
      updatePageIndicator();

      // Tambahkan tombol ke scene
      const downloadButton = this.add.text(width - 180, height - 60, '📥 Unduh Panduan', {
        fontFamily: 'Arial',
        fontSize: '15px',
        backgroundColor: '#4CAF50',
        color: '#ffffff',
        padding: { left: 12, right: 12, top: 8, bottom: 8 },
        align: 'center',
        fixedWidth: 160,
      })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', function () {
          this.setStyle({ backgroundColor: '#45a049' });
        })
        .on('pointerout', function () {
          this.setStyle({ backgroundColor: '#4CAF50' });
        })
        .on('pointerdown', () => {
          clickSound.play();
          downloadFile();
      });

    };
    function downloadFile() {
      const link = document.createElement('a');
      link.href = 'assets/file/guide.pdf'; // Ganti dengan file panduan kamu
      link.download = 'Panduan_Sistem_Pernapasan.pdf';
      link.click();
    }
    
  

    // Function to draw arrow
    function drawArrow(graphics, x, y, width, height, color, direction) {
      graphics.clear();
      graphics.fillStyle(color);
      graphics.lineStyle(2, 0x000000, 0.5);

      if (direction === 'left') {
        // Left arrow (points to the left)
        graphics.beginPath();
        graphics.moveTo(x, y + height / 2);          // Puncak segitiga (kiri)
        graphics.lineTo(x + width, y);             // Sudut kanan atas
        graphics.lineTo(x + width, y + height);    // Sudut kanan bawah
        graphics.closePath();
      } else {
        // Right arrow (points to the right)
        graphics.beginPath();
        graphics.moveTo(x + width, y + height / 2);  // Puncak segitiga (kanan)
        graphics.lineTo(x, y);                     // Sudut kiri atas
        graphics.lineTo(x, y + height);            // Sudut kiri bawah
        graphics.closePath();
      }

      graphics.fillPath();
      graphics.strokePath();
    }

    // Initial slide display
    showCurrentSlide();

    // Title with better styling
    this.add.text(width / 2, height * 0.08, "Preparation Time", {
      fontFamily: "'Arial Black', Arial, sans-serif",
      fontSize: `${Math.floor(height * 0.045)}px`,
      color: "#ffffff",
      fontStyle: "bold",
      stroke: "#000000",
      strokeThickness: 4,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000',
        blur: 2,
        stroke: true,
        fill: true
      }
    }).setOrigin(0.5);

    // Subtitle with better styling
    this.add.text(width / 2, height * 0.13, "Review the material before starting", {
      fontFamily: "Arial, sans-serif",
      fontSize: `${Math.floor(height * 0.025)}px`,
      color: "#ffffff",
      fontStyle: "italic",
      stroke: "#000000",
      strokeThickness: 2
    }).setOrigin(0.5);

    // Add a decorative divider
    this.add.rectangle(width / 2, height * 0.16, width * 0.4, 2, 0xffffff, 0.5);

    // Subject title (Sistem Pernapasan Manusia)
    const subjectPanel = this.add.rectangle(width / 2, height * 0.9, width * 0.4, height * 0.08, 0xffffff, 0.2)
      .setStrokeStyle(2, 0xffffff);

    this.add.text(width / 2, height * 0.88, "Sistem Pernapasan Manusia", {
      fontFamily: "Arial, sans-serif",
      fontSize: `${Math.floor(height * 0.03)}px`,
      color: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.92, "Kelas 5", {
      fontFamily: "Arial, sans-serif",
      fontSize: `${Math.floor(height * 0.025)}px`,
      color: "#ffffff"
    }).setOrigin(0.5);

    // Create arrow buttons using graphics
    // Left Arrow Button
    const leftBtn = this.add.graphics();
    drawArrow(leftBtn, width * 0.1 - arrowSize / 2, height / 2 - arrowSize / 2, arrowSize, arrowSize, arrowColor, 'left');

    // Create hitbox for left button
    const leftHitbox = new Phaser.Geom.Rectangle(
      width * 0.1 - arrowSize / 2,
      height / 2 - arrowSize / 2,
      arrowSize,
      arrowSize
    );
    leftBtn.setInteractive(leftHitbox, Phaser.Geom.Rectangle.Contains);

    // Right Arrow Button
    const rightBtn = this.add.graphics();
    drawArrow(rightBtn, width * 0.9 - arrowSize / 2, height / 2 - arrowSize / 2, arrowSize, arrowSize, arrowColor, 'right');

    // Create hitbox for right button
    const rightHitbox = new Phaser.Geom.Rectangle(
      width * 0.9 - arrowSize / 2,
      height / 2 - arrowSize / 2,
      arrowSize,
      arrowSize
    );
    rightBtn.setInteractive(rightHitbox, Phaser.Geom.Rectangle.Contains);

    // Play Button with modern effect
    const playBtn = this.add.graphics();
    const playBtnWidth = width * 0.2;
    const playBtnHeight = height * 0.08;

    // Function to draw the button
    const drawPlayButton = (color, yOffset = 0) => {
      playBtn.clear();

      // Shadow
      playBtn.fillStyle(0x000000, 0.3);
      playBtn.fillRoundedRect(
        width / 2 - playBtnWidth / 2 + 3,
        height * 0.8 - playBtnHeight / 2 + yOffset + 3,
        playBtnWidth,
        playBtnHeight,
        10
      );

      // Button
      playBtn.fillStyle(color);
      playBtn.lineStyle(2, 0xffffff, 0.8);
      playBtn.fillRoundedRect(
        width / 2 - playBtnWidth / 2,
        height * 0.8 - playBtnHeight / 2 + yOffset,
        playBtnWidth,
        playBtnHeight,
        10
      );
      playBtn.strokeRoundedRect(
        width / 2 - playBtnWidth / 2,
        height * 0.8 - playBtnHeight / 2 + yOffset,
        playBtnWidth,
        playBtnHeight,
        10
      );

      // Highlight
      playBtn.fillStyle(0xffffff, 0.2);
      playBtn.fillRoundedRect(
        width / 2 - playBtnWidth / 2 + 2,
        height * 0.8 - playBtnHeight / 2 + yOffset + 2,
        playBtnWidth - 4,
        playBtnHeight * 0.5,
        8
      );
    };

    drawPlayButton(0xf97316);
    playBtn.setInteractive(
      new Phaser.Geom.Rectangle(
        width / 2 - playBtnWidth / 2,
        height * 0.8 - playBtnHeight / 2,
        playBtnWidth,
        playBtnHeight
      ),
      Phaser.Geom.Rectangle.Contains
    );

    // Button hover effects for arrows
    leftBtn.on("pointerover", () => {
      drawArrow(leftBtn, width * 0.1 - arrowSize / 2, height / 2 - arrowSize / 2, arrowSize, arrowSize, arrowHoverColor, 'left');
      this.input.setDefaultCursor("pointer");
    });

    leftBtn.on("pointerout", () => {
      drawArrow(leftBtn, width * 0.1 - arrowSize / 2, height / 2 - arrowSize / 2, arrowSize, arrowSize, arrowColor, 'left');
      this.input.setDefaultCursor("default");
    });

    rightBtn.on("pointerover", () => {
      drawArrow(rightBtn, width * 0.9 - arrowSize / 2, height / 2 - arrowSize / 2, arrowSize, arrowSize, arrowHoverColor, 'right');
      this.input.setDefaultCursor("pointer");
    });

    rightBtn.on("pointerout", () => {
      drawArrow(rightBtn, width * 0.9 - arrowSize / 2, height / 2 - arrowSize / 2, arrowSize, arrowSize, arrowColor, 'right');
      this.input.setDefaultCursor("default");
    });

    // Play button hover effects
    playBtn.on("pointerover", () => {
      drawPlayButton(0xff8c00, -2); // Slightly raised on hover
      this.input.setDefaultCursor("pointer");
    });

    playBtn.on("pointerout", () => {
      drawPlayButton(0xf97316, 0);
      this.input.setDefaultCursor("default");
    });

    // Navigation functions
    const goToPreviousSlide = () => {
      clickSound.play();
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      showCurrentSlide();
    };

    const goToNextSlide = () => {
      clickSound.play();
      currentIndex = (currentIndex + 1) % slides.length;
      showCurrentSlide();
    };

    // Button events
    leftBtn.on("pointerdown", goToPreviousSlide);
    rightBtn.on("pointerdown", goToNextSlide);

    // Keyboard navigation
    this.input.keyboard.on('keydown-LEFT', goToPreviousSlide);
    this.input.keyboard.on('keydown-RIGHT', goToNextSlide);

    this.add.text(width / 2, height * 0.8, "Play", {
      fontFamily: "'Arial Black', Arial, sans-serif",
      fontSize: `${height * 0.035}px`,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 3
    }).setOrigin(0.5);

    playBtn.on("pointerdown", () => {
      clickSound.play();
      drawPlayButton(0xf97316, 2); // Press down effect
      this.time.delayedCall(100, () => {
        drawPlayButton(0xf97316, 0);
        this.sound.stopByKey('prepar');
        this.scene.start("Puzzle");
      });
    });
  }
}