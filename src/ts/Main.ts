class Main {
    /**
     * Main entry point
     * @param type The type of counter to initialize
     */
    public static async initialize(type: string): Promise<any> {
        State.load();

        const data: any = await $.getJSON("src/data/" + type + ".json");
        switch (type) {
            case "fish":
                new FishTracker(data);
                break;
        }
    }
}