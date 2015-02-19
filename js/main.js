window.onload = function() {    
    "use strict";
    var game = new Phaser.Game(
                                800, 600,           // Width, height of game in px
                                Phaser.AUTO,        // Graphic rendering
                                'game',     
                                { preload: preload, // Preload function
                                  create: create,   // Creation function
                                  update: update }  // Update function
                               );

    var maze;
    var walls;
    var policeman;
    var cursors;
    var shootButton;
    var grudges;
    var slime;
    var slimeBullets;
    var explosion;
    var grudgeNum = 15;
    var firePower = 0;
    var grudgesGotten = 0;
    var fireRate = 1000;
    var nextFire = 0;
    var lifeNum = 3;
    var explosion;
    var power;
    var g;
    var win;
    var lives;
    var bg;
    var grabSlime;
    var hitGrudge;
    var loseLife;
    
    function preload() {
        game.load.image('tiles_sheet', 'assets/img/tiles_spritesheet.png');
        game.load.tilemap('map_json', 'assets/map/maze.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('bg', 'assets/img/bg.png');
        
        game.load.image('cop', 'assets/img/policeman.png');
        
        game.load.image('grudge', 'assets/img/grudge.png');
        game.load.image('slime', 'assets/img/slime.png');
        game.load.image('squashed', 'assets/img/slimeDead.png');
        
        game.load.image('explode', 'assets/img/heartFull.png');
        
        game.load.audio('background', ['assets/audio/bg.mp3'], ['assets/audio/bg.ogg']);
        game.load.audio('grabSlime', ['assets/audio/grabSlime.mp3', 'assets/audio/grabSlime.ogg']);
        game.load.audio('hitGrudge', ['assets/audio/hitGrudge.mp3', 'assets/audio/hitGrudge.ogg']);
        game.load.audio('loseLife', ['assets/audio/loseLife.mp3', 'assets/audio/loseLife.ogg']);
    }
    
    function audioStartUp() {
        // Load background music
        bg = game.add.audio('background', 1, true);
        bg.play('', 0, 1, true);
        
        grabSlime = game.add.audio('grabSlime');
        hitGrudge = game.add.audio('hitGrudge');
        loseLife = game.add.audio('loseLife');
    }
    
    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        audioStartUp();
        
        game.add.tileSprite(0, 0, 2100, 2100, 'bg');
        
        maze = game.add.tilemap('map_json');
        maze.addTilesetImage('tiles_spritesheet', 'tiles_sheet');
        walls = maze.createLayer("Tile Layer 1");
        walls.resizeWorld();
        maze.setCollisionByExclusion([]);
        
        generateGrudges();
        generateSlime();
        fontSet();
                
        policeman = game.add.sprite(50, 1990, 'cop');
        policeman.anchor.set(0.5);
        game.physics.enable(policeman, Phaser.Physics.ARCADE);
        policeman.body.collideWorldBounds = true;       
        game.camera.follow(policeman);
        
        slimeBullets = game.add.group();
        slimeBullets.enableBody = true;
        slimeBullets.physicsBodyType = Phaser.Physics.ARCADE;
        slimeBullets.createMultiple(60, 'squashed');
        slimeBullets.setAll('anchor.x', 0.5);
        slimeBullets.setAll('anchor.y', 0.5);
        slimeBullets.setAll('outOfBoundsKill', true);
        slimeBullets.setAll('checkWorldBounds', true);
        
        policeman.bringToTop();
        
        // Create the controls
        cursors = game.input.keyboard.createCursorKeys();
        shootButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    }
    
    function fontSet() {
        power = game.add.text(0, 0, "Firepower: " + firePower);
        power.fixedToCamera = true;
        power.cameraOffset.x = 10;
        power.cameraOffset.y = 10;
        power.font = 'Lucida Console';
        
        g = game.add.text(0, 0, "Grudges gotten: " + grudgesGotten + "/" + grudgeNum);
        g.fixedToCamera = true;
        g.cameraOffset.x = 10;
        g.cameraOffset.y = 50;
        g.font = 'Lucida Console';
        
        lives = game.add.text(0, 0, "Lives: " + lifeNum);
        lives.fixedToCamera = true;
        lives.cameraOffset.x = 10;
        lives.cameraOffset.y = 90;
        lives.font = 'Lucida Console';
        
        win = game.add.text(0, 0, "");
        win.fixedToCamera = true;
        win.cameraOffset.x = 400;
        win.cameraOffset.y = 400;
        win.font = 'Lucida Console';
    }
    
    function generateGrudges() {
        grudges = game.add.group();
        grudges.enableBody = true;
        
        // possible starting locations of grudges
        var xloc = [1190, 1890, 770, 280, 1190, 350, 1610, 840, 1960, 1120, 70, 560, 840, 1890, 1050, 560, 70, 70];
        var yloc = [70, 210, 210, 490, 700, 910, 980, 1120, 1260, 1540, 1540, 1610, 1960, 1960, 1050, 210, 280, 1050];
        
        var grudge;
        var num;
        for (var i = 0; i < grudgeNum; i++) {
            num = game.rnd.integerInRange(0, 17);
            grudge = grudges.create(xloc[num], yloc[num], 'grudge');
            grudge.body.immovable = true;
            grudge.body.moves = false;
            grudge.body.collideWorldBounds = true;
        }
    }
    
    function generateSlime() {
        slime = game.add.group();
        slime.enableBody = true;
        
        var s = slime.create(350, 1680, 'slime');
        s.body.immovable = true;
        s.body.moves = false;
        s = slime.create(770, 1890, 'slime');
        s.body.immovable = true;
        s.body.moves = false;
        s = slime.create(910, 980, 'slime');
        s.body.immovable = true;
        s.body.moves = false;
        s = slime.create(1680, 1400, 'slime');
        s.body.immovable = true;
        s.body.moves = false;
        s = slime.create(1960, 910, 'slime');
        s.body.immovable = true;
        s.body.moves = false;
        s = slime.create(1610, 420, 'slime');
        s.body.immovable = true;
        s.body.moves = false;
    }
    
    function explode(policeman, grudge) {     
        explosion = game.add.emitter(grudge.x, grudge.y);
        explosion.makeParticles('explode', 1, 1, false, false);
        explosion.explode(500, 1);
    }
    
    function collectGrudge(policeman, grudge) {
        hitGrudge.play();
        explode(policeman, grudge);
        grudge.destroy();
        grudgesGotten = grudgesGotten + 1;
        g.text = "Grudges gotten: " + grudgesGotten + "/" + grudgeNum;
        
        if (grudgesGotten === grudgeNum) {
            win.text = "YOU WIN!";
        }
    }
    
    function slimeSquash(policeman, s) {
        grabSlime.play();
        s.kill();
        firePower = firePower + 4;
        power.text = "Firepower: " + firePower;
    }
    
    function releaseFire() {
        if (game.time.now > nextFire && slimeBullets.countDead() > 0 && firePower > 0) {
            nextFire = game.time.now + fireRate;

            var bullet = slimeBullets.getFirstExists(false);
            bullet.reset(policeman.x, policeman.y);
            bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 500);
            
            firePower = firePower - 1;
            power.text = "Firepower: " + firePower;
        }
    }
    
    function atStart() {
        lifeNum = lifeNum - 1;
        lives.text = "Lives: " + lifeNum;
        if (lifeNum <= 0) {
            win.text = "YOU LOSE!";
        }
    }
    
    function die() {
        policeman.body.velocity.x = 0;
        policeman.body.velocity.y = 0;
        policeman.x = 50;
        policeman.y = 1990;
        loseLife.play();
        atStart();
    }

    function update() {
    
        game.physics.arcade.collide(policeman, walls);
        game.physics.arcade.collide(grudges, maze);
        game.physics.arcade.overlap(slimeBullets, grudges, collectGrudge, null, this);
        game.physics.arcade.overlap(policeman, slime, slimeSquash, null, this);
        game.physics.arcade.collide(policeman, grudges, die, null, this);
    
        if (shootButton.isDown) {
            releaseFire();
        }    
        if (cursors.right.isDown && cursors.up.isDown) {
            policeman.body.velocity.y = -300;
        }
        if (cursors.left.isDown && cursors.up.isDown) {
            policeman.body.velocity.y = -300;
        }
        if (cursors.right.isDown) {
            policeman.body.velocity.x = 300;
        }
        else if (cursors.left.isDown) {
            policeman.body.velocity.x = -300;
        }
        else if (cursors.up.isDown) {
            policeman.body.velocity.y = -300;
        }
        else if (cursors.down.isDown) {
            policeman.body.velocity.y = 300;
        }
        else {
            policeman.body.velocity.x = 0;
            policeman.body.velocity.y = 0;
        }
    }
};
