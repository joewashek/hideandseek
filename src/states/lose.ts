import { ArcRotateCamera,Scene, Vector3, Engine } from '@babylonjs/core';
import { AdvancedDynamicTexture, Button, Control, Grid, Image, Rectangle } from '@babylonjs/gui';
import { Game, GameStatus, State, Status } from '../app';
import { rectangle, simpleButton, simpleTextBlock } from '../helpers/gui_generator';

export async function lose(this: Game,canvas: HTMLCanvasElement, engine: Engine, status: Status, gameStatus:GameStatus){

    status._scene.detachControl();
    engine.displayLoadingUI();

    let sceneToLoad = new Scene(engine);

    await makeGui.call(this,sceneToLoad,gameStatus);

    const camera: ArcRotateCamera = new ArcRotateCamera("camera", Math.PI, Math.PI, 1, Vector3.Zero(),sceneToLoad);
    camera.attachControl(true);

    await sceneToLoad.whenReadyAsync();
    sceneToLoad.attachControl();
    engine.hideLoadingUI();
    status._scene.dispose();
    status._scene = sceneToLoad;
    status._state = State.WIN;
}

async function makeGui(sceneToLoad: Scene, gameStatus: GameStatus) {
    const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("ui",true,sceneToLoad);

    const fontSizePercentage = 0.05;

    const backgroundImage = await rectangle("background",1,1,0,"#9dc9b5");
    guiMenu.addControl(backgroundImage);

    const grid = new Grid();
    grid.background = "#64B1A2";
    grid.width = 0.95
    grid.height = 0.95;
    grid.zIndex = 10;
    grid.addColumnDefinition(1);
    grid.addRowDefinition(0.5);
    grid.addRowDefinition(0.5);
    grid.addRowDefinition(0.5);
    guiMenu.addControl(grid);

    const sadText = await simpleTextBlock("sadText","Sorry, did not win.","white",fontSizePercentage/1.5,0.5,0,Control.VERTICAL_ALIGNMENT_CENTER);
    sadText.textWrapping = true;
    grid.addControl(sadText,0,0);

    const scoreText = await simpleTextBlock("scoreText","You found "+gameStatus._hud.NpcCount + " / 10 rabbits.","white",fontSizePercentage/2,0.5,0,Control.VERTICAL_ALIGNMENT_CENTER);
    scoreText.textWrapping = true;
    grid.addControl(scoreText,1,0);

    const mainMenuButton = await simpleButton("mainMenuButton","Go To Menu",fontSizePercentage/2,0.3,0,Control.VERTICAL_ALIGNMENT_CENTER);
    mainMenuButton.textBlock.textWrapping = true;
    mainMenuButton.onPointerClickObservable.add(()=>{
        this.goToMainMenu();
        this._soundManager.confirmSoundPlay();
    });
    grid.addControl(mainMenuButton,2,0);
}