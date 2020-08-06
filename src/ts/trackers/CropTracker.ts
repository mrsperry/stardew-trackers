/// <reference path="./Tracker.ts"/>

class CropTracker extends Tracker {
    /**
     * @param data JSON state retrieved from the data folder
     */
    public constructor(data: any) {
        super("crops-tracker");

        // Create a table of crops for each season
        for (const season of ["spring", "summer", "fall"]) {
            const ids: string[] = Object.keys(data).filter((crop: string): boolean => {
                const cropData: any = data[crop];
                return cropData.seasons != null && (cropData.seasons == season || cropData.seasons.includes(season));
            });

            const parent = $("<div>")
            .addClass("section")
            .appendTo("#" + this.namespace + "-content");
        
            // Create the table header
            const header: any = $("<div>")
                .addClass("graphic-header")
                .appendTo(parent);
            $("<h1>")
                .text(season == "any" ? "Any season" : Utils.capitalize(season))
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
                .text("Growth")
                .appendTo(headers);
            $("<th>")
                .text("Regrowth")
                .appendTo(headers);
            $("<th>")
                .text("Polyculture")
                .appendTo(headers);
            $("<th>")
                .text("Trellis")
                .appendTo(headers);
            $("<th>")
                .text("Used In")
                .appendTo(headers);
            
            // Add each crop from this season to the table
            for (const id of ids) {
                const crop: any = data[id];
    
                const row: any = $("<tr>")
                    .attr("type", id)
                    .appendTo(table);

                const cell: any = $("<td>")
                    .appendTo(row);
                const holder: any = $("<div>")
                    .addClass("info-holder")
                    .appendTo(cell);

                // Add the crop's image and name
                $("<img>")
                    .attr("src", "src/assets/crops/" + id + ".png")
                    .attr("alt", Utils.formatID(id))
                    .appendTo(holder);
                $("<span>")
                    .text(Utils.formatID(id))
                    .appendTo(holder);
            
                // Add auxillary information
                super.addGraphicInformation(row, crop.seasons, "season");
                this.addGrowthInformation(row, crop["growth-timer"]);
                this.addRegrowthInformation(row, crop.regrowth);
                this.addCheckedGraphic(row, crop.polyculture, "polyculture", "Not used in polyculture");
                this.addCheckedGraphic(row, crop.trellis, "trellis", "Does not use a trellis");
                super.addGraphic(row, crop["used-in"]);
            }

            // Register this table
            super.registerEvents(table);
        }

        // Mark the rows that have been previously checked
        super.markRows();
        super.completeInitialization();
    }

    /**
     * Adds information on the number of days it takes for a crop to grow
     * @param row The row to add to
     * @param growthTimer The number of days the crop will take to grow
     */
    private addGrowthInformation(row: any, growthTimer: number): void {
        $("<td>")
            .text(growthTimer + " day" + (growthTimer > 1 ? "s" : ""))
            .appendTo(row);
    }

    /**
     * Adds information on the number of days it takes for a crop to regrow
     * @param row The row to add to
     * @param regrowth The number of days the crop will take to regrow
     */
    private addRegrowthInformation(row: any, regrowth: any): void {
        if (regrowth == null) {
            $("<td>")
                .text("N/A")
                .appendTo(row);
            return;
        }

        this.addGrowthInformation(row, regrowth);
    }

    /**
     * Adds a graphic if the data provided is true, otherwise add a red 'cross' graphic with the given tooltip
     * @param row The row to add to
     * @param data The data to check
     * @param type The type of graphic to add if the data is true
     * @param tooltip The tooltip to use for the cross graphic if the data is false
     */
    private addCheckedGraphic(row: any, data: any, type: string, tooltip: string): void {
        if (data) {
            super.addGraphic(row, data ? type : null);
        } else {
            super.addGraphic(row, "cross", tooltip);
        }
    }
}