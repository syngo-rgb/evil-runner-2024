// scenes/Preload.js
export default class Preload extends Phaser.Scene {
  constructor() {
    super("preload");
  }

  preload() {
    // Cargar imágenes y spritesheets
    this.load.image("escenario", "./public/assets/images/escenario.png");
    this.load.image("telarana", "./public/assets/images/telarana.png", {
    });
    
    this.load.spritesheet("gas", "./public/assets/images/gas.png", {
      frameWidth: 25, // Ajusta según el tamaño de cada frame de gas
      frameHeight: 66,
    });
    this.load.spritesheet("player", "./public/assets/images/player.png", {
      frameWidth: 111,
      frameHeight: 176,
    });

    // Mostrar barra de carga o texto mientras se cargan los recursos
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    this.loadingText = this.add.text(centerX, centerY, "Loading...", {
      fontSize: "32px",
      fill: "#fff",
    }).setOrigin(0.5);

    // Controlar el evento 'complete' para iniciar la escena del menú
    this.load.on("complete", () => {
      this.loadingText.destroy();
      this.scene.start("menu");
    });
  }

  create() {
    // Configurar la animación del jugador después de que se ha cargado el spritesheet
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 5 }),
      frameRate: 15,
      repeat: -1,
    });



    // Configurar animaciones para gas
    this.anims.create({
      key: 'gas_anim',
      frames: this.anims.generateFrameNumbers('gas', { start: 0, end: 6 }),
      frameRate: 10,
      repeat: -1,
    });
  }
}

    