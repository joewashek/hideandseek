import { Button, TextBlock, Image, Rectangle, Grid, ImageBasedSlider, StackPanel } from '@babylonjs/gui';

export async function simpleButton(name: string, text: string, fontSizePercentage: number,height: number, top: number, verticalAlign: number): Promise<Button>{
    const button = Button.CreateSimpleButton(name, text);

    button.color = "white";
    button.fontFamily = "MedievalSharp";
    button.height = height;
    button.fontSizeInPixels = ((window.innerHeight + window.innerWidth) / 2) * fontSizePercentage;
    button.thickness = 0;
    button.top = top;
    button.verticalAlignment = verticalAlign;

    button.onPointerEnterObservable.add(() => {
        button.color = "yellow";
    })
    button.onPointerOutObservable.add(() => {
        button.color = "white";
    })

    return button;
}

export async function image(name: string, textureUrl: string,height: number,width: number, top: number,left:number, horizontalAlign:number, verticalAlign: number): Promise<Image>{
    const image = new Image(name, textureUrl);

    image.height = height;
    image.width = width;
    image.top = top;
    image.left = left;
    image.horizontalAlignment = horizontalAlign;
    image.verticalAlignment = verticalAlign;

    return image;
}

export async function rectangle(name: string, height: number,width: number, thickness:number,backgroundColor:string):Promise<Rectangle> {
    const rectangle = new Rectangle(name);
    rectangle.height = height;
    rectangle.width = width;
    rectangle.thickness = thickness;
    rectangle.background = backgroundColor;

    return rectangle;
}

export async function imageButton(name: string, text: string, spriteUrl: string, fontSizePercentage: number,height: number, top: number, verticalAlign: number): Promise<Button>{
    const button = Button.CreateImageButton(name, text,spriteUrl);

    button.color = "white";
    button.background = "#9DC985";
    button.fontFamily = "MedievalSharp";
    button.height = height;
    button.fontSizeInPixels = ((window.innerHeight + window.innerWidth) / 2) * fontSizePercentage;
    button.thickness = 0;
    button.top = top;
    button.verticalAlignment = verticalAlign;

    button.onPointerEnterObservable.add(() => {
        button.color = "yellow";
    })
    button.onPointerOutObservable.add(() => {
        button.color = "white";
    })

    return button;
}

export async function simpleTextBlock(name:string, text: string, color: string, fontSize: number, height: number, top:number,verticalAlign: number):Promise<TextBlock> {
    const textBlock = new TextBlock(name, text);
    textBlock.color = color;
    textBlock.fontFamily = "MedievalSharp";
    textBlock.fontSizeInPixels = ((window.innerHeight + window.innerWidth) / 2 ) * fontSize;
    textBlock.height = height;
    textBlock.top = top;
    textBlock.verticalAlignment = verticalAlign;

    return textBlock;
}

export async function simpleSlider(sliderName: string, sliderText: string, defaultVol: number, grid: Grid,row: number,fontSize: number):Promise<ImageBasedSlider> {
    const header = new TextBlock(sliderName,sliderText);
    header.color = 'white';
    header.fontFamily = "MedievalSharp";
    header.fontSizeInPixels = ((window.innerHeight + window.innerWidth) / 2 ) * fontSize * 0.4;
    header.textWrapping = true;
    grid.addControl(header,row,0);

    const panel = new StackPanel();
    panel.width = window.innerWidth /2 + "px";
    grid.addControl(panel, row, 1);

    const slider = new ImageBasedSlider("slider");
    slider.minimum = 0;
    slider.maximum = 100;
    slider.height = "50px";
    slider.width = window.innerWidth / 2 + "px";
    slider.backgroundImage = new Image("back","assets/textures/UI/backgroundImage.png");
    slider.backgroundImage.stretch = Image.STRETCH_EXTEND;
    slider.valueBarImage = new Image("value", "assets/textures/UI/valueImage.png");
    slider.valueBarImage.stretch = Image.STRETCH_EXTEND;
    slider.value = defaultVol;
    panel.addControl(slider);

    return slider;
}