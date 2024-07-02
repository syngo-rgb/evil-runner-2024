import Game from "./scenes/Game.js";
import Preload from "./scenes/Preload.js";
import Menu from "./scenes/Menu.js";

const config = {
  type: Phaser.AUTO,
  width: 1024, // Ancho ajustado para PC
  height: 768, // Alto ajustado para PC
  backgroundColor: 0x444444,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  pixelArt: true,
  scene: [Preload, Menu, Game],
};

window.game = new Phaser.Game(config);
