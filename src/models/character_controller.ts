import { FollowCamera, Mesh,MeshBuilder,Scene, Sound, StandardMaterial, Vector3,Viewport } from "@babylonjs/core";
import { animatedStandardMaterial } from "../helpers/sprint_generator";
import { InputController } from "./input_controller";
import { GameStatus,PlayerControls } from "../app";
import { SoundManager } from "./sound_manager";

enum CharacterState { WATCHING = 0, WALKING_RIGHT = 1,WALKING_LEFT = 2,WALKING_UP = 3,WALKING_DOWN = 4 }

type CharacterAnimations = {
    watching: StandardMaterial,
    moving_left: StandardMaterial,
    moving_right: StandardMaterial,
    moving_down: StandardMaterial,
    moving_up: StandardMaterial,
}

export class CharacterController {

    private _input: InputController;
    private _soundManager: SoundManager;
    private _scene: Scene;

    // Character main components
    private _characterCamera: FollowCamera;
    private _characterMesh: Mesh;
    private _playerId: number;
    private _IsUnique: boolean;
    // Character movement components
    private static readonly CHARACTER_SPEED: number = 0.15;
    private _moveDirection: Vector3 = new Vector3();
    private _horizontal: number;
    private _vertical: number;
    private _inputAmt: number;
    private _deltaTime: number = 0;

    // character animation components
    private _characterAnimations: CharacterAnimations = {
        watching: null,
        moving_left: null,
        moving_right: null,
        moving_down: null,
        moving_up: null,
    }
    private _characterStateAnimation: number = 0;

    constructor(gameStatus: GameStatus,soundManager: SoundManager,playerId:number) {
        this._scene = gameStatus._scene;
        this._input = new InputController(gameStatus,playerId);
        this._playerId = playerId;
        this._IsUnique = gameStatus._playerNumber === 1;
        this._soundManager = soundManager;
        this.setupCharacterAnimations();
        this.setupCharacterMesh();
        this.setupCharacterCamera();
        this.beforeRenderUpdate(gameStatus);
    }

    private beforeRenderUpdate(gameStatus: GameStatus): void{
        this._scene.registerBeforeRender(() => {
            if(gameStatus._isPaused)
                return;
            this.updateFromControls();
            this.updateCharacterAnimationState();
        });
    }

    private async setupCharacterAnimations(){
        for(const key in this._characterAnimations){
            const colCount = key == 'watching' ? 8 : 10;
            const staticPos = key == 'watching' ? 1 : -1;
            this._characterAnimations[key] = await animatedStandardMaterial(this._scene, `assets/sprites/character/spearman${this._playerId}_${key}.png`,"characterMat"+key,colCount,1,160,staticPos);
        }
    }

    private async setupCharacterMesh(){
        this._characterMesh = MeshBuilder.CreatePlane(`playerMesh${this._playerId}`,{ height:1, width: 1, sideOrientation: Mesh.DOUBLESIDE}, this._scene);
        this._characterMesh.position.z = -0.4;
        this._characterMesh.rotation.x = -45;
        this._characterMesh.material = this._characterAnimations.watching;
    }

    private async setupCharacterCamera(){
        this._characterCamera = new FollowCamera("followCam", new Vector3(0,-3, -10),this._scene);
        this._characterCamera.radius = -3.5;
        this._characterCamera.heightOffset = -3.5; //  between camera and object
        this._characterCamera.rotation.x = -45;
        this._characterCamera.cameraAcceleration = 0.1;
        this._characterCamera.maxCameraSpeed =1;
        this._characterCamera.lockedTarget = this._characterMesh;
        this._characterCamera.noRotationConstraint = true;

        if(!this._IsUnique){
            this._characterCamera.viewport = new Viewport(this._playerId ===1?0:0.5,0,0.5,1);
        }
        this._characterCamera.layerMask = this._playerId;
        // separate camere, but have same ui
        this._scene.activeCameras.unshift(this._characterCamera);
    }

     private updateFromControls(): void{
        this._deltaTime = this._scene.getEngine().getDeltaTime() / 1000;
        this._moveDirection = Vector3.Zero();
        this._horizontal = this._input.horizontal;
        this._vertical = this._input.vertical;

        let move = new Vector3(this._horizontal, this._vertical, 0);
        this._moveDirection = new Vector3((move).normalize().x,move.normalize().y,0);

        let inputMag = Math.abs(this._horizontal) + Math.abs(this._vertical);
        if(inputMag < 0){
            this._inputAmt = 0;
        }else if(inputMag > 1){
            this._inputAmt = 1;
        }else{
            this._inputAmt = inputMag;
        }

        this._moveDirection = this._moveDirection.scaleInPlace(this._inputAmt * CharacterController.CHARACTER_SPEED);

        const moveDirectionLimited = new Vector3(
            ((this._characterMesh.position.x > 16 && this._moveDirection.x > 0) || (this._characterMesh.position.x < -16 && this._moveDirection.x < 0))? 0 : this._moveDirection.x,
            ((this._characterMesh.position.y > 16 && this._moveDirection.y > 0) || (this._characterMesh.position.y < -16 && this._moveDirection.y < 0))? 0 : this._moveDirection.y,
        );

        this._characterMesh.moveWithCollisions(moveDirectionLimited);
     }

     private updateCharacterAnimationState():void{
        if(this._moveDirection.x === 0 && this._moveDirection.y === 0){
            this._characterStateAnimation = CharacterState.WATCHING;
            this._characterMesh.material = this._characterAnimations.watching;
        }

        if(this._moveDirection.y > 0){
            this._characterStateAnimation = CharacterState.WALKING_UP;
            this._characterMesh.material = this._characterAnimations.moving_up;
        }

        if(this._moveDirection.y < 0){
            this._characterStateAnimation = CharacterState.WALKING_DOWN
            this._characterMesh.material = this._characterAnimations.moving_down;
        }

        if(this._moveDirection.x > 0){
            this._characterStateAnimation = CharacterState.WALKING_RIGHT
            this._characterMesh.material = this._characterAnimations.moving_right;
        }

        if(this._moveDirection.x < 0){
            this._characterStateAnimation = CharacterState.WALKING_LEFT
            this._characterMesh.material = this._characterAnimations.moving_left;
        }

        if(this._moveDirection.x !== 0 || this._moveDirection.y !== 0){
            this._soundManager.walkSoundPlay();
        }
     }
}