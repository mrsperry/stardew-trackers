"use strict";
class Main {
    static async initialize(type) {
        State.load();
        switch (type) {
            case "fish":
                new FishTracker(await $.getJSON("src/data/fish.json"));
                break;
        }
    }
}
class State {
    static load() {
        const data = localStorage.getItem("stardew-data");
        if (data != null) {
            State.data = JSON.parse(data);
        }
    }
    static save() {
        localStorage.setItem("stardew-data", JSON.stringify(State.data, null, 4));
    }
    static reset(namespace) {
        if (State.data[namespace] == null) {
            return;
        }
        State.data[namespace] = {};
        State.save();
    }
    static setValue(namespace, key, value) {
        if (State.data[namespace] == null) {
            State.data[namespace] = {};
        }
        State.data[namespace][key] = value;
        State.save();
    }
    static getValue(namespace, key) {
        if (State.data[namespace] == null) {
            return null;
        }
        if (key == null) {
            return State.data[namespace];
        }
        return State.data[namespace][key];
    }
}
State.data = {};
class Utils {
    static capitalize(text) {
        return text.substring(0, 1).toUpperCase() + text.substring(1, text.length);
    }
    static formatID(id) {
        return id.split("-").map((word) => {
            return Utils.capitalize(word);
        }).join(" ");
    }
}
class Tracker {
    constructor(namespace) {
        this.namespace = namespace;
        $("#reset-tracker")
            .on("click", () => {
            State.reset(this.namespace);
            for (const element of $("tr.checked")) {
                $(element).removeClass("checked");
            }
        });
    }
    addGraphic(row, data) {
        const element = $("<td>")
            .appendTo(row);
        const parent = $("<div>")
            .addClass("info-holder centered")
            .appendTo(element);
        if (data == null) {
            return;
        }
        if (typeof (data) == "string") {
            data = [data];
        }
        for (const value of data) {
            $("<img>")
                .attr("src", "src/assets/misc/" + value + ".png")
                .appendTo(parent);
        }
    }
    addGraphicInformation(row, data, defaultValue) {
        const element = $("<td>")
            .appendTo(row);
        if (data == null) {
            element.text("Any " + defaultValue);
            return;
        }
        if (typeof (data) == "string") {
            data = [data];
        }
        for (const value of data) {
            const holder = $("<div>")
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
    registerEvents(table) {
        for (const child of table.children()) {
            $(child).on("click", () => {
                this.toggleState($(child));
            });
        }
    }
    markRows() {
        const data = State.getValue(this.namespace);
        for (const id in data) {
            if (data[id]) {
                this.toggleRows(id);
            }
        }
    }
    toggleState(element) {
        const type = $(element).attr("type");
        if (type != null) {
            this.toggleRows(type);
            State.setValue(this.namespace, type, $(element).hasClass("checked"));
        }
    }
    toggleRows(type) {
        const rows = $("body").find("[type=" + type + "]");
        for (const row of rows) {
            $(row).toggleClass("checked");
        }
    }
}
class FishTracker extends Tracker {
    constructor(data) {
        super("fish-trackers");
        for (const season of ["any", "spring", "summer", "fall", "winter"]) {
            const ids = Object.keys(data).filter((fish) => {
                const fishData = data[fish];
                if (season == "any") {
                    return fishData.seasons == null;
                }
                return fishData.seasons != null && (fishData.seasons == season || fishData.seasons.includes(season));
            });
            const content = $("#fish-tracker-content");
            const parent = $("<div>")
                .addClass("section")
                .appendTo(content);
            const header = $("<div>")
                .addClass("graphic-header")
                .appendTo(parent);
            $("<h1>")
                .text(season == "any" ? "Any Season" : Utils.capitalize(season))
                .appendTo(header);
            if (season != "any") {
                $("<img>")
                    .attr("src", "src/assets/misc/" + season + ".png")
                    .prependTo(header);
                $("<img>")
                    .attr("src", "src/assets/misc/" + season + ".png")
                    .appendTo(header);
            }
            const table = $("<table>")
                .attr("id", season + "-trackers")
                .appendTo(parent);
            for (const id of ids) {
                const fish = data[id];
                const row = $("<tr>")
                    .attr("type", id)
                    .appendTo(table);
                const cell = $("<td>")
                    .appendTo(row);
                const holder = $("<div>")
                    .addClass("info-holder")
                    .appendTo(cell);
                $("<img>")
                    .attr("src", "src/assets/fish/" + id + ".png")
                    .appendTo(holder);
                $("<span>")
                    .text(Utils.formatID(id))
                    .appendTo(holder);
                this.addAreaInformation(row, fish.areas);
                this.addTimeInformation(row, fish.times);
                super.addGraphicInformation(row, fish.seasons, "season");
                super.addGraphicInformation(row, fish.weather, "weather");
                super.addGraphic(row, fish["used-in"]);
            }
            super.registerEvents(table);
        }
        super.markRows();
    }
    addAreaInformation(row, areas) {
        const element = $("<td>")
            .appendTo(row);
        if (typeof (areas) == "string") {
            element.text(this.formatAreaName(areas));
        }
        else {
            for (const area of areas) {
                $("<div>")
                    .text(this.formatAreaName(area))
                    .appendTo(element);
            }
        }
    }
    addTimeInformation(row, times) {
        const element = $("<td>")
            .appendTo(row);
        if (times == null) {
            element.text("Any time");
            return;
        }
        if (typeof (times) == "string") {
            element.text(times);
        }
        else {
            for (const time of times) {
                $("<div>")
                    .text(time)
                    .appendTo(element);
            }
        }
    }
    formatAreaName(id) {
        let result = id;
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
