/// <reference path="./Tracker.ts"/>

class CropTracker extends Tracker {
    public constructor(data: any) {
        super("crops-tracker");

        // Create a table of crops for each season
        for (const season of ["any", "spring", "summer", "fall"]) {
            const ids: string[] = Object.keys(data).filter((crop: string): boolean => {
                const cropData: any = data[crop];

                // If no season is provided, assume any season
                if (season == "any") {
                    return cropData.seasons == null;
                }

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
                    .prependTo(header);
                $("<img>")
                    .attr("src", "src/assets/misc/" + season + ".png")
                    .appendTo(header);
            }

            // Create the table
            const table: any = $("<table>")
                .attr("id", season + "-tracker")
                .appendTo(parent);
            
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
                    .appendTo(holder);
                $("<span>")
                    .text(Utils.formatID(id))
                    .appendTo(holder);
            
                // Add auxillary information
                super.addGraphicInformation(row, crop.seasons, "season");
                super.addGraphic(row, crop["used-in"]);
            }

            // Register this table
            super.registerEvents(table);
        }

        // Mark the rows that have been previously checked
        super.markRows();
    }
}