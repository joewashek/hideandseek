import { Engine, Scene } from "@babylonjs/core";
import { start } from "./states/start"
import { mainMenu } from "./states/main_menu";
import { soloMenu } from "./states/solo_menu";
import { disposeGame,initGame,game } from "./states/game";
import { win } from "./states/win";
import { lose } from "./states/lose";
import { multiMenu } from "./states/multi_menu";
import { options } from "./states/options";


// Models
import { CharacterController } from "./models/character_controller";
import { Environment } from "./models/environments"
import { Hud } from "./models/hud";
import { SoundManager } from "./models/sound_manager";

export enum State { START = 0, MAIN_MENU = 1, SOLO_MENU = 2, MULTI_MENU = 3, OPTIONS = 4, GAME_SOLO = 5, GAME_MULTI = 6, LOSE = 7, WIN = 8}

export type Status = {
    _scene: Scene,
    _state: number
}



export type GameStatus = {
    _characterController: CharacterController[],
    _controls: PlayerControls[],
    _environment: Environment,
    _scene: Scene,
    _hud: Hud,
    _isPaused: boolean,
    _isExit: boolean,
    _playerNumber: number
}

export type PlayerControls = {
    _up: string,
    _down: string,
    _left: string,
    _right: string
}

export class Game{

    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _status: Status = {
        _scene: null,
        _state: 0
    }

    protected _start = start;
    protected _mainMenu = mainMenu;
    protected _soloMenu = soloMenu;
    protected _game = game;
    protected _disposeGame = disposeGame;
    protected _initGame = initGame;
    protected _win = win;
    protected _lose = lose;
    protected _multiMenu = multiMenu;
    protected _options = options;

    // Game components
    protected _soundManager: SoundManager;
    protected _gameStatus: GameStatus = {
        _scene: null,
        _environment: null,
        _characterController: [],
        _controls: [
            {
                _up: "w",
                _down: "s",
                _left: "a",
                _right: "d"
            },
            {
                _up: "ArrowUp",
                _down: "ArrowDown",
                _left: "ArrowLeft",
                _right: "ArrowRight"
            }
        ],
        _hud: null,
        _isPaused: false,
        _isExit: false,
        _playerNumber: 1
    }

    constructor(){
        this.createCanvas();
        this.initialize();
    }

    private createCanvas(): void{
        document.documentElement.style["overflow"] = "hidden";
        document.documentElement.style.overflow = "hidden";
        document.documentElement.style.width = "100%";
        document.documentElement.style.height = "100%";
        document.documentElement.style.margin = "0";
        document.documentElement.style.padding = "0";
        document.body.style.overflow = "hidden";
        document.body.style.width = "100%";
        document.body.style.height = "100%";
        document.body.style.margin = "0";
        document.body.style.padding = "0";

        this._canvas = document.createElement("canvas");
        this._canvas.style.width = "100%";
        this._canvas.style.height = "100%";
        this._canvas.id = "gameCanvas";
        document.body.appendChild(this._canvas);
    }

    private initialize(): void{
        this._engine = new Engine(this._canvas, true);
        this._status._scene = new Scene(this._engine);

        this.main();
    }

    private async main(): Promise<void>{

        await this.goToStart();

        this._engine.runRenderLoop(() => {
            
            switch(this._status._state){
                case State.START:
                    this._status._scene.render();
                    break;
                case State.MAIN_MENU:
                    this._status._scene.render();
                    break;
                case State.SOLO_MENU:
                    this._status._scene.render();
                    break;
                case State.MULTI_MENU:
                    this._status._scene.render();
                    break;
                case State.GAME_SOLO:
                    this._status._scene.render();
                    break;
                case State.WIN:
                    this._status._scene.render();
                    break;
                case State.LOSE:
                    this._status._scene.render();
                    break;
                case State.GAME_MULTI:
                    this._status._scene.render();
                    break;
                case State.OPTIONS:
                    this._status._scene.render();
                    break;
                default: break;
            }
            //this._status._scene.render();
        });

        this._soundManager = new SoundManager();
        window.addEventListener("resize",()=> {
            this._engine.resize();
        })
    }

    protected async goToStart(): Promise<void> {
        await this._start(this._canvas, this._engine, this._status);
    }
    protected async goToMainMenu(): Promise<void> {
        this._soundManager.gameMusicStop();
        this._soundManager.mainMenuMusicPlay();
        this.resetGameStatus();
        await this._mainMenu(this._canvas, this._engine, this._status);
    }
    protected async goToSoloMenu(): Promise<void> {
        await this._soloMenu(this._canvas, this._engine, this._status);
    }
    protected async goToMultiMenu(): Promise<void> {
        this._gameStatus._playerNumber = 2;
        await this._multiMenu(this._canvas, this._engine, this._status);
    }
    protected async removeGame(): Promise<void> {
        await this._disposeGame(this._gameStatus);
    }
    protected async setupGame(): Promise<void> {
        await this._initGame(this._engine, this._gameStatus);
    }
    protected async goToGame(): Promise<void> {
        this._soundManager.mainMenuMusicStop();
        this._soundManager.gameMusicPlay();
        await this._game(this._canvas, this._engine, this._status, this._gameStatus);
    }
    protected async goToWinMenu(): Promise<void> {
        await this._win(this._canvas, this._engine, this._status, this._gameStatus);
    }
    protected async goToLoseMenu(): Promise<void> {
        await this._lose(this._canvas, this._engine, this._status, this._gameStatus);
    }
    protected async goToOptionsMenu(): Promise<void> {
        await this._options(this._canvas, this._engine, this._status);
    }

    private resetGameStatus(){
        this._gameStatus = {
            _controls:[
                {
                    _up: "w",
                    _down: "s",
                    _left: "a",
                    _right: "d"
                },
                {
                    _up: "ArrowUp",
                    _down: "ArrowDown",
                    _left: "ArrowLeft",
                    _right: "ArrowRight"
                }
            ],
            _scene: null,
            _environment: null,
            _characterController: [],
            _hud: null,
            _isPaused: false,
            _isExit: false,
            _playerNumber: 1
        }
    }
}

new Game();