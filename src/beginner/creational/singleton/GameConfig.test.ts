import { expect, test, describe, beforeEach } from '@jest/globals';
import { GameConfig } from './GameConfig';

describe("GameConfig Singleton", () => {
  beforeEach(() => {
    GameConfig.resetInstance();
  });

  test("returns the same instance on multiple calls", () => {
    const a = GameConfig.getInstance();
    const b = GameConfig.getInstance();
    expect(a).toBe(b);
  });

  test("reflects changes made through any reference", () => {
    const a = GameConfig.getInstance();
    const b = GameConfig.getInstance();
    a.setMusicVolume(75);
    expect(b.getMusicVolume()).toBe(75);
  });

  test("sets and gets serverRegion correctly", () => {
    GameConfig.getInstance().setServerRegion("EU-West");
    expect(GameConfig.getInstance().getServerRegion()).toBe("EU-West");
  });

  test("sets and gets graphicsQuality correctly", () => {
    GameConfig.getInstance().setGraphicsQuality("High");
    expect(GameConfig.getInstance().getGraphicsQuality()).toBe("High");
  });

  test("sets and gets soundEnabled correctly", () => {
    GameConfig.getInstance().setSoundEnabled(false);
    expect(GameConfig.getInstance().getSoundEnabled()).toBe(false);
  });

  test("resets instance correctly", () => {
    let a = GameConfig.getInstance();
    const b = GameConfig.getInstance();
    GameConfig.resetInstance();
    a = GameConfig.getInstance();
    expect(a).not.toBe(b);
  });

  test("resets values correctly", () => {
    const config = GameConfig.getInstance();
    config.setServerRegion("EU-West");
    config.setGraphicsQuality("High");
    config.setSoundEnabled(false);
    config.setMusicVolume(75);
    config.setDisplayFps(false);

    config.reset();

    expect(config.getServerRegion()).toBe("US-East");
    expect(config.getGraphicsQuality()).toBe("Low");
    expect(config.getSoundEnabled()).toBe(true);
    expect(config.getMusicVolume()).toBe(50);
    expect(config.getDisplayFps()).toBe(true);
  });


  test("printConfig does not throw", () => {
    expect(() => GameConfig.getInstance().printConfig()).not.toThrow();
  });
});