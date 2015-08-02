// Start enchant.js
enchant();
 
window.onload = function() 
{
    // Starting point
    var agent = navigator.userAgent;
    var v_width = screen.width/2;
    var v_height = screen.height/2;
    var isAndroid = (agent.indexOf("Android") > 0);
    if (isAndroid)
    {
        v_width = screen.width;
        v_height = screen.height;
    }
    
    var game = new Game(v_width, v_height);
    game.preload('res/BG.png',
                 'res/BGfPC.png',
                 'res/pinguinSheet.png',
                 'res/pinguinSheet2.png',
                 'res/Ice.png',
                 'res/start.png',
                 'res/end.png',
                 'res/BG_Over.png'
                 );
    game.fps = 60;
    game.scale = 1;
    game.onload = function() 
    {
        game.keybind(68, 'right'); // бинд клавиш управления
        game.keybind(65, 'left');
        game.keybind(39, 'right2');
        game.keybind(37, 'left2');
        game.keybind(27, 'back');
        // Once Game finish loading
    var scene = new SceneStartGame();
    game.pushScene(scene);
    };
    game.start();


     var SceneStartGame = Class.create(Scene, 
    {
        initialize: function() 
            {
                var game, start, Info, Exit;
                game = Game.instance;
                Scene.apply(this);

                start = new Button("","dark");
                start._style.height = "3.5em";
                start._style.width = "18em";
                start._style.background = "url('start.png')";
                start.x = game.width/4;
                start.y = game.height/4;
            
                start.addEventListener("touchstart", this.touchToStart);

                Info = new Button("Info","light");
                Info._style.height = "2em";
                Info._style.width = "4em";
                Info.x = game.width/2.7;

                start.addEventListener("touchstart", this.touchToInfo);

                Exit = new Botton("Exit","light");
                Exit._style.height = "2em";
                Exit._style.width = "4em";

                Exit.x = 0;
                Exit.y = 0;
                
                Exit.addEventListener("touchstart", this.touchToExit);
               
                this.addChild(start);
                this.addChild(Info);
                this.addChild(Exit);

            },

        touchToStart: function(evt) 
        {
            var game = Game.instance;
            game.replaceScene(new SceneGame());
        },
        touchToInfo: function(evt) 
        {
            var game = Game.instance;
            game.replaceScene(new SceneInfoGame());
        },
        touchToExit: function(evt) 
        {
            var game = Game.instance;
            game.break;
        },
    });
    var SceneInfoGame = Class.create(Scene, 
    {
        initialize: function() 
        {
                var game,  back;
                game = Game.instance;
                Scene.apply(this);

                var Aboutlabel = new Label("Hello, world.");
                Aboutlabel.x = 40;
                Aboutlabel.y = 100;

                var Controlslabel = new Label("Hello, world.");
                Controlslabel.x = 40;
                Controlslabel.y = 100;

                var Autorlabel = new Label("Hello, world.");
                Autorlabel.x = 40;
                Autorlabel.y = 100;

                back = new Button("back","light");
            back.addEventListener("touchstart", this.touchToBack);

            this.addChild(back);
            this.addChild(Aboutlabel);
            this.addChild(Controlslabel);
            this.addChild(Autorlabel);
        
        },
        touchToBack: function(evt) 
        {
            var game = Game.instance;
            game.replaceScene(new SceneStartGame());
        },

    });


    var SceneGame = Class.create(Scene, 
    {
        initialize: function() 
        {
            var game, label, bg, pinguin, pinguin2, iceGroup, back;
     
            // Call superclass constructor
            Scene.apply(this);
     
            // Access to the game singleton instance
            game = Game.instance;


     
            label = new Label('SCORE<br>0');
            label.x = game.width/3.6;
            label.y = 32;        
            label.color = 'white';
            label.font = '16px strong';
            label.textAlign = 'center';
            label._style.textShadow ="-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black";
            this.scoreLabel = label;

     
            bg = new Sprite(v_width, v_height);
            if (isAndroid)
            {
               bg.image = game.assets["res/BG.png"];
            }
            else
            {
             bg.image = game.assets["res/BGfPC.png"];
            }

            back = new Button("back","light");
            back.addEventListener("touchstart", this.touchToBack);
            

            this.pinguin = new Pinguin();
            this.pinguin2 = new Pinguin2();

            iceGroup = new Group();
            this.iceGroup = iceGroup;


     
            this.addChild(bg);
            this.addChild(iceGroup);
            this.addChild(this.pinguin);
            this.addChild(this.pinguin2);
            this.addChild(label);
            this.addChild(back);

            this.addEventListener(Event.ENTER_FRAME,this.update);
            
            this.addEventListener(Event.ENTER_FRAME, function ()
            {
            if (game.input.back) 
            { // выход на стартовый экран кнопкой Esc
                game.replaceScene(new SceneStartGame());
            }
            });


            // Instance variables
            this.generateIceTimer = 0;
            this.scoreTimer = 0;
            this.score = 0;

        },
        touchToBack: function(evt) 
        {
            var game = Game.instance;
            game.replaceScene(new SceneStartGame());
        },


        update: function(evt) 
        {
            // Score increase as time pass


            this.scoreTimer += evt.elapsed * 0.001;
            if(this.scoreTimer >= 0.5)
            {
                this.setScore(this.score + 1);
                this.scoreTimer -= 0.5;
            }

            // Check if it's time to create a new set of obstacles
            this.generateIceTimer += evt.elapsed * 0.001;
            if(this.generateIceTimer >= 0.1)
            {
                var ice;
                this.generateIceTimer -= 0.5;
                ice = new Ice(Math.floor(Math.random()*100));
                this.iceGroup.addChild(ice);
            }

            // Check collision
            for (var i = this.iceGroup.childNodes.length - 1; i >= 0; i--) 
            {
                var ice;
                ice = this.iceGroup.childNodes[i];
                if(ice.intersect(this.pinguin))
                {  
                    var game;
                    game = Game.instance;                  
                    this.iceGroup.removeChild(ice);
                    game.replaceScene(new SceneGameOver(this.score));        
                    break;
                }
                if(ice.intersect(this.pinguin))
                {  
                    var game;
                    game = Game.instance;                  
                    this.iceGroup.removeChild(ice);
                    game.replaceScene(new SceneGameOver(this.score));        
                    break;
                }
                if(ice.intersect(this.pinguin2))
                {  
                    var game;
                    game = Game.instance;                  
                    this.iceGroup.removeChild(ice);
                    game.replaceScene(new SceneGameOver(this.score));        
                    break;
                }
            }
        },
        

        setScore: function (value) 
        {
            this.score = value;
            this.scoreLabel.text = 'SCORE<br>' + this.score;
        }
    });

        //-------PINGUIN--1----------------------------------------------------------------
        var Pinguin = Class.create(Sprite, 
        {
            initialize: function() 
            {   
                Sprite.apply(this,[30, 43]);
            
                this.game = Game.instance;
                this.image = this.game.assets['res/pinguinSheet.png'];
                this.animationDuration = 0;

                this.scaleX = 1;
                this.scaleY = 1;
                this.x = (this.game.width/4) - (this.width / 2);
                this.y = this.game.height - this.height;
                this.game.input.width = this.game.width/2;
                this.moveSpeed = 4;

                this.addEventListener(Event.ENTER_FRAME, this.update);
                this.addEventListener(Event.ENTER_FRAME, this.updateAnimation);
                this.addEventListener(Event.TOUCH_MOVE, function (event) 
                {
                    this.x = event.x - this.width/2;
            
                });
            },
            update: function(evt) 
            {
            // Left / Right
                if(this.game.input.left && this.x > this.moveSpeed) 
                {
                    this.x -= this.moveSpeed;
                    this.rotation = -50;
                }
                else if(this.game.input.right && this.x < this.game.width - this.width) 
                {
                    this.x += this.moveSpeed;
                    this.rotation = 50;
                }
                if(!this.game.input.right && !this.game.input.left ) 
                { // отключение анимации махания крыльями при движении в сторону
                    this.rotation = 0;
                }
                if(this.x > this.game.width/2.2)
                {       
                    this.x = this.game.width/2.2 - 0;
                }

            },
            updateAnimation: function (evt) 
            { //описание процесса анимации                                      
                this.animationDuration += evt.elapsed * 0.001;  //скорость      
                if(this.animationDuration >= 0.25)
                {
                    this.frame = (this.frame + 1) % 2;
                    this.animationDuration -= 0.50;         //задержка
                }
            }
        });
        //-------PINGUIN--2----------------------------------------------------------------

        var Pinguin2 = Class.create(Sprite, 
        {
            initialize: function() 
                {
                    Sprite.apply(this,[30, 43]);
                    
                    this.game = Game.instance;
                    this.image = this.game.assets['res/pinguinSheet2.png'];
                    this.animationDuration = 0; 

                    this.scaleX = 1;
                    this.scaleY = 1;
                    this.x = (this.game.width) - (this.game.width/4);
                    this.y = this.game.height - this.height;
                    this.game.input.width = this.game.width;
                    this.moveSpeed = 4;

                    this.addEventListener(Event.ENTER_FRAME, this.update);
                    this.addEventListener(Event.ENTER_FRAME, this.updateAnimation);
                    this.addEventListener(Event.TOUCH_MOVE, function (event) 
                    {
                        this.x = event.x - this.width/2;
                
                    });
                },
            update: function(evt) 
                {
                    // Left / Right
                    if(this.game.input.left2 && this.x > this.moveSpeed) 
                    {
                        this.x -= this.moveSpeed;
                        this.rotation = -50;
                    }
                    else if(this.game.input.right2 && this.x < this.game.width - this.width) 
                    {
                        this.x += this.moveSpeed;
                        this.rotation = 50;
                    }
                    if(!this.game.input.right2 && !this.game.input.left2 ) 
                    {// отключение анимации махания крыльями при движении в сторону
                        this.rotation = 0;
                    }
                    if(this.x < this.game.width/2)
                    {       
                        this.x = this.game.width/2 - 0;
                    }    
                },
            updateAnimation: function (evt) 
                { //описание процесса анимации                                      
                    this.animationDuration += evt.elapsed * 0.001;  //скорость      
                    if(this.animationDuration >= 0.25)
                    {
                        this.frame = (this.frame + 1) % 2;
                        this.animationDuration -= 0.50;         //задержка
                    }
                }
        });

        //-------ICE-----------------------------------------------------------------------

        var Ice = Class.create(Sprite, 
        {
            
            initialize: function(lane) 
                {
                    // Call superclass constructor
                    Sprite.apply(this,[48, 49]);
                    this.image  = Game.instance.assets['res/Ice.png'];      
                    this.rotationSpeed = 0;
                    this.setLane(lane);
                    this.addEventListener(Event.ENTER_FRAME, this.update);
                },

            setLane: function(lane) 
                {
                    var game, distance;
                    game = Game.instance;        
                    distance = 90;
                 
                    this.rotationSpeed = Math.random() * 100 - 50;
                    this.lane_width = game.width/2 - 20;
                    this.x = Math.floor( Math.random() * (2*this.lane_width-48));//game.width/2 - this.width + (lane - 1) * distance;
                    if (this.x<(this.lane_width+this.width/2)&&this.x>(this.lane_width-this.width/2)) 
                        { 
                            this.x+=this.width*2;
                        };
                    this.y = -this.height;    
                    this.rotation = Math.floor( Math.random() * 360 );    
                },

            update: function(evt) 
                { 
                    var ySpeed, game;
                 
                    game = Game.instance;
                    ySpeed = 300;
                 
                    this.y += ySpeed * evt.elapsed * 0.001;
                    this.rotation += this.rotationSpeed * evt.elapsed * 0.001;           
                    if(this.y > game.height)
                    {
                        this.parentNode.removeChild(this);          
                    }
                }
        });

    var SceneGameOver = Class.create(Scene, 
    {
        initialize: function(score) 
            {
                var scoreLabel, game, end, bground;
                game = Game.instance;
                Scene.apply(this);

                

                scoreLabel = new Label('SCORE<br>    ' +    score);
                scoreLabel.x = game.width/2.2;
                scoreLabel.y = 40;        
                scoreLabel.color = 'red';
                scoreLabel.font = '24px strong';
                scoreLabel.textAlign = 'left';

                end = new Sprite(189,97);
                end.image = game.assets["res/end.png"];
                end.x = game.width/2.73;
                end.y = game.height/4;
                if (isAndroid)
                {
                    end.x = game.width/2;
                    end.y = game.height/4;
                }


                bground = new Sprite(v_width, v_height);
                bground.image = game.assets["res/BG_Over.png"];

                this.addChild(bground);
                this.addChild(scoreLabel);
                this.addChild(end);
               
            

                this.addEventListener(Event.TOUCH_START, this.touchToRestart);
                // выход на стартовый экран кнопкой Esc
                this.addEventListener(Event.ENTER_FRAME, function ()
                {
                    if (game.input.back) 
                    { 
                        game.replaceScene(new SceneStartGame());
                    }
                });
            },



        touchToRestart: function(evt) 
        {
            var game = Game.instance;
            game.replaceScene(new SceneGame());
        }
    });

};