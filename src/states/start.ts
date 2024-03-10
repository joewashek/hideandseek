import { ArcRotateCamera,Scene, Vector3, Engine } from '@babylonjs/core';
import { AdvancedDynamicTexture, Button, Control, Image, Rectangle } from '@babylonjs/gui';
import { Game, State, Status } from '../app';
import { simpleButton } from '../helpers/gui_generator';

export async function start(this: Game,canvas: HTMLCanvasElement, engine: Engine, status: Status){
    
    const camera2: ArcRotateCamera = new ArcRotateCamera("camera", Math.PI, Math.PI, 1, Vector3.Zero(),status._scene);
    camera2.attachControl(true);
    
    status._scene.detachControl();
    engine.displayLoadingUI();

    let sceneToLoad = new Scene(engine);

    await makeGui.call(this,sceneToLoad);

    const camera: ArcRotateCamera = new ArcRotateCamera("camera", Math.PI, Math.PI, 1, Vector3.Zero(),sceneToLoad);
    camera.attachControl(true);

    await sceneToLoad.whenReadyAsync();
    sceneToLoad.attachControl();
    engine.hideLoadingUI();
    status._scene.dispose();
    status._scene = sceneToLoad;
    status._state = State.START;
}

async function makeGui(sceneToLoad: Scene) {
    const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("ui",true,sceneToLoad);

    const background = new Rectangle("background");
    background.color = "#9dc9b5";
    background.background = "#9dc9b5";
    guiMenu.addControl(background);
    
    const titleImg = new Image("logoTitle","assets/textures/UI/logo.svg");
    titleImg.height = 0.3;
    titleImg.stretch = Image.STRETCH_UNIFORM;
    titleImg.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    titleImg.top = (window.innerHeight / 10);
    guiMenu.addControl(titleImg);

    const fontSizePercentage = 0.05;
    
    const playBtn = await simpleButton("playBtn","Play",fontSizePercentage,0.12,-(window.innerHeight / 10),  Control.VERTICAL_ALIGNMENT_BOTTOM);
    playBtn.onPointerClickObservable.add(() => {
        this.goToMainMenu();

        this._soundManager.confirmSoundPlay();
    });
    guiMenu.addControl(playBtn);

    const animImg = new Image("animImg","assets/sprites/character/character1_watching.png");
    animImg.cellId  = 1;
    animImg.cellHeight = 600;
    animImg.cellWidth = 600;
    animImg.height = 0.4 * window.innerHeight + "px";
    animImg.width = 0.4 * window.innerHeight + "px";

    setInterval(()=> {
        if(animImg.cellId < 7){
            animImg.cellId++;
        }else{
            animImg.cellId = 1;
        }
    },700);

    guiMenu.addControl(animImg);

    window.addEventListener("resize", () => {
        playBtn.fontSizeInPixels = ((window.innerHeight + window.innerWidth) / 2) * fontSizePercentage;
        animImg.width = 0.4 * window.innerHeight + "px";
        animImg.height = 0.4 * window.innerHeight + "px";
      
    });
}