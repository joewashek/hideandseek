import { Scene,ActionManager, ExecuteCodeAction, Scalar } from "@babylonjs/core";
import { GameStatus, PlayerControls } from "../app";

export class InputController{

    private _scene: Scene;
    
    // Map
    public inputMap: any;
    private _playerId: number;
    private _controls: PlayerControls;    

     //Movements
    public horizontal: number = 0;
    public vertical: number = 0;
    
    // Axis
    public horizontalAxis: number = 0;
    public verticalAxis: number = 0;

    constructor(gameStatus: GameStatus,playerId:number){
        this._scene = gameStatus._scene;
        
        this._playerId = playerId;
        this._controls = gameStatus._controls[playerId-1];

        if(!this._scene.actionManager){
            this._scene.actionManager = new ActionManager(this._scene);
        }

        this.inputMap = {};
        this._scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (evt)=> {
            this.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));
        this._scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (evt)=> {
            this.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));

        this._scene.onBeforeRenderObservable.add(() => {
            this.updateFromKeyboard();
        })     
    }

    updateFromKeyboard(): void{
        if(this.inputMap[this._controls._up]){
            this.verticalAxis = 1;
            this.vertical = Scalar.Lerp(this.vertical, 1, 0.2);
        }else if(this.inputMap[this._controls._down]){
            this.verticalAxis = -1;
            this.vertical = Scalar.Lerp(this.vertical, -1, 0.2);
        }else{
            this.verticalAxis = 0;
            this.vertical = 0;
        }
        if(this.inputMap[this._controls._left]){
            this.horizontalAxis = -1;
            this.horizontal = Scalar.Lerp(this.horizontal, -1, 0.2);
        }else if(this.inputMap[this._controls._right]){
            this.horizontalAxis = 1;
            this.horizontal = Scalar.Lerp(this.horizontal, 1, 0.2);
        }else{
            this.horizontalAxis = 0;
            this.horizontal = 0;
        }
    }
}