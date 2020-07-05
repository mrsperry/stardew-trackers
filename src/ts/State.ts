class State {
    /** Holder for the namespace maps */
    private static data: any = {};

    /**
     * Loads the state saved in local storage
     */
    public static load(): void {
        const data: any = localStorage.getItem("stardew-data");
        if (data != null) {
            State.data = JSON.parse(data);
        }
    }
    
    /**
     * Saves the state to local storage
     */
    public static save(): void {
        localStorage.setItem("stardew-data", JSON.stringify(State.data, null, 4));
    }

    /**
     * Resets all values fot he specified namespace
     * @param namespace The namespace to reset
     */
    public static reset(namespace: string): void {
        if (State.data[namespace] == null) {
            return;
        }

        State.data[namespace] = {};
        State.save();
    }

    /**
     * Sets a key value pair of data under the given namespace
     * @param namespace The namespace the pair should fall under
     * @param key The key of the pair
     * @param value The value of the pair
     */
    public static setValue(namespace: string, key: string, value: any): void {
        if (State.data[namespace] == null) {
            State.data[namespace] = {};
        }

        State.data[namespace][key] = value;
        State.save();
    }

    /**
     * Gets a specific namespaces key-pair value; or gets the entire namespace map
     * @param namespace The namespace to look into
     * @param key The key to look for or null for the entire namespace map
     */
    public static getValue(namespace: string, key?: string): any {
        if (State.data[namespace] == null) {
            return null;
        }

        if (key == null) {
            return State.data[namespace];
        }

        return State.data[namespace][key];
    }
}