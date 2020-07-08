class Tracker {
    /** The current namespace this tracker is working under */
    private namespace: string;

    /**
     * @param namespace The namespace this tracker is working under
     */
    protected constructor(namespace: string) {
        this.namespace = namespace;

        $("#reset-tracker")
            .on("click", (): void => {
                // Clear local storage data
                State.reset(this.namespace);

                // Remove highlights on all checked rows
                for (const element of $("tr.checked")) {
                    $(element).removeClass("checked");
                }
            });
    }

    /**
     * Adds a graphic (image) based on JSON data
     * @param row The row to add the graphic to
     * @param data The JSON data to parse
     */
    protected addGraphic(row: any, data: any): void {
        const element: any = $("<td>")
            .appendTo(row);
        const parent = $("<div>")
            .addClass("info-holder centered")
            .appendTo(element);

        if (data == null) {
            return;
        }

        if (typeof(data) == "string") {
            data = [data];
        }

        for (const value of data) {
            $("<img>")
                .attr("src", "src/assets/misc/" + value + ".png")
                .appendTo(parent);
        }
    }

    /**
     * Adds a graphic (image) in addition to text information based on JSON data
     * @param row The row to add the graphic and text to
     * @param data The JSON data to parse
     * @param defaultValue The default text value if none could be found
     */
    protected addGraphicInformation(row: any, data: any, defaultValue: string): void {
        const element: any = $("<td>")
            .appendTo(row);

        if (data == null) {
            element.text("Any " + defaultValue);
            return;
        }

        if (typeof(data) == "string") {
            data = [data];
        }

        for (const value of data) {
            // Create a holder to center the image and text vertically
            const holder: any = $("<div>")
                .addClass("info-holder")
                .appendTo(element);

            $("<img>")
                .attr("src", "src/assets/misc/" + value + ".png")
                .appendTo(holder);
            $("<span>")
                .text(Utils.capitalize(value))
                .appendTo(holder);
        }
    }

    /**
     * Registers a table's rows to allow toggling of a table's rows
     * @param table The table to register
     */
    protected registerEvents(table: JQuery<HTMLElement>): void {
        for (const child of table.children()) {
            $(child).on("click", (): void => {
                this.toggleState($(child));
            });
        }
    }

    /**
     * Marks rows as checked or unchecked based on the current state data
     * 
     * This is used to mark rows as checked when the page is reloaded
     */
    protected markRows(): void {
        const data: any = State.getValue(this.namespace);
        for (const id in data) {
            // Check if this row should be checked
            if (data[id]) {
                this.toggleRows(id);
            }
        }
    }

    /**
     * Toggles the state of a row to be on or off and saves that state
     * @param element The element to toggle
     */
    private toggleState(element: JQuery<HTMLElement>): void {
        const type: string | undefined = $(element).attr("type");
        if (type != null) {
            // Mark the rows of the save type as toggled
            this.toggleRows(type);

            State.setValue(this.namespace, type, $(element).hasClass("checked"));
        }
    }

    /**
     * Toggles all rows of a given type
     * @param type The type of row to toggle
     */
    private toggleRows(type: string): void {
        const rows: any = $("body").find("[type=" + type + "]");

        for (const row of rows) {
            $(row).toggleClass("checked");
        }
    }
}