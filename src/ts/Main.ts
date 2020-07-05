class Main {
    /**
     * Main entry point
     * @param type The type of counter to initialize
     */
    public static async initialize(type: string): Promise<any> {
        State.load();

        switch (type) {
            case "fish":
                new FishTracker(await $.getJSON("src/data/fish.json"));
                break;
        }
    }
}