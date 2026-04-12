interface Lineup {
    quarterback: string
    runningBacks: string [];
    wideReceivers: string [];
    tightEnd: string;
    flex: string | null;
    kicker: string;
    defense: string;
}

export class LineupBuilder {
    private quarterback: string = "";
    private runningBacks: string[] = [];
    private wideReceivers: string[] = [];
    private tightEnd: string = "";
    private kicker: string = "";
    private defense: string = "";
    private flex: string | null = null; 

    setQuarterback(name: string): this {
        this.quarterback = name;
        return this;
    }
    
    addRunningBack(name: string): this {
        this.runningBacks.push(name);
        return this;
    }

    addWideReceiver(name: string): this {
        this.wideReceivers.push(name);
        return this;
    }
    
    setTightEnd(name: string): this {
        this.tightEnd = name;
        return this;
    }

    setFlex(name: string): this {
        this.flex = name;
        return this;
    }

    setKicker(name: string): this {
        this.kicker = name;
        return this;
    }

    setDefense(team: string): this {
        this.defense = team;
        return this;
    }

    reset(): this {
        this.quarterback = '';
        this.runningBacks = [];
        this.wideReceivers = [];
        this.tightEnd = '';
        this.flex = null;
        this.kicker = '';
        this.defense = '';
        return this;
    }

    build(): Lineup {
        if(!this.quarterback)
            throw Error('A quarterback is required');
        if(this.runningBacks.length === 0)
            throw Error('A running back is required');
        if(this.wideReceivers.length === 0)
            throw Error('A wide receiver is required');
        if(this.runningBacks.length > 2)
            throw Error('Cannot have more than 2 running backs');
        if(this.wideReceivers.length > 3)
            throw Error('Cannot have more than 3 wide receivers');
        return { 
            quarterback: this.quarterback, 
            runningBacks: [...this.runningBacks], 
            wideReceivers: [...this.wideReceivers], 
            tightEnd: this.tightEnd, 
            flex: this.flex, 
            kicker: this.kicker, 
            defense: this.defense 
        };
    }
}