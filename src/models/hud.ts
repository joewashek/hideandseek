import { Scene, KeyboardEventTypes, Mesh, FreeCamera, Vector3, Camera } from "@babylonjs/core";
import { AdvancedDynamicTexture, Control,TextBlock, Image, Button, Rectangle, Ellipse } from "@babylonjs/gui";
import { image, rectangle, simpleButton, simpleTextBlock } from "../helpers/gui_generator";
import { GameStatus } from "../app";
import { SoundManager } from "./sound_manager";

export class Hud{

    private _scene: Scene;
    private _IsUnique: boolean;
    private _soundManager: SoundManager;

    private _fontSizePercentage: number = 0.06;
    private _guiTexture: AdvancedDynamicTexture;
    private _npcImage: Image;
    private _resumeBtn: Button;
    private _exitBtn: Button;
    private _modal: Rectangle;

    // Timer stuff
    private _timer: TextBlock;
    private _counter: number = 60;

    private _npcCounter: TextBlock;
    private _npcCount: number = 0;


    constructor(gameStatus: GameStatus, soundManager:SoundManager){
        this._scene = gameStatus._scene;
        this._IsUnique = gameStatus._playerNumber === 1;
        this._soundManager = soundManager;
        this.setupUI(gameStatus);
        this.beforeRenderUpdate(gameStatus);
    }

    private beforeRenderUpdate(gameStatus: GameStatus){ 
        this._scene.registerBeforeRender(()=> {
            if(gameStatus._isPaused)
                return;

            this.updateTimer();
            this.updateNpcCounter();
       });
    }

    public get NpcCount(): number{
        return this._npcCount;
    }

    public get Counter(): number{
        return this._counter;
    }

    public IncrementNpcCounter(mesh:Mesh,playerId:number){
        this._npcCount += 1;
        this._soundManager.collectSoundPlay();

        const canvas = document.getElementById("gameCanvas");
        const ratioPlayerId = playerId === 1 ? -0.25 : 0.25;
        const distanceX = this._IsUnique ? (canvas.offsetWidth / 2)/10 : ((canvas.offsetWidth/2)+(canvas.offsetWidth * ratioPlayerId)) / 10;
        const distanceY = (canvas.offsetHeight / 2) / 10;

        
        const roundFeedback = new Ellipse();
        roundFeedback.widthInPixels = 40;
        roundFeedback.heightInPixels = 40;
        roundFeedback.background = "white";
        roundFeedback.leftInPixels = this._IsUnique ? 0 : canvas.offsetWidth * ratioPlayerId;
        this._guiTexture.addControl(roundFeedback);
        //roundFeedback.linkWithMesh(mesh);

        setTimeout(()=>{
            
            // was for single player only
            //roundFeedback.linkWithMesh(null);
            //const distanceX = roundFeedback.leftInPixels / 10;
            //const distanceY = roundFeedback.topInPixels / 10;

            const interval = setInterval(()=> {
                if(roundFeedback.leftInPixels > -(canvas.offsetWidth/2)){
                    roundFeedback.leftInPixels = roundFeedback.leftInPixels - distanceX;
                    roundFeedback.topInPixels = roundFeedback.topInPixels - distanceY;
                }else{
                    clearInterval(interval);
                    roundFeedback.dispose();
                    mesh.dispose();
                }
            },10)

        },250);
    }

    

    private async setupUI(gameStatus: GameStatus){

        const guiCamera = new FreeCamera("guiCamera",new Vector3(0,0,0),this._scene);
        guiCamera.mode = Camera.ORTHOGRAPHIC_CAMERA;
        guiCamera.layerMask = 0x10000000;
        this._scene.activeCameras.push(guiCamera);

        this._guiTexture = AdvancedDynamicTexture.CreateFullscreenUI("hudGuiTexture", true, this._scene);
        this._guiTexture.layer.layerMask = guiCamera.layerMask;

        this._timer = await simpleTextBlock("timer", "1:00", "yellow",this._fontSizePercentage,0.1,0,Control.VERTICAL_ALIGNMENT_TOP);
        this._guiTexture.addControl(this._timer);

        this._npcImage = await image("rabbitImg", "assets/textures/UI/level1.svg",0.1,0.1,0,0, Control.HORIZONTAL_ALIGNMENT_LEFT,Control.VERTICAL_ALIGNMENT_TOP);
        this._guiTexture.addControl(this._npcImage);

        this._npcCounter= await simpleTextBlock("rabbitCounter", "0 / 10", "yellow",this._fontSizePercentage,0.1,0,Control.VERTICAL_ALIGNMENT_TOP);
        this._npcCounter.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this._npcCounter.leftInPixels = 0.02 * window.innerWidth;
        this._npcCounter.width = 0.25;
        this._guiTexture.addControl(this._npcCounter);

        this._modal = await rectangle("pauseModal",1, 1, 0, "black");
        this._modal.zIndex = 3;
        this._modal.alpha = 0.3;
        this._modal.isVisible = false;
        this._guiTexture.addControl(this._modal);

        this._resumeBtn = await simpleButton("resumeBtn","Resume",this._fontSizePercentage,0.1,-((window.innerHeight / 10)),  Control.VERTICAL_ALIGNMENT_CENTER);
        this._resumeBtn.isVisible = false;
        this._resumeBtn.zIndex = 5;
        this._resumeBtn.onPointerClickObservable.add(()=>{
            this.pauseGame(gameStatus);
        });
        this._guiTexture.addControl(this._resumeBtn);

        this._exitBtn = await simpleButton("exitBtn","Exit",this._fontSizePercentage,0.1,((window.innerHeight / 10)),  Control.VERTICAL_ALIGNMENT_CENTER);
        this._exitBtn.isVisible = false;
        this._exitBtn.zIndex = 5;
        this._exitBtn.onPointerClickObservable.add(()=>{
            gameStatus._isExit = true;
            this._soundManager.confirmSoundPlay();
        });
        this._guiTexture.addControl(this._exitBtn);

        this._scene.onKeyboardObservable.add((kbInfo) => {
            switch(kbInfo.type){
                case KeyboardEventTypes.KEYUP:
                    switch(kbInfo.event.key){
                        case "Escape":
                            this.pauseGame(gameStatus);
                        break;
                    }
                break;
            }
        });

        window.addEventListener("resize",()=>{
            this._timer.fontSizeInPixels = ((window.innerHeight + window.innerWidth) / 2) * this._fontSizePercentage;
            this._npcCounter.fontSizeInPixels = ((window.innerHeight + window.innerWidth) / 2) * this._fontSizePercentage;
            this._resumeBtn.fontSizeInPixels = ((window.innerHeight + window.innerWidth) / 2) * this._fontSizePercentage;
            this._exitBtn.fontSizeInPixels = ((window.innerHeight + window.innerWidth) / 2) * this._fontSizePercentage;
        })
    }

    private async formatTime():Promise<string>{
        if(this._counter < 0)
            return "0";

       return String(Math.round(this._counter));
    }

    private async updateTimer(){
        if(!this._scene.deltaTime)
            return;
        this._counter -= this._scene.deltaTime / 1000;
        this._timer.text = await this.formatTime();
    }

    private updateNpcCounter(){
        this._npcCounter.text = this._npcCount + " / 10";
    }

    private pauseGame(gameStatus: GameStatus){
        gameStatus._isPaused = !gameStatus._isPaused;
        this._resumeBtn.isVisible = gameStatus._isPaused;
        this._exitBtn.isVisible = gameStatus._isPaused;
        this._modal.isVisible = gameStatus._isPaused;
        if(gameStatus._isPaused){
            this._soundManager.pauseSoundPlay();
        }else{
            this._soundManager.unpauseSoundPlay();
        }
    }
}

