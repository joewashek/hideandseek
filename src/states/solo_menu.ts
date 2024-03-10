import { Scene, Engine, ArcRotateCamera, Vector3 } from '@babylonjs/core';
import { AdvancedDynamicTexture, Control, Grid, Image, Rectangle, ScrollViewer } from '@babylonjs/gui';
import { Game, State, Status } from '../app';
import { imageButton, rectangle, simpleButton, simpleTextBlock } from '../helpers/gui_generator';

export async function soloMenu(this: Game,canvas: HTMLCanvasElement, engine: Engine, status: Status){
    
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
    status._state = State.SOLO_MENU;
}

async function makeGui(sceneToLoad: Scene): Promise<void> {
    const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("ui", true, sceneToLoad);
    const fontSizePercentage = 0.06;
    const background = new Rectangle("background");
    background.color = "#9dc9b5";
    background.background = "#9dc9b5";
    guiMenu.addControl(background);

    //const backButton = await simpleButton("startBtn","Start",fontSizePercentage,1,0.1,Control.VERTICAL_ALIGNMENT_CENTER);
    //const backButton = await simpleButton("backButton","Back",(fontSizePercentage / 1.5),(0.4 * window.innerHeight), 0, Control.VERTICAL_ALIGNMENT_TOP);
    const backButton = await simpleButton("backButton","Back",(fontSizePercentage / 1.5),0.08, 0, Control.VERTICAL_ALIGNMENT_TOP);
    backButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    backButton.leftInPixels = -80;
    //backButton.zIndex = 8;
   // backButton.background = "red";
    backButton.onPointerClickObservable.add(()=> {
       this.goToMainMenu();
       this._soundManager.backSoundPlay();
    })
    guiMenu.addControl(backButton);

    
    const soloTitle = await simpleTextBlock("soloTitle", "Choose your level","white",fontSizePercentage, 0.1, (window.innerHeight/20), Control.VERTICAL_ALIGNMENT_TOP);
    guiMenu.addControl(soloTitle);

    const scrollViewer = new ScrollViewer("scrollViewerSolo");
    scrollViewer.background = "#64B1A2";
    scrollViewer.height = 0.7;
    scrollViewer.width = 0.8;
    scrollViewer.thickness = 15;
    scrollViewer.top = -(window.innerHeight / 10);
    scrollViewer.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    guiMenu.addControl(scrollViewer);

    const level1Btn = await imageButton("level1Btn","The Rabbit Invasion","assets/textures/UI/level1.svg", fontSizePercentage/2,0.3,0,Control.HORIZONTAL_ALIGNMENT_LEFT);
    level1Btn.onPointerClickObservable.add(()=> {
        modal.isVisible = true;
        containerGrid.isVisible = true;

        this.setupGame();
    })
    scrollViewer.addControl(level1Btn);

    const containerGrid = new Rectangle("gridContainer");
    containerGrid.isVisible = false;
    containerGrid.background = "#64B1A2";
    containerGrid.thickness = 15;
    containerGrid.cornerRadius = 50;
    containerGrid.width = 0.7;
    containerGrid.height = 0.7;
    containerGrid.zIndex = 5;
    guiMenu.addControl(containerGrid);

    const modal = await rectangle("modal",1,1,0,"black");
    modal.zIndex = 3;
    modal.alpha = 0.3
    modal.isVisible = false;
    
    modal.onPointerClickObservable.add(() => {
        containerGrid.isVisible = false;
        modal.isVisible = false;

        this.removeGame();
    });
    guiMenu.addControl(modal);

    const grid = new Grid();
    grid.background = "#64B1A2";
    grid.width = 0.95;
    grid.height = 0.95;
    grid.zIndex = 10;
    grid.addColumnDefinition(0.5);
    grid.addColumnDefinition(0.5);
    grid.addRowDefinition(0.5);
    grid.addRowDefinition(0.5);
    containerGrid.addControl(grid);

    const controls = new Image("controls","assets/textures/UI/controls1.svg");
    controls.stretch = Image.STRETCH_UNIFORM;
    controls.width = 1;
    grid.addControl(controls,0,0);

    const goalBlock = await simpleTextBlock("soloIndidications","Find all the rabbits during the alloted time to avoid loosing.","white",fontSizePercentage/2,0.5,0,Control.VERTICAL_ALIGNMENT_CENTER);
    goalBlock.textWrapping = true;
    grid.addControl(goalBlock,0,1);

    const startBtn = await simpleButton("startBtn","Start",fontSizePercentage,1,0.1,Control.VERTICAL_ALIGNMENT_CENTER);
    startBtn.onPointerClickObservable.add(()=>{
        this.goToGame();

        this._soundManager.confirmSoundPlay();
    })
    grid.addControl(startBtn,1,1);

    const timeText = await simpleTextBlock("soloTime","60 seconds", "white",fontSizePercentage/2,0.5,0,Control.VERTICAL_ALIGNMENT_CENTER);
    timeText.textWrapping = true;
    grid.addControl(timeText,1,0);

    window.addEventListener("resize",() => {
        soloTitle.fontSizeInPixels = ((window.innerHeight + window.innerWidth) / 2) * fontSizePercentage;
        level1Btn.fontSizeInPixels = ((window.innerHeight + window.innerWidth) / 2) * fontSizePercentage/2;
        startBtn.fontSizeInPixels = ((window.innerHeight + window.innerWidth) / 2) * fontSizePercentage;
        goalBlock.fontSizeInPixels = ((window.innerHeight + window.innerWidth) / 2) * fontSizePercentage/2;
        timeText.fontSizeInPixels = ((window.innerHeight + window.innerWidth) / 2) * fontSizePercentage/2;
        backButton.fontSizeInPixels = ((window.innerHeight + window.innerWidth) / 2) * fontSizePercentage/1.5;
    })
}