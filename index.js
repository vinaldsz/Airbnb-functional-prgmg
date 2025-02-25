import { loadData } from "./src/AirBnBDataHandler.js";

const filePath = "data/listings.csv"; // Make sure this file exists before running

loadData(filePath).then((data) => {
    if (data) {
        console.log("File Content (First 500 chars):\n", data.substring(0, 500));
    }
});
