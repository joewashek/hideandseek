import { Color3, Color4, CubeTexture, Mesh, ParticleSystem, Scene, StandardMaterial, Texture, Vector2, Vector3} from "@babylonjs/core"
import { spriteMapGenerator, spriteMeshGenerator } from "../helpers/sprint_generator"
import { Npc } from "./npc";
import { GameStatus } from "../app";

export enum NpcType { RABBIT = "rabbit"}

export class Environment{
    
    private _scene: Scene;

    constructor(gameStatus: GameStatus){
        this._scene = gameStatus._scene;

        this.initMap(gameStatus);
    }

    private async initMap(gameStatus: GameStatus):Promise<void>{
        await spriteMapGenerator(
            this._scene, 
            "assets/textures/tile_map_texture.png", 
            "assets/tilemaps/tile_map_texture.json",
            "assets/tilemaps/menu_tile_map.tilemaps",
            new Vector2(4,4),
            new Vector2(40, 40),
            )

        const material1 = new StandardMaterial("treeRound", this._scene);
        const texture1 = new Texture("assets/textures/environment/tree_cartoon_med.png",this._scene);
        await spriteMeshGenerator(this._scene,texture1,material1,"treeRound",-16,16,-2.5,2,3,20);

        const material3 = new StandardMaterial("grass", this._scene);
        const texture3 = new Texture("assets/textures/environment/grass.png",this._scene);
        await spriteMeshGenerator(this._scene,texture3,material3,"treeRound",-16,16,-0.2,1,1,10);

        const material4 = new StandardMaterial("rock", this._scene);
        const texture4 = new Texture("assets/textures/environment/rock.png",this._scene);
        await spriteMeshGenerator(this._scene,texture4,material4,"treeRound",-16,16,-0.1,0.5,0.5,10);

        const material5 = new StandardMaterial("statue", this._scene);
        const texture5 = new Texture("assets/textures/environment/statue.png",this._scene);
        await spriteMeshGenerator(this._scene,texture5,material5,"treeRound",-16,16,-0.4,1,1,5);

       for (let i = 0; i < 10; i++) {
            const randPosX = Math.random() * (16 - (-16)) + (-16);    
            const randPosY = Math.random() * (16 - (-16)) + (-16);

            new Npc(gameStatus, "rabbit", NpcType.RABBIT, randPosX, randPosY);
       }
            
        const skybox = Mesh.CreateBox("skyBox",100,this._scene);
        const skyboxMaterial = new StandardMaterial("skyBoxMat",this._scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new CubeTexture("assets/textures/skybox/skybox_water",this._scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;

        // don't want cube texture to give any reflection or color from skybox
        skyboxMaterial.diffuseColor = new Color3(0,0,0);
        skyboxMaterial.specularColor = new Color3(0,0,0);
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;

        await this.fog();
    }

    private async fog(){
        let particleSystem: ParticleSystem = new ParticleSystem("particleSys",500,this._scene);
        const fogTexture = new Texture("assets/textures/smoke.png",this._scene);
        const emitterParticles = Mesh.CreateBox("emitterParticles", .01, this._scene);

        emitterParticles.position.z = -1;
        emitterParticles.rotationQuaternion = new Vector3(Math.PI/2,0,0).toQuaternion();
        emitterParticles.visibility = 0;

        particleSystem.manualEmitCount = particleSystem.getCapacity();
        particleSystem.minEmitBox = new Vector3(-16, 2, -16);
        particleSystem.maxEmitBox = new Vector3(16, 2, 16);
        particleSystem.particleTexture = fogTexture.clone();
        particleSystem.emitter = emitterParticles;

        particleSystem.color1 = new Color4(0.8,0.8,0.8,0.85);
        particleSystem.color2 = new Color4(0.95,0.95,0.95,0.95);
        particleSystem.colorDead = new Color4(0.9,0.9,0.9,0.6);
        particleSystem.minSize = 3.5;
        particleSystem.maxSize = 5;
        particleSystem.minLifeTime = Number.MAX_SAFE_INTEGER;
        particleSystem.emitRate = 5000;
        particleSystem.blendMode = ParticleSystem.BLENDMODE_STANDARD;
        particleSystem.gravity = new Vector3(0,0,0);
        particleSystem.direction1 = new Vector3(0,0,0);
        particleSystem.minAngularSpeed = -2;
        particleSystem.maxAngularSpeed = 2;
        particleSystem.minEmitPower = 0.5;
        particleSystem.maxEmitPower = 1;
        particleSystem.updateSpeed = 0.005;

        particleSystem.renderingGroupId = 1;
        particleSystem.start();
    }
}