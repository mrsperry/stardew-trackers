/// <reference path="./Tracker.ts"/>

class FishTracker extends Tracker {
    /**
     * @param data JSON state retrieved from the data folder
     */
    public constructor(data: any) {
        // Pass in the namespace
        super("fish-tracker");

        // Create a table of fish for each season and a table for fish that can be caught in any season
        for (const season of ["any", "spring", "summer", "fall", "winter"]) {
            // Create an array of IDs of fish that can be caught in the current season
            const ids: string[] = Object.keys(data).filter((fish: string): boolean => {
                const fishData: any = data[fish];

                // If no season data is provided, assume any season
                if (season == "any") {
                    return fishData.seasons == null;
                }

                return fishData.seasons != null && (fishData.seasons == season || fishData.seasons.includes(season));
            });

            const content: any = $("#fish-tracker-content");
            const parent: any = $("<div>")
                .addClass("section")
                .appendTo(content);
            
            // Create this table's header
            const header: any = $("<div>")
                .addClass("graphic-header")
                .appendTo(parent);
            $("<h1>")
                .text(season == "any" ? "Any Season" : Utils.capitalize(season))
                .appendTo(header);
            // Add graphics to the left and right of the header
            if (season != "any") {
                $("<img>")
                    .attr("src", "src/assets/misc/" + season + ".png")
                    .attr("alt", Utils.capitalize(season))
                    .prependTo(header);
                $("<img>")
                    .attr("src", "src/assets/misc/" + season + ".png")
                    .attr("alt", Utils.capitalize(season))
                    .appendTo(header);
            }

            // Create the table
            const table: any = $("<table>")
                .attr("id", season + "-tracker")
                .appendTo(parent);

            // Add table headers
            const headers: any = $("<tr>")
                .addClass("table-headers")
                .appendTo(table);
            $("<th>")
                .text("Name")
                .appendTo(headers);
            $("<th>")
                .text("Seasons")
                .appendTo(headers);
            $("<th>")
                .text("Areas")
                .appendTo(headers);
            $("<th>")
                .text("Times")
                .appendTo(headers);
            $("<th>")
                .text("Weather")
                .appendTo(headers);
            $("<th>")
                .text("Used In")
                .appendTo(headers);
            
            // Add each fish from this season to the table
            for (const id of ids) {
                const fish: any = data[id];
    
                const row: any = $("<tr>")
                    .attr("type", id)
                    .appendTo(table);

                const cell: any = $("<td>")
                    .appendTo(row);
                const holder: any = $("<div>")
                    .addClass("info-holder")
                    .appendTo(cell);

                // Add the fish's image and name
                $("<img>")
                    .attr("src", "src/assets/fish/" + id + ".png")
                    .attr("alt", Utils.formatID(id))
                    .appendTo(holder);
                $("<span>")
                    .text(Utils.formatID(id))
                    .appendTo(holder);
            
                // Add auxillary information
                super.addGraphicInformation(row, fish.seasons, "season");
                this.addAreaInformation(row, fish.areas);
                this.addTimeInformation(row, fish.times);
                super.addGraphicInformation(row, fish.weather, "weather");
                super.addGraphic(row, fish["used-in"]);
            }

            // Register this table
            super.registerEvents(table);
        }

        // Mark the rows that have been previously checked
        super.markRows();
        super.completeInitialization();
    }

    /**
     * Adds information about the areas a fish can be caught in
     * @param row The row to add to
     * @param areas The areas the fish can be caught in
     */
    private addAreaInformation(row: any, areas: any): void {
        const element: any = $("<td>")
            .appendTo(row);
        
        if (typeof(areas) == "string") {
            element.text(this.formatAreaName(areas));
        } else {
            for (const area of areas) {
                $("<div>")
                    .text(this.formatAreaName(area))
                    .appendTo(element);
            }
        }
    }

    /**
     * Adds information about the time of day a fish can be caught
     * @param row The row to add to
     * @param times The times the fish can be caught at
     */
    private addTimeInformation(row: any, times: any) {
        const element: any = $("<td>")
            .appendTo(row);

        if (times == null) {
            element.text("Any time");
            return;
        }

        if (typeof(times) == "string") {
            element.text(times);
        } else {
            for (const time of times) {
                $("<div>")
                    .text(time)
                    .appendTo(element);
            }
        }
    }

    /**
     * Turns an area ID into a display string with extra information
     * @param name The area ID
     */
    private formatAreaName(id: string): string {
        let result: string = id;
        switch (id) {
            case "rivers":
                result = "rivers-(Town and Forest)";
                break;
            case "forest":
                result = "forest-lake";
                break;
            case "bug-lair":
                result = "mutant-bug-lair";
                break;
            case "swamp":
                result = "witch's-swamp";
                break;
            case "sewers":
                result = "the-sewers";
                break;
            case "mines":
                result = "mines (20F)";
                break;
            case "ice-mines":
                result = "mines (60F)";
                break;
            case "lava-mines":
                result = "mines (100F)";
                break;
        }

        return Utils.formatID(result);
    }
}