import { Animation,Scene, Vector3, Engine, AssetsManager, Vector2, SpriteMap, Texture, FreeCamera, SpritePackedManager, MeshBuilder, Mesh, DirectionalLight, FollowCamera } from '@babylonjs/core';
import { AdvancedDynamicTexture, Button, Control, Image, Rectangle } from '@babylonjs/gui';
import { Game, State, Status } from '../app';
import { simpleButton } from '../helpers/gui_generator';
import { spriteMapGenerator,spriteRandomGenerator,spritePackRandomGenerator,animatedStandardMaterial } from '../helpers/sprint_generator';

export async function mainMenu(this: Game,canvas: HTMLCanvasElement, engine: Engine, status: Status){
    
    //const camera2: ArcRotateCamera = new ArcRotateCamera("camera", Math.PI, Math.PI, 1, Vector3.Zero(),status._scene);
    //camera2.attachControl(true);
    
    status._scene.detachControl();
    engine.displayLoadingUI();

    let sceneToLoad = new Scene(engine);

    await makeBackground(canvas,sceneToLoad);
    await makeGui.call(this, sceneToLoad);
    

    await sceneToLoad.whenReadyAsync();
    sceneToLoad.attachControl();
    engine.hideLoadingUI();
    status._scene.dispose();
    status._scene = sceneToLoad;
    status._state = State.MAIN_MENU;
}

async function makeBackground(canvas:HTMLCanvasElement, sceneToLoad: Scene): Promise<void> {
    //const camera: FreeCamera = new FreeCamera("camera", Vector3.Zero(),sceneToLoad);
    //camera.attachControl(true);

    const light = new DirectionalLight("light", new Vector3(0,1,1),sceneToLoad);
    light.intensity = 0.4;

    const min = -15;
    const max = 15;

    spriteRandomGenerator(sceneToLoad, "rabbit", 'assets/sprites/animals/rabbit_watching.png',600, 600, 5, min, max, -0.6, 1, 1, true, 11);

    const spritePackManager: SpritePackedManager = new SpritePackedManager("envSpritePack","assets/sprites/environment/envSpritePack.png",100, sceneToLoad);
    spritePackRandomGenerator(spritePackManager, "treesTriangle", "tree_triangle.png",20, min, max, -1.8, 7.76 / 2, 2.52 / 2);
    spritePackRandomGenerator(spritePackManager, "treesRound", "tree_round.png",20, min, max, -2, 8.93 / 2, 5.52 / 2);
    spritePackRandomGenerator(spritePackManager, "treesDead", "tree_dead.png",5, min, max, -1.2, 5.77 / 2, 3.69 / 2);

    spritePackRandomGenerator(spritePackManager, "bush1", "bush_1.png",20, min, max, -0.1, 2.28 / 4, 2.48 / 4);
    spritePackRandomGenerator(spritePackManager, "bush2", "bush_2.png",20, min, max, -0.1, 2.16 / 4, 2.14 / 4);
    spritePackRandomGenerator(spritePackManager, "flowerRed", "flower_red.png",20, min, max, -0.1, 2.1 / 4, 0.79 / 4);

    await spriteMapGenerator(
        sceneToLoad, 
        "assets/textures/tile_map_texture.png", 
        "assets/tilemaps/tile_map_texture.json",
        "assets/tilemaps/menu_tile_map.tilemaps",
        new Vector2(4,4),
        new Vector2(40, 40),
        )

    const parentMesh = new Mesh("parentPlayerMesh", sceneToLoad);
    const playerMesh = MeshBuilder.CreatePlane("playerMesh",{ height:1, width: 1, sideOrientation: Mesh.DOUBLESIDE}, sceneToLoad);
    playerMesh.position.z = -0.4;
    playerMesh.rotation.x = -45;
    playerMesh.setParent(parentMesh);
    playerMesh.material = await animatedStandardMaterial(sceneToLoad, "assets/sprites/character/character1_moving_left.png","charMat",8,1,120);

    const animPlayer: Animation = new Animation("playerAnimation","rotationQuaternion", 60, Animation.ANIMATIONTYPE_QUATERNION,Animation.ANIMATIONLOOPMODE_CYCLE);
    const initialRotationQuaternion = new Vector3(-45,0 ,0).toQuaternion();
    const rotationQuarternionReversed = new Vector3(45,135,0).toQuaternion();

    // 60 frames per second
    // changing with
    const anim1 = [
        {frame: 0, value: initialRotationQuaternion},{frame: 360, value: initialRotationQuaternion }, // left
        {frame: 361, value: rotationQuarternionReversed},{frame: 900, value: rotationQuarternionReversed }, //right
        {frame: 901, value: initialRotationQuaternion}, {frame: 2500, value: initialRotationQuaternion },
        {frame: 2501, value: initialRotationQuaternion}, {frame: 3200, value: initialRotationQuaternion }
    ]

    animPlayer.setKeys(anim1);

    playerMesh.animations = [];
    playerMesh.animations.push(animPlayer);

    sceneToLoad.beginAnimation(playerMesh, 0, 3400, true);

    parentMesh.animations = [];

    let animationsPosition = await Animation.ParseFromFileAsync("playerPositionAnimation","assets/animations/main_menu_player_animation.json");
    (animationsPosition as Animation[]).forEach((a) => {
        parentMesh.animations.push(a);
    });
    sceneToLoad.beginDirectAnimation(parentMesh, parentMesh.animations, 0, 3400, true);

    const camera = new FollowCamera("followCam", new Vector3(0,-3, -10),sceneToLoad);
    camera.radius = -4;
    camera.heightOffset = -4; //  between camera and object
    camera.rotation.x = -45;
    camera.cameraAcceleration = 0.1;
    camera.lockedTarget = parentMesh;
    camera.noRotationConstraint = true;
}

async function makeGui(sceneToLoad: Scene): Promise<void> {
    const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("ui", true, sceneToLoad);
    
    const titleImg = new Image("logoTitle","assets/textures/UI/logo.svg");
    titleImg.height = 0.3;
    titleImg.stretch = Image.STRETCH_UNIFORM;
    titleImg.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    titleImg.top = (window.innerHeight / 10);
    guiMenu.addControl(titleImg);

    const fontSizePercentage = 0.06;

    const soloBtn = await simpleButton("soloBtn","Solo",fontSizePercentage,0.12,-((window.innerHeight / 20) *6 ),  Control.VERTICAL_ALIGNMENT_BOTTOM);
    guiMenu.addControl(soloBtn);
    soloBtn.onPointerClickObservable.add(() => {
        this.goToSoloMenu();

        this._soundManager.confirmSoundPlay();
    })

    const multiBtn = await simpleButton("multiBtn","Multiplayer",fontSizePercentage,0.12,-((window.innerHeight / 20) * 3.5 ),  Control.VERTICAL_ALIGNMENT_BOTTOM);
    guiMenu.addControl(multiBtn);
    multiBtn.onPointerClickObservable.add(() => {
        this.goToMultiMenu();

        this._soundManager.confirmSoundPlay();
    })

    const optionsBtn = await simpleButton("optionsBtn","Options",fontSizePercentage,0.12,-(window.innerHeight / 20),  Control.VERTICAL_ALIGNMENT_BOTTOM);
    optionsBtn.onPointerClickObservable.add(() => {
        
        this.goToOptionsMenu();
        this._soundManager.confirmSoundPlay();
    })
    guiMenu.addControl(optionsBtn);

    window.addEventListener("resize", () => {
        soloBtn.fontSizeInPixels = ((window.innerHeight + window.innerWidth) / 2) * fontSizePercentage;
        multiBtn.fontSizeInPixels = ((window.innerHeight + window.innerWidth) / 2) * fontSizePercentage;
        optionsBtn.fontSizeInPixels = ((window.innerHeight + window.innerWidth) / 2) * fontSizePercentage;
    });
}