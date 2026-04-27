import { expect, test, describe, beforeEach } from '@jest/globals';
import { LineupBuilder } from "./LineupBuilder";

const quarterBack = 'Jared Goff';
const runningBack = 'Kyren Williams';
const wideReceiver = 'Puka Nacua';
const tightEnd = 'Colston Loveland';
const kicker = 'Cam Little';
const defense = 'Philadelphia Eagles';

describe("LineupBuilder", () => {
    let builder: LineupBuilder;

    beforeEach(() => {
        builder = new LineupBuilder();
    });

    test('builds a valid lineup with all required fields', () => {
        const lineup = builder
            .setQuarterback(quarterBack)
            .addRunningBack(runningBack)
            .addWideReceiver(wideReceiver)
            .setTightEnd(tightEnd)
            .setKicker(kicker)
            .setDefense(defense)
            .build();

        expect(lineup.quarterback).toEqual(quarterBack);
        expect(lineup.runningBacks).toContain(runningBack);
        expect(lineup.wideReceivers).toContain(wideReceiver);
        expect(lineup.tightEnd).toEqual(tightEnd);
        expect(lineup.kicker).toEqual(kicker);
        expect(lineup.defense).toEqual(defense);
    });

    test("throws if quarterback is missing", () => {
        expect(() =>
            builder.addRunningBack(runningBack).addWideReceiver(wideReceiver).build()
        ).toThrow('A quarterback is required');
    });

    test("throws if no running backs are set", () => {
        expect(() =>
            builder.setQuarterback(quarterBack).addWideReceiver(wideReceiver).build()
        ).toThrow('A running back is required');
    });

    test("throws if no wide receivers are set", () => {
        expect(() =>
            builder.setQuarterback(quarterBack).addRunningBack(runningBack).build()
        ).toThrow('A wide receiver is required');
    });

    test('Throws error when more than 2 running backs added', () => {
        expect(() => {
            builder.setQuarterback(quarterBack)
            .addWideReceiver(wideReceiver)
            .addRunningBack(runningBack)
            .addRunningBack('Derrick Henry')
            .addRunningBack('Saquon Barkley')
            .build();
        }).toThrow('Cannot have more than 2 running backs');
    });

    test('Throws error when more than 3 wide receivers added', () => {
        expect(() => {
            builder.setQuarterback(quarterBack)
            .addRunningBack(runningBack)
            .addWideReceiver(wideReceiver)
            .addWideReceiver('AJ Brown')
            .addWideReceiver('Davonte Smith')
            .addWideReceiver('Chris Olave')
            .build();
        }).toThrow('Cannot have more than 3 wide receivers');
    });

    test('Supports method chaning', () => {
        expect(() => 
            builder
                .setQuarterback(quarterBack)
                .addRunningBack(runningBack)
                .addWideReceiver(wideReceiver)
                .build())
        .not.toThrow();
    });

    test('Accumulates multiple running backs', () => {
        const lineup = builder
            .setQuarterback(quarterBack)
            .addRunningBack(runningBack)
            .addRunningBack('Derrick Henry')
            .addWideReceiver(wideReceiver)
            .build();
        expect(lineup.runningBacks.length).toBe(2);
    });

    test('Accumulates multiple wide receivers', () => {
        const lineup = builder
            .setQuarterback(quarterBack)
            .addRunningBack(runningBack)
            .addWideReceiver(wideReceiver)
            .addWideReceiver('AJ Brown')
            .build();
        expect(lineup.wideReceivers.length).toBe(2);
    });

    test('Flex defaults to null', () => {
        const lineup = builder
            .setQuarterback(quarterBack)
            .addRunningBack(runningBack)
            .addWideReceiver(wideReceiver)
            .addWideReceiver('AJ Brown')
            .build();
        expect(lineup.flex).toBeNull();
    });

    test('Flex player can be set', () => {
        const lineup = builder
            .setQuarterback(quarterBack)
            .addRunningBack(runningBack)
            .addWideReceiver(wideReceiver)
            .addWideReceiver('AJ Brown')
            .setFlex('Travis Kelce')
            .build();
        expect(lineup.flex).toBe('Travis Kelce');
    });

    test('Reset method resets builder', () => {
        const lineupBuilder = builder
            .setQuarterback(quarterBack)
            .addRunningBack(runningBack)
            .addWideReceiver(wideReceiver)
            .setTightEnd(tightEnd)
            .setKicker(kicker)
            .setDefense(defense)
            .reset();

        expect(() => lineupBuilder.build()).toThrow();
    });
});