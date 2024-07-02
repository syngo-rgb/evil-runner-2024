// scenes/Game.js
import { gameOptions } from '../utils/gameOptions.js';

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }

  init() {
    this.firstMove = true;
    this.obstacleTouched = false;
    this.score = -1;
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    this.addBackground();

    // Grupo de obstáculos
    this.obstacleGroup = this.physics.add.group();
      // Agregar temporizador para la creación de obstáculos
    this.obstacleTimer = this.time.addEvent({
      delay: this.getRandomObstacleDelay(),
      callback: this.createObstacle,
      callbackScope: this,
      loop: true
    });

    // Crear el jugador en una posición visible y sin gravedad
    const positionX = this.game.config.width / 2;
    const positionY = this.game.config.height - 100;

    this.player = this.physics.add.sprite(positionX, positionY, "player");
    this.player.setScale(0.8);
    this.player.body.setAllowGravity(false); // Desactivar gravedad
    this.player.setCollideWorldBounds(true); // Evitar que salga de los límites del mundo

    // Asegurarse de que la animación 'run' exista antes de reproducirla
    if (this.anims.exists('run')) {
      this.player.play('run');
    } else {
      console.error("La animación 'run' no se ha cargado correctamente.");
    }

    this.parallaxLayers = [{
      speed: gameOptions.velocityBackground,
      sprite: this.background,
    }];

    this.cursor = this.input.keyboard.createCursorKeys();

    this.textTimer = this.add.text(10, 10, "0", {
      fontSize: "32px",
      fill: "#fff",
    });

    this.textScore = this.add.text(this.game.config.width - 10, 10, "0", {
      fontSize: "32px",
      fill: "#fff",
    }).setOrigin(1, 0);

    this.textFirstMove = this.add.text(positionX, 300, "Press arrow keys to start", {
      fontSize: "32px",
      fill: "#fff",
    }).setOrigin(0.5, 0);

    this.physics.add.collider(this.obstacleGroup, this.player, this.handleCollision, null, this);

    // Comenzar a crear obstáculos después de 3 segundos desde el primer movimiento del jugador
    this.time.delayedCall(3000, this.startGame, [], this);
  }


  startGame() {
    if (this.firstMove) {
      this.firstMove = false;
      this.addTimer();
      this.textFirstMove.setText("");
      // Crear un obstáculo inicial
      this.createObstacle();
      // Configurar un temporizador para crear obstáculos periódicamente
      this.obstacleTimer = this.time.addEvent({
        delay: 8000, // Intervalo de tiempo entre la creación de obstáculos (en milisegundos)
        callback: this.createObstacle,
        callbackScope: this,
        loop: true // Repetir el temporizador indefinidamente
      });
    }
  }

  update() {
    this.obstacleGroup.getChildren().forEach(function (obstacle) {
      // Mover obstáculos hacia abajo con la misma velocidad que el fondo
      obstacle.y += gameOptions.velocityBackground;

      // Reposicionar obstáculos cuando salen de la pantalla
      if (obstacle.getBounds().top > this.game.config.height) {
        this.positionObstacle(obstacle);
      }
    }, this);

    if (this.player.body.touching.none) {
      this.obstacleTouched = false;
    }

    // Reiniciar la escena si el jugador sale de los límites de la pantalla
    if (this.player.y > this.game.config.height || this.player.y < 0) {
      this.scene.start("game");
    }

    this.movePlayer();
    this.moveParallax();
  }

  movePlayer() {
    const minX = 310; // Límite mínimo en el eje X
    const maxX = this.game.config.width - 310; // Límite máximo en el eje X

    if (this.cursor.right.isDown) {
      this.player.setVelocityX(300);
      this.startGame();
    } else if (this.cursor.left.isDown) {
      this.player.setVelocityX(-300);
      this.startGame();
    } else {
      this.player.setVelocityX(0);
    }

    // Asegurarse de que el jugador no se salga de los límites
    if (this.player.x < minX) {
      this.player.x = minX;
    } else if (this.player.x > maxX) {
      this.player.x = maxX;
    }
  }

  moveParallax() {
    this.parallaxLayers.forEach((layer) => {
      layer.sprite.tilePositionY -= layer.speed;
    });
  }

  addBackground() {
    this.centerX = this.game.config.width;
    this.centerY = this.game.config.height;

    // Ajustar la imagen del fondo para que mantenga la proporción
    this.background = this.add.tileSprite(
      this.game.config.width - 510,
      this.game.config.height - 384,
      this.game.config.width,
      this.game.config.height,
      "escenario");

    this.background.setOrigin(0.5, 0.5);

    let scaleX = this.game.config.width / this.background.width;
    let scaleY = this.game.config.height / this.background.height;
    let scale = Math.max(scaleX, scaleY);

    this.background.setScale(scale);
  }

  randomValue(a) {
    return Phaser.Math.Between(a[0], a[1]);
  }

  getLowestObstacle() {
    let lowestObstacle = 0;
    const hijos = this.obstacleGroup.getChildren();

    hijos.forEach(function (obstacle) {
      lowestObstacle = Math.max(lowestObstacle, obstacle.y);
    });
    return lowestObstacle;
  }

  positionObstacle(obstacle) {
      obstacle.y = -obstacle.height / 4; // Colocar en la parte superior de la pantalla
      obstacle.x =
        this.game.config.width / 1.7 +
        this.randomValue(gameOptions.platformHorizontalDistanceRange) *
        Phaser.Math.RND.sign();
    }

  addTimer() {
    this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });
  }

  updateTimer() {
    this.textTimer.setText(parseInt(this.textTimer.text) + 1);
  }

  handleCollision(player, obstacle) {
    if (!this.obstacleTouched) {
      this.obstacleTouched = true;
      this.score += 1;
      this.textScore.setText(this.score);
    }
  }

  getRandomObstacleDelay() {
    // Generar un delay aleatorio para la creación de obstáculos entre dos valores
    return Phaser.Math.Between(8000, 16000); // Intervalo de 2 a 4 segundos
  }

  createObstacle() {
    let obstacleType = Phaser.Math.Between(0, 1) === 0 ? "telarana" : "gas";
    let obstacle = this.obstacleGroup.create(0, 0, obstacleType);

    // Reproducir la animación según el tipo de obstáculo
    if (obstacleType === "gas") {
      obstacle.setScale(5); // Ajusta el tamaño del sprite de gas
      obstacle.play('gas_anim');
    }

    obstacle.setImmovable(true);
    this.positionObstacle(obstacle);
  }
}
