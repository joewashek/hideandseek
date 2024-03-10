import { ActionManager, FollowCamera, Mesh,MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";
import { animatedStandardMaterial } from "../helpers/sprint_generator";
import { GameStatus } from "../app";

enum NpcState { WATCHING = 0, WALKING_RIGHT = 1,WALKING_LEFT = 2,WALKING_UP = 3,WALKING_DOWN = 4 }

type NpcAnimations = {
    watching: StandardMaterial,
    moving_left: StandardMaterial,
    moving_right: StandardMaterial,
    moving_up: StandardMaterial,
    moving_down: StandardMaterial,
}

export class Npc {

    private _scene: Scene;

    // Character main components
    private _npcName: string;
    private _npcMesh: Mesh;
    private _npcType: string;

    private static readonly NPC_SPEED: number = 0.05;
    private _npcFunction: any;
    private _positionDestination: Vector3;
    private _moveDirection: Vector3 = Vector3.Zero();

    // NPC animation
    private _npcAnimations: NpcAnimations = {
        watching: null,
        moving_left: null,
        moving_right: null,
        moving_down: null,
        moving_up: null
    };

    private _npcStateAnimation: number = 0;

    private _isAlreadyColliding: boolean = false;

    constructor(gameStatus: GameStatus, npcName: string, npcType: string, defaultPosX: number, defaultPosY: number){
        this._scene = gameStatus._scene;
        this._npcName = npcName;
        this._npcType = npcType;

        this.setupNpcAnimations();
        this.setupNpcMesh(gameStatus,defaultPosX,defaultPosY);
        this.setupAiGoals();
        this.beforeRenderUpdate(gameStatus);
    }

    private beforeRenderUpdate(gameStatus: GameStatus): void{
        this._scene.registerBeforeRender(() => {
            if(gameStatus._isPaused) 
                return;
            this.updateNpcPosition();
            this.updateNpcAnimationState();
        });
    }

    private async setupAiGoals(){
        this._npcFunction = setInterval(()=> {
            const behaviorGoal = Math.floor(Math.random() * 2);

            if(behaviorGoal){
                const randPosX = Math.random() * (16 - (-16)) + (-16);    
                const randPosY = Math.random() * (16 - (-16)) + (-16);

                this._positionDestination = new Vector3(randPosX,randPosY),0;
            }
        }, 10000);
        
    }

    private async setupNpcAnimations(){
        for(const key in this._npcAnimations){
            this._npcAnimations[key] = await animatedStandardMaterial(this._scene, `assets/sprites/animals/${this._npcType}_${key}.png`,"npcMat"+key,
            key === "watching" ? 6 : 4,key === "watching" ? 2 : 1,150);
        }
    }

    private async setupNpcMesh(gameStatus: GameStatus,defaultPosX:number,defaultPosY: number){
        this._npcMesh = MeshBuilder.CreatePlane(this._npcName,{ height:1, width: 1, sideOrientation: Mesh.DOUBLESIDE}, this._scene);
        this._npcMesh.position.x = defaultPosX;
        this._npcMesh.position.y = defaultPosY;
        this._npcMesh.position.z = -0.4;
        this._npcMesh.rotation.x = -45;
        this._npcMesh.material = this._npcAnimations.watching;

        this._npcMesh.actionManager = await new ActionManager(this._scene);
        this._scene.onBeforeRenderObservable.add(()=>{
            if(this._scene.getMeshByName("playerMesh1") && (this._npcMesh.intersectsMesh(this._scene.getMeshByName("playerMesh1"))&& !this._isAlreadyColliding)){
                this._isAlreadyColliding = true;
                
                gameStatus._hud.IncrementNpcCounter(this._npcMesh,1);
                this._npcMesh.isVisible = false;
            }
            if(this._scene.getMeshByName("playerMesh2") && (this._npcMesh.intersectsMesh(this._scene.getMeshByName("playerMesh2"))&& !this._isAlreadyColliding)){
                this._isAlreadyColliding = true;
                
                gameStatus._hud.IncrementNpcCounter(this._npcMesh,2);
                this._npcMesh.isVisible = false;
            }
        });
    }

    private updateNpcPosition(){
        if(!this._positionDestination){
            return;
        }

        const rawDirection = this._positionDestination.subtract(this._npcMesh.position);
        const distance = rawDirection.length();

        if(distance > 1){
            this._moveDirection = rawDirection.normalize().scaleInPlace(Npc.NPC_SPEED);
            this._npcMesh.moveWithCollisions(this._moveDirection);
        }else{
            this._moveDirection = Vector3.Zero();
        }
    }

    private updateNpcAnimationState():void{
        if(this._moveDirection.x === 0 && this._moveDirection.y === 0){
            this._npcStateAnimation = NpcState.WATCHING;
            this._npcMesh.material = this._npcAnimations.watching;
        }

        if(this._moveDirection.y > 0){
            this._npcStateAnimation = NpcState.WALKING_UP;
            this._npcMesh.material = this._npcAnimations.moving_up;
        }

        if(this._moveDirection.y < 0){
            this._npcStateAnimation = NpcState.WALKING_DOWN
            this._npcMesh.material = this._npcAnimations.moving_down;
        }

        if(this._moveDirection.x > 0){
            this._npcStateAnimation = NpcState.WALKING_RIGHT
            this._npcMesh.material = this._npcAnimations.moving_right;
        }

        if(this._moveDirection.x < 0){
            this._npcStateAnimation = NpcState.WALKING_LEFT
            this._npcMesh.material = this._npcAnimations.moving_left;
        }
     }
}