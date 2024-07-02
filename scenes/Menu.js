export default class Menu extends Phaser.Scene {
  constructor() {
    super("menu");
  }

  preload() {
    this.load.image("menuBackground", "./public/assets/images/menuBackground.png");
  }

  create() {
    const gameWidth = this.game.config.width;
    const gameHeight = this.game.config.height;
    const centerX = gameWidth / 2;
    const centerY = gameHeight / 2;

    const background = this.add.image(centerX, centerY, "menuBackground");
    background.setDisplaySize(gameWidth, gameHeight);

    const startText = this.add.text(centerX, centerY, "Press ENTER to Start", {
      fontSize: "42px",
      fill: "#fff",
    }).setOrigin(0.5, 0.5);

    startText.setInteractive();
    startText.on("pointerdown", () => {
      this.scene.start("game");
    });

    this.input.keyboard.on("keydown-ENTER", () => {
      this.scene.start("game");
    });
  }
}
