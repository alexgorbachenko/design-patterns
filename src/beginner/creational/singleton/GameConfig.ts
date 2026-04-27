type GraphicsQuality = "Low" | "Medium" | "High";

export class GameConfig {

    private static instance: GameConfig | undefined;

    private serverRegion: string;
    private graphicsQuality: GraphicsQuality;
    private soundEnabled: boolean;
    private musicVolume: number;
    private displayFps: boolean;

    private constructor() {
        this.serverRegion = 'US-East';
        this.graphicsQuality = "Low";
        this.soundEnabled = true;
        this.musicVolume = 50;
        this.displayFps = true;
    };

    public static getInstance = (): GameConfig => {
        if(!this.instance)
            this.instance = new GameConfig();
        return this.instance;
    }

    public static resetInstance = (): void => {
        this.instance = undefined;
    }

    public reset = (): void => {
        this.setServerRegion('US-East');
        this.setGraphicsQuality("Low");
        this.setSoundEnabled(true);
        this.setMusicVolume(50);
        this.setDisplayFps(true);
    }

    public printConfig = (): void => {
        console.log(`serverRegion: ${this.serverRegion}, graphicsQuality: ${this.graphicsQuality}, soundEnabled: ${this.soundEnabled}, musicVolume: ${this.musicVolume}, displayFps: ${this.displayFps}`);
    }

    public getServerRegion = (): string => {
        return this.serverRegion;
    }

    public setServerRegion = (region: string): void => {
        this.serverRegion = region;
    }

    public getGraphicsQuality = (): GraphicsQuality => {
        return this.graphicsQuality;
    }

    public setGraphicsQuality = (graphicsQuality: GraphicsQuality): void => {
        this.graphicsQuality = graphicsQuality;
    }

    public getSoundEnabled = (): boolean => {
        return this.soundEnabled;
    }

    public setSoundEnabled = (enableSound: boolean): void => {
        this.soundEnabled = enableSound;
    }

    public getMusicVolume = (): number => {
        return this.musicVolume;
    }

    public setMusicVolume = (volume: number): void => {
        this.musicVolume = volume;
    }

    public getDisplayFps = (): boolean => {
        return this.displayFps;
    }

    public setDisplayFps = (displayFps: boolean): void => {
        this.displayFps = displayFps;
    }
}