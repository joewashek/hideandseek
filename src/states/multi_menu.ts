import { Scene, Engine, ArcRotateCamera, Vector3, PlaneRotationGizmo } from '@babylonjs/core';
import { AdvancedDynamicTexture, Control, Grid, Image, Rectangle, ScrollViewer } from '@babylonjs/gui';
import { Game, State, Status } from '../app';
import { image, imageButton, rectangle, simpleButton, simpleTextBlock } from '../helpers/gui_generator';

export async function multiMenu(this: Game,canvas: HTMLCanvasElement, engine: Engine, status: Status){
    
    status._scene.detachControl();
    engine.displayLoadingUI();

    let sceneToLoad = new Scene(engine);

    const camera: ArcRotateCamera = new ArcRotateCamera("camera",Math.PI, Math.PI, 1, Vector3.Zero(),sceneToLoad);

    await makeGui.call(this, sceneToLoad);
    
    await sceneToLoad.whenReadyAsync();
    sceneToLoad.attachControl();
    engine.hideLoadingUI();
    status._scene.dispose();
    status._scene = sceneToLoad;
    status._state = State.MULTI_MENU;
}

async function makeGui(sceneToLoad: Scene): Promise<void> {
    const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("ui", true, sceneToLoad);
    const fontSizePercentage = 0.06;

    const background = new Rectangle("background");
    background.color = "#9dc9b5";
    background.background = "#9dc9b5";
    guiMenu.addControl(background);

    const backButton = await simpleButton("backButton","Back",(fontSizePercentage / 2),0.1, 0, Control.VERTICAL_ALIGNMENT_TOP);
    backButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    
    backButton.zIndex = 10;
    backButton.onPointerClickObservable.add(()=> {
       this.goToMainMenu();
       this._soundManager.backSoundPlay();
    })
    guiMenu.addControl(backButton);

    
    const multiTitle = await simpleTextBlock("multiTitle", "Local Multiplayer","white",fontSizePercentage*.5, 0.2, 0, Control.VERTICAL_ALIGNMENT_TOP);
    guiMenu.addControl(multiTitle);

    const containerGrid = new Rectangle("gridContainer");
    containerGrid.background = "#64B1A2";
    containerGrid.thickness = 15;
    containerGrid.cornerRadius = 50;
    containerGrid.width = 0.8;
    containerGrid.height = 0.8;
    containerGrid.zIndex = 2;
    containerGrid.topInPixels = 0.05 * window.innerHeight;
    guiMenu.addControl(containerGrid);

    const grid = new Grid();
    grid.background = "#64B1A2";
    grid.width = 0.95;
    grid.height = 0.95;
    grid.zIndex = 3;
    grid.addColumnDefinition(0.5);
    grid.addColumnDefinition(0.5);
    grid.addRowDefinition(0.66);
    grid.addRowDefinition(0.14);
    grid.addRowDefinition(0.2);
    containerGrid.addControl(grid);

    
    for (let i = 1; i < 3; i++) {
        //const playerImage = await image(`imagePlayer${i}`,`assets/textures/UI/player${i}.svg`,1,1,0,0,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER)
        const playerImage = await image(`imagePlayer${i}`,`assets/sprites/character/spearman${i}_watching.png`,1,1,0,0,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER);
        playerImage.cellId  = 0;
        playerImage.cellHeight = 185;
        playerImage.cellWidth = 185;
        playerImage.stretch = Image.STRETCH_UNIFORM;
        grid.addControl(playerImage,0,i-1);

        const playerName = await simpleTextBlock(`namePlayer${i}`,`Player${i}`,"white",fontSizePercentage * 0.4,0.5,0,Control.VERTICAL_ALIGNMENT_CENTER);
        playerName.textWrapping = true;
        grid.addControl(playerName,1,i-1);

        const playerControls = await image(`crtlPlayer${i}`,`assets/textures/UI/controls${i}.svg`,1,1,0,0,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER);
        playerControls.stretch = Image.STRETCH_UNIFORM;
        grid.addControl(playerControls,2,i-1);
    }

    const levelMenuBtn = await simpleButton("levelMenuBtn","Choose a level",(fontSizePercentage / 1.5),1, 0.1*window.innerHeight, Control.VERTICAL_ALIGNMENT_CENTER);
    levelMenuBtn.zIndex = 5;
    levelMenuBtn.height = 0.2;
    levelMenuBtn.width = 0.3;
    levelMenuBtn.onPointerClickObservable.add(()=> {
       this.goToSoloMenu();
       this._soundManager.confirmSoundPlay();
    })
    guiMenu.addControl(levelMenuBtn);

    window.addEventListener("resize",() => {
        backButton.fontSizeInPixels = ((window.innerHeight + window.innerWidth) / 2) * fontSizePercentage/1.5;
        levelMenuBtn.fontSizeInPixels = ((window.innerHeight + window.innerWidth) / 2) * fontSizePercentage/1.5;
        multiTitle.fontSizeInPixels = ((window.innerHeight + window.innerWidth) / 2) * fontSizePercentage;
    })
}