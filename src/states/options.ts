import { ArcRotateCamera,Scene, Vector3, Engine, TimerState } from '@babylonjs/core';
import { AdvancedDynamicTexture, Button, Control, Grid, Image, Rectangle } from '@babylonjs/gui';
import { Game, State, Status } from '../app';
import { simpleButton, simpleSlider, simpleTextBlock } from '../helpers/gui_generator';

export async function options(this: Game,canvas: HTMLCanvasElement, engine: Engine, status: Status){
    
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
    status._state = State.OPTIONS;
}

async function makeGui(sceneToLoad: Scene) {
    const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("ui",true,sceneToLoad);

    const fontSizePercentage = 0.05;

    const background = new Rectangle("background");
    background.color = "#9dc9b5";
    background.background = "#9dc9b5";
    guiMenu.addControl(background);
    
    const titleOptions = await simpleTextBlock("titleOptions", "Options","white",fontSizePercentage, 0.15, 0, Control.VERTICAL_ALIGNMENT_TOP);
    titleOptions.textWrapping = true;
    titleOptions.zIndex = 5;
    guiMenu.addControl(titleOptions);

    const backButton = await simpleButton("backButton","> Back",(fontSizePercentage / 1.5),0.1, window.innerHeight * 0.075, Control.VERTICAL_ALIGNMENT_TOP);
    backButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    //backButton.leftInPixels = -280;
    backButton.zIndex = 10;
    backButton.onPointerClickObservable.add(()=> {
       this.goToMainMenu();
       this._soundManager.backSoundPlay();
    })
    guiMenu.addControl(backButton);

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
    grid.addColumnDefinition(1);
    grid.addRowDefinition(0.1);
    grid.addRowDefinition(0.4);
    grid.addRowDefinition(0.1);
    grid.addRowDefinition(0.4);
    containerGrid.addControl(grid);

    const soundSubtitle = await simpleTextBlock("soundSubtitle", "Options","white",fontSizePercentage*0.4, 0.5, 0, Control.VERTICAL_ALIGNMENT_CENTER);
    soundSubtitle.textWrapping = true;
    grid.addControl(soundSubtitle,0,0);

    const gridSound = new Grid();
    gridSound.background = "#64B1A2";
    gridSound.width = 1;
    gridSound.height = 1;
    gridSound.zIndex = 5;
    gridSound.addColumnDefinition(0.2);
    gridSound.addColumnDefinition(0.75);
    gridSound.addColumnDefinition(0.05);
    gridSound.addRowDefinition(0.33);
    gridSound.addRowDefinition(0.33);
    gridSound.addRowDefinition(0.33);
    grid.addControl(gridSound,1,0);

    const valueSliderAmbient = await simpleTextBlock("valueAmbientSlider", this._soundManager.getAmbientVolume(),"white",fontSizePercentage*0.5, 1, 0, Control.VERTICAL_ALIGNMENT_CENTER);
    gridSound.addControl(valueSliderAmbient,0,2);

    const sliderAmbientVol = await simpleSlider("sliderAmbientSound","Ambient sound volume",this._soundManager.getAmbientVolume(),gridSound,0,fontSizePercentage);
    sliderAmbientVol.onValueChangedObservable.add((value) => {
        const volume = Math.round(value).toString();
        valueSliderAmbient.text = volume;
        this._soundManager.setAmbientVolume(volume);
    });

    const valueSliderMusic = await simpleTextBlock("valueMusicSlider", this._soundManager.getMusicVolume(),"white",fontSizePercentage*0.5, 1, 0, Control.VERTICAL_ALIGNMENT_CENTER);
    gridSound.addControl(valueSliderMusic,1,2);

    const sliderMusicVol = await simpleSlider("sliderMusicSound","Music sound volume",this._soundManager.getMusicVolume(),gridSound,1,fontSizePercentage);
    sliderMusicVol.onValueChangedObservable.add((value) => {
        const volume = Math.round(value).toString();
        valueSliderMusic.text = volume;
        this._soundManager.setMusicVolume(volume);
    });

    const valueSliderSfx = await simpleTextBlock("valueSfxSlider", this._soundManager.getSfxVolume(),"white",fontSizePercentage*0.5, 1, 0, Control.VERTICAL_ALIGNMENT_CENTER);
    gridSound.addControl(valueSliderSfx,2,2);

    const sliderSfxVol = await simpleSlider("sliderSfxSound","SFX sound volume",this._soundManager.getSfxVolume(),gridSound,2,fontSizePercentage);
    sliderSfxVol.onValueChangedObservable.add((value) => {
        const volume = Math.round(value).toString();
        valueSliderSfx.text = volume;
        this._soundManager.setSfxVolume(volume);
    });


}