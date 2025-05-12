export class PreparationScene extends Phaser.Scene {
  constructor() {
    super("PreparationScene");
  }
  
  preload() {
    this.load.audio('prepar', 'music/prepar.mp3');
    this.load.audio("klik", 'music/klik.wav');
    this.load.image("1", "assets/1.png");
    this.load.video('2', "assets/2.mp4");
    this.load.image("3", "assets/3.png");
    this.load.image("4", "assets/4.png");
    this.load.image("5", "assets/5.png");
    this.load.image("6", "assets/6.png");
    this.load.image("7", "assets/7.png");
    this.load.image("8", "assets/8.png");
    this.load.image("9", "assets/9.png");
    this.load.image("10", "assets/10.png");
    this.load.image("11", "assets/11.png");
    this.load.image("12", "assets/12.png");
    this.load.image("13", "assets/13.png");
    this.load.image("14", "assets/14.png");
    this.load.image("15", "assets/15.png");
    this.load.image("16", "assets/16.png");
    this.load.image("17", "assets/17.png");
    this.load.image("18", "assets/18.png");
    this.load.image("19", "assets/19.png");
    this.load.image("20", "assets/20.png");
    
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

    // Add a background color or image
    this.add.rectangle(0, 0, width, height, 0x4a6fa5).setOrigin(0);
    
    const slides = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
    let currentIndex = 0;
    let currentMedia;

    // Function to display the current slide
    const showCurrentSlide = () => {
      if (currentMedia) {
        currentMedia.destroy();
      }

      const slideKey = slides[currentIndex];

      if (slideKey === '2') {
        if (isBgmPlaying) {
          this.sound.stopByKey('prepar');
          isBgmPlaying = false;
        }

        currentMedia = this.add.video(width / 2, height * 0.45, '2')
          .setOrigin(0.5)
          .on('play', function () {
            currentMedia.setDisplaySize(width * 0.6, height * 0.6);
          });


        currentMedia.play(true);
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
    };

    // Initial slide display
    showCurrentSlide();

    // Add a panel for the title
    // const titlePanel = this.add.rectangle(width / 2, height * 0.1, width * 0.6, height * 0.1, 0xffffff, 0.2)
    //   .setStrokeStyle(2, 0xffffff);
    
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

    // Arrow Buttons with better styling
    // const arrowSize = height * 0.08;

      const leftBtn = this.add.graphics();
    drawArrow(leftBtn, 0, 0, arrowSize, arrowSize, arrowColor, Math.PI);
    leftBtn.setPosition(width * 0.1, height / 2);
    leftBtn.setInteractive(new Phaser.Geom.Triangle(), Phaser.Geom.Triangle.Contains);

    // Right Arrow Button
    const rightBtn = this.add.graphics();
    drawArrow(rightBtn, 0, 0, arrowSize, arrowSize, arrowColor, 0);
    rightBtn.setPosition(width * 0.9, height / 2);
    rightBtn.setInteractive(new Phaser.Geom.Triangle(), Phaser.Geom.Triangle.Contains);

    // Left Button
    // const leftBtn = this.add.image(width * 0.1, height / 2, 'arrow')
    //   .setDisplaySize(arrowSize, arrowSize)
    //   .setFlipX(true)
    //   .setInteractive();
    
    // // Right Button
    // const rightBtn = this.add.image(width * 0.9, height / 2, 'arrow')
    //   .setDisplaySize(arrowSize, arrowSize)
    //   .setInteractive();

     function drawArrow(graphics, x, y, width, height, color, rotation) {
      graphics.clear();
      graphics.fillStyle(color);
      graphics.lineStyle(2, 0x000000, 0.5);
      
      graphics.save();
      graphics.translateCanvas(x, y);
      graphics.rotateCanvas(rotation);
      
      graphics.beginPath();
      graphics.moveTo(width/2, 0);
      graphics.lineTo(0, height);
      graphics.lineTo(width, height);
      graphics.closePath();
      graphics.fillPath();
      graphics.strokePath();
      
      graphics.restore();
    }

    // Play Button dengan efek modern
    const playBtn = this.add.graphics();
    const playBtnWidth = width * 0.2;
    const playBtnHeight = height * 0.08;
    
    // Fungsi untuk menggambar button
    const drawPlayButton = (color, yOffset = 0) => {
      playBtn.clear();
      
      // Shadow
      playBtn.fillStyle(0x000000, 0.3);
      playBtn.fillRoundedRect(
        width/2 - playBtnWidth/2 + 3, 
        height * 0.8 - playBtnHeight/2 + yOffset + 3, 
        playBtnWidth, 
        playBtnHeight, 
        10
      );
      
      // Button
      playBtn.fillStyle(color);
      playBtn.lineStyle(2, 0xffffff, 0.8);
      playBtn.fillRoundedRect(
        width/2 - playBtnWidth/2, 
        height * 0.8 - playBtnHeight/2 + yOffset, 
        playBtnWidth, 
        playBtnHeight, 
        10
      );
      playBtn.strokeRoundedRect(
        width/2 - playBtnWidth/2, 
        height * 0.8 - playBtnHeight/2 + yOffset, 
        playBtnWidth, 
        playBtnHeight, 
        10
      );
      
      // Highlight
      playBtn.fillStyle(0xffffff, 0.2);
      playBtn.fillRoundedRect(
        width/2 - playBtnWidth/2 + 2, 
        height * 0.8 - playBtnHeight/2 + yOffset + 2, 
        playBtnWidth - 4, 
        playBtnHeight * 0.5, 
        8
      );
    };

    drawPlayButton(0xf97316);
    playBtn.setInteractive(
      new Phaser.Geom.Rectangle(
        width/2 - playBtnWidth/2, 
        height * 0.8 - playBtnHeight/2, 
        playBtnWidth, 
        playBtnHeight
      ), 
      Phaser.Geom.Rectangle.Contains
    );

    // Button hover effects
    const setButtonHover = (btn, color, hoverColor, drawFunc) => {
      btn.on("pointerover", () => {
        drawFunc(hoverColor, -2); // Sedikit naik saat hover
        this.input.setDefaultCursor("pointer");
      });
      btn.on("pointerout", () => {
        drawFunc(color, 0);
        this.input.setDefaultCursor("default");
      });
    };
    

    setButtonHover(leftBtn, arrowColor, arrowHoverColor, (color) => {
      drawArrow(leftBtn, 0, 0, arrowSize, arrowSize, color, Math.PI);
    });
    
    setButtonHover(rightBtn, arrowColor, arrowHoverColor, (color) => {
      drawArrow(rightBtn, 0, 0, arrowSize, arrowSize, color, 0);
    });
    
    setButtonHover(playBtn, 0xf97316, 0xff8c00, drawPlayButton);

    // Button hover effects
    // const setButtonHover = (btn) => {
    //   btn.on("pointerover", () => {
    //     btn.setScale(1.1);
    //     this.input.setDefaultCursor("pointer");
    //   });
    //   btn.on("pointerout", () => {
    //     btn.setScale(1);
    //     this.input.setDefaultCursor("default");
    //   });
    // };
    setButtonHover(leftBtn);
    setButtonHover(rightBtn);

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

    // Play Button with better styling
    // const playBtn = this.add.image(width / 2, height * 0.8, 'button')
    //   .setDisplaySize(width * 0.2, height * 0.08)
    //   .setInteractive();
    
    this.add.text(width / 2, height * 0.8, "Play", {
      fontFamily: "'Arial Black', Arial, sans-serif",
      fontSize: `${height * 0.035}px`,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 3
    }).setOrigin(0.5);

    setButtonHover(playBtn);
    playBtn.on("pointerdown", () => {
      clickSound.play();
      playBtn.setScale(0.95);
      this.time.delayedCall(100, () => {
        playBtn.setScale(1);
        this.sound.stopByKey('prepar');
        this.scene.start("Puzzle");
      });
    });

    // Add page indicator
    // const updatePageIndicator = () => {
    //   if (this.pageIndicator) {
    //     this.pageIndicator.destroy();
    //   }
    //   this.pageIndicator = this.add.text(
    //     width / 2, 
    //     height * 0.75, 
    //     `${currentIndex + 1}/${slides.length}`, 
    //     {
    //       fontFamily: "Arial, sans-serif",
    //       fontSize: `${Math.floor(height * 0.025)}px`,
    //       color: "#ffffff"
    //     }
    //   ).setOrigin(0.5);
    // };
    
    // updatePageIndicator();
    this.showCurrentSlide = showCurrentSlide;
    this.updatePageIndicator = updatePageIndicator;
  }
}