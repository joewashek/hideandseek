import { SpriteManager, Sprite, Scene, Vector3, SpritePackedManager, Vector2, AssetsManager, Engine, SpriteMap, Texture, StandardMaterial, MeshBuilder, Mesh } from '@babylonjs/core';

export async function spriteRandomGenerator(
    scene:Scene,
    spriteName: string,
    spriteUrl: string,
    height: number,
    width: number,
    qty: number,
    min: number,
    max: number,
    zPos: number,
    sprintHeight: number,
    spriteWidth: number,
    isAnimated = false as boolean,
    numberFrames?: number
): Promise<void>{

    const spriteManager: SpriteManager = new SpriteManager(`${spriteName}Manager`, spriteUrl, 100, {width: width, height: height}, scene);

    for (let i = 0; i < qty; i++) {
        const randPosX = Math.random() * (max - min) + min;    
        const randPosY = Math.random() * (max - min) + min;

        const sprite: Sprite = new Sprite(`${spriteName}_{i}`,spriteManager); 
        
        sprite.height = sprintHeight;
        sprite.width = spriteWidth;
        sprite.position = new Vector3(randPosX, randPosY, zPos);

        if(isAnimated){
            sprite.playAnimation(0,numberFrames, true,  150);
        }
    }
}

export async function spritePackRandomGenerator(spritePack:SpritePackedManager, spriteName: string, spriteCellRef: string,
    qty: number, min: number, max: number, zPos: number, spriteHeight: number, spriteWidth: number):Promise<void> {
    for (let i = 1; i < qty; i++){
        const randPosX = Math.random() * (max - min) + min;    
        const randPosY = Math.random() * (max - min) + min;
        const sprite: Sprite = new Sprite(`${spriteName}_{i}`,spritePack); 
        sprite.cellRef = spriteCellRef;

        sprite.height = spriteHeight;
        sprite.width = spriteWidth;
        sprite.position = new Vector3(randPosX, randPosY, zPos);
    }
}

export async function spriteMapGenerator(scene:Scene, textureUrl: string, titleMapJsonUrl: string, tileMapFileUrl: string, backgroundSize: Vector2, outputSize: Vector2) {
    const spriteSheet: Texture = new Texture(textureUrl,scene, false,false,Texture.NEAREST_NEAREST,null,null,null,false,Engine.TEXTUREFORMAT_RGBA);
    
    const assetsManager:AssetsManager = new AssetsManager(scene);
    assetsManager.autoHideLoadingUI = true;
    const textTask = assetsManager.addTextFileTask("taskBackground", titleMapJsonUrl);

    textTask.onSuccess = (task) => {
        let atlasJson = JSON.parse(task.text);

        let spriteMap: SpriteMap = new SpriteMap("spriteMap", atlasJson, spriteSheet, {
            stageSize: backgroundSize,
            outputSize: outputSize,
            outputPosition: Vector3.Zero(),
            outputRotation: Vector3.Zero(),
            baseTile: 0,
            flipU: true
        }, scene);

        spriteMap.loadTileMaps(tileMapFileUrl);

        // prevent sprite from disappearing behind because of z index
        const spriteMapObj: any = scene.getNodeByName("spriteMap:output");
        spriteMapObj.alphaIndex = 0;
    }

    await assetsManager.loadAsync();
}

export async function animatedStandardMaterial(scene:Scene, textureUrl: string, standardMaterialName: string, columnsNumber: number, linesNumber: number, timeInterval:number):Promise<StandardMaterial> {
    const texture = new Texture(textureUrl, scene);
    texture.hasAlpha = true;
    texture.uScale = 1 / columnsNumber;
    texture.vScale = 1 / linesNumber;
    texture.uOffset = 0;
    texture.vOffset = 1 / linesNumber;

    setInterval(() => {
        if(texture.uOffset >= (1-(1/columnsNumber))){
            texture.uOffset = 0;

            switch(texture.vOffset){
                case 0:
                    texture.vOffset = 1 / linesNumber;
                    break;
                case 1:
                    texture.vOffset = 0;
                    break;
            }
        }else{
            texture.uOffset += 1 / columnsNumber;
        }
    },timeInterval);

    let animatedMaterial = new StandardMaterial(standardMaterialName, scene);
    animatedMaterial.diffuseTexture = texture;
    animatedMaterial.diffuseTexture.hasAlpha = true;

    // this makes the image look better, less pixelly
    animatedMaterial.emissiveTexture = texture;
    animatedMaterial.emissiveTexture.hasAlpha = true;
    animatedMaterial.useAlphaFromDiffuseTexture = true;

    return animatedMaterial;
}

export async function spriteMeshGenerator(scene: Scene, texture: Texture,material: StandardMaterial, spriteMeshName: string, min: number,max: number, zPos: number, scalingX:number,scalingY:number,qty:number){
    for(let i = 1;i < qty;i++){
        const randPosX = Math.random() * (max - min) + min;    
        const randPosY = Math.random() * (max - min) + min;

        const spriteMesh = MeshBuilder.CreatePlane(`${spriteMeshName}_${i}`,{ height:1, width: 1, sideOrientation: Mesh.DOUBLESIDE}, scene);

        spriteMesh.position.x = randPosX;
        spriteMesh.position.y = randPosY;
        spriteMesh.position.z = zPos;
        spriteMesh.rotation.x = -45;

        spriteMesh.scaling.x = scalingX;
        spriteMesh.scaling.y = scalingY;

        //let animatedMaterial = new StandardMaterial(standardMaterialName, scene);
        material.diffuseTexture = texture;
        material.diffuseTexture.hasAlpha = true;
    
        // this makes the image look better, less pixelly
        material.emissiveTexture = texture;
        material.emissiveTexture.hasAlpha = true;
        material.useAlphaFromDiffuseTexture = true;

        spriteMesh.material = material;
    }
}