import { ArcRotateCamera,Scene, Vector3, Engine, FreeCamera, DirectionalLight } from '@babylonjs/core';
import { AdvancedDynamicTexture, Button, Control, Image, Rectangle } from '@babylonjs/gui';
import { Game, GameStatus, State, Status } from '../app';
import { simpleButton } from '../helpers/gui_generator';
import { Environment } from '../models/environments';
import { CharacterController } from '../models/character_controller';
import { Hud } from '../models/hud';

export async function initGame(engine: Engine, gameStatus: GameStatus):Promise<void> {
    let sceneToPreload = new Scene(engine);
    gameStatus._scene = sceneToPreload;
    gameStatus._environment = new Environment(gameStatus);
}

export async function disposeGame(gameStatus: GameStatus):Promise<void> {
    gameStatus._scene.dispose();
}

export async function game(this: Game,canvas: HTMLCanvasElement, engine: Engine, status: Status, gameStatus: GameStatus){
    
    // const camera2: ArcRotateCamera = new ArcRotateCamera("camera", Math.PI, Math.PI, 1, Vector3.Zero(),status._scene);
    // camera2.attachControl(true);
    
    status._scene.detachControl();
    engine.displayLoadingUI();

    let sceneToLoad = gameStatus._scene;

    await makeGame.call(this,gameStatus);
    await makeHud.call(this,gameStatus);

    gameStatus._scene.registerBeforeRender(()=>{
        if(gameStatus._isExit)
            this.goToMainMenu();
        if(gameStatus._hud.NpcCount === 10 && gameStatus._hud.Counter > 0)
            this.goToWinMenu();
        if(gameStatus._hud.Counter <= 0)
            this.goToLoseMenu();
    });

    await sceneToLoad.whenReadyAsync();
    sceneToLoad.attachControl();
    engine.hideLoadingUI();
    status._scene.dispose();
    status._scene = sceneToLoad;
    status._state = gameStatus._playerNumber > 1 ? State.GAME_MULTI : State.GAME_SOLO;
}

async function makeGame(gameStatus: GameStatus) {
    const light = new DirectionalLight("light", new Vector3(0,1,1),gameStatus._scene);
    light.intensity = 0.4;

    for (let index = 0; index < gameStatus._playerNumber; index++) {
        
        gameStatus._characterController[index] = new CharacterController(gameStatus,this._soundManager,index+1);
    }
    
}

async function makeHud(gameStatus: GameStatus) {
    gameStatus._hud = await new Hud(gameStatus, this._soundManager);
  
}