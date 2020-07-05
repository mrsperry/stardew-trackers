class Utils {
    /**
     * Capitalizes the first letter of a given string
     * @param text The text to capitalize
     */
    public static capitalize(text: string): string {
        return text.substring(0, 1).toUpperCase() + text.substring(1, text.length);
    }

    /**
     * Turns an ID string into a display string ex: "i'm-a-fish" -> "I'm A Fish"
     * @param id The ID to format
     */
    public static formatID(id: string): string {
        return id.split("-").map((word: string): string => {
            return Utils.capitalize(word);
        }).join(" ");
    }
}