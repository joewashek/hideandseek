import { AssetsManager,Sound,SoundTrack } from "@babylonjs/core";

export class SoundManager{

    private _assetManager: AssetsManager;

    // Soundtracks
    private _ambientSoundtrack: SoundTrack;
    private _musicSoundtrack: SoundTrack;
    private _sfxSoundtrack: SoundTrack;

    private _ambientSoundtrackVol: number = 1;
    private _musicSoundtrackVol: number = 1;
    private _sfxSoundtrackVol: number = 1;

    private _startAmbient: Sound;
    private _mainMenuMusic: Sound;
    private _gameMusic: Sound;
    private _confirmSound: Sound;
    private _backSound: Sound;
    private _pauseSound: Sound;
    private _unpauseSound: Sound;
    private _collectSound: Sound;
    private _walkSound: Sound;

    constructor(){
        // don't link to scene
        this._assetManager = new AssetsManager(null);

        this._ambientSoundtrack = new SoundTrack(null);
        this._musicSoundtrack = new SoundTrack(null);
        this._sfxSoundtrack = new SoundTrack(null);

        this.loadSounds();
    }

    private async loadSounds(): Promise<void> {

        let taskStart = this._assetManager.addBinaryFileTask("startAmbient", "assets/sounds/ambient/Forest_Ambience.mp3");
        taskStart.onSuccess = (task) => {
            this._startAmbient = new Sound("startAmbient", task.data, null, ()=>{this.startAmbientPlay()}, { autoplay: false, loop: true});
            this._ambientSoundtrack.addSound(this._startAmbient);
        }

        let taskMainMenu = this._assetManager.addBinaryFileTask("mainMenuMusic", "assets/sounds/musics/041415calmbgm.wav");
        taskMainMenu.onSuccess = (task) => {
            this._mainMenuMusic = new Sound("mainMenuMusic", task.data, null, null, { autoplay: false, loop: true});
            this._musicSoundtrack.addSound(this._mainMenuMusic);
        }

        let taskGame = this._assetManager.addBinaryFileTask("startAmbient", "assets/sounds/musics/spring-day.mp3");
        taskGame.onSuccess = (task) => {
            this._gameMusic = new Sound("gameMusic", task.data, null, null, { autoplay: false, loop: true});
            this._musicSoundtrack.addSound(this._gameMusic);
        }

        let taskConfirmSound = this._assetManager.addBinaryFileTask("confirmSound", "assets/sounds/sfx/Menu Soundpack 3.wav");
        taskConfirmSound.onSuccess = (task) => {
            // we only want a small part of the sound file, so set the length and offset (like a sprite)
            this._confirmSound = new Sound("confirmSound", task.data, null, null, { autoplay: false, loop: false, length:1, offset:0});
            this._sfxSoundtrack.addSound(this._confirmSound);
        }

        let taskBackSound = this._assetManager.addBinaryFileTask("backSound", "assets/sounds/sfx/029_Decline_09.wav");
        taskBackSound.onSuccess = (task) => {
            this._backSound = new Sound("backSound", task.data, null, null, { autoplay: false, loop: false});
            this._sfxSoundtrack.addSound(this._backSound);
        }

        let taskPauseSound = this._assetManager.addBinaryFileTask("pauseSound", "assets/sounds/sfx/092_Pause_04.wav");
        taskPauseSound.onSuccess = (task) => {
            this._pauseSound = new Sound("pauseSound", task.data, null, null, { autoplay: false, loop: false});
            this._sfxSoundtrack.addSound(this._pauseSound);
        }

        let taskUnpauseSound = this._assetManager.addBinaryFileTask("unpauseSound", "assets/sounds/sfx/098_Unpause_04.wav");
        taskUnpauseSound.onSuccess = (task) => {
            this._unpauseSound = new Sound("unpauseSound", task.data, null, null, { autoplay: false, loop: false});
            this._sfxSoundtrack.addSound(this._unpauseSound);
        }

        let taskCollectSound = this._assetManager.addBinaryFileTask("collectSound", "assets/sounds/sfx/coin.wav");
        taskCollectSound.onSuccess = (task) => {
            this._collectSound = new Sound("collectSound", task.data, null, null, { autoplay: false, loop: false});
            this._sfxSoundtrack.addSound(this._collectSound);
        }

        let taskWalkSound = this._assetManager.addBinaryFileTask("walkSound", "assets/sounds/sfx/sfx_step_grass_l.flac");
        taskWalkSound.onSuccess = (task) => {
            this._walkSound = new Sound("walkSound", task.data, null, null, { autoplay: false, loop: false});
            this._sfxSoundtrack.addSound(this._walkSound);
        }

        this._assetManager.load();
    }

    public backSoundPlay(){
        if(this._backSound)
            this._backSound.play();
    }

    public collectSoundPlay(){
        if(this._collectSound)
            this._collectSound.play();
    }

    public confirmSoundPlay(){
        if(this._confirmSound)
            this._confirmSound.play();
    }

    public pauseSoundPlay(){
        if(this._pauseSound)
            this._pauseSound.play();
    }

    public unpauseSoundPlay(){
        if(this._unpauseSound)
            this._unpauseSound.play();
    }

    public walkSoundPlay(){
        if(!this._walkSound.isPlaying){
            this._walkSound.setPlaybackRate(Math.random()* (1.1 - 0.9) + 0.9);
            this._walkSound.setVolume(Math.random()* (1.1 - 0.9) + 0.9);
            this._walkSound.play();
        }
        
    }

    public gameMusicPlay(){
        if(this._gameMusic && !this._gameMusic.isPlaying)
            this._gameMusic.play();
    }
    public gameMusicStop(){
        if(this._gameMusic)
            this._gameMusic.stop();
    }

    public mainMenuMusicPlay(){
        if(this._mainMenuMusic && !this._mainMenuMusic.isPlaying)
            this._mainMenuMusic.play();
    }
    public mainMenuMusicStop(){
        if(this._mainMenuMusic)
            this._mainMenuMusic.stop();
    }
    public startAmbientPlay(){
        if(!this._startAmbient.isPlaying)
            this._startAmbient.play();
    }
    
   
    public startAmbientStop(){
        if(this._startAmbient)
            this._startAmbient.stop();
    }

    public getAmbientVolume():number{
        return this._ambientSoundtrackVol * 100;
    }

    public getMusicVolume():number{
        return this._musicSoundtrackVol * 100;
    }

    public getSfxVolume():number{
        return this._sfxSoundtrackVol * 100;
    }

    public setAmbientVolume(volume:number):void{
        this._ambientSoundtrackVol = volume / 100;
        this._ambientSoundtrack.setVolume(this._ambientSoundtrackVol);
    }

    public setMusicVolume(volume:number):void{
        this._musicSoundtrackVol = volume / 100;
        this._musicSoundtrack.setVolume(this._musicSoundtrackVol);
    }

    public setSfxVolume(volume:number):void{
        this._sfxSoundtrackVol = volume / 100;
        this._sfxSoundtrack.setVolume(this._sfxSoundtrackVol);
    }
}