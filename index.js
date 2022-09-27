import { Parking } from "./parking.js";
import readline from "readline";

const parking = new Parking();

const prompt =
  "Please choose an option [ p - Park a vehicle, u - Unpark a vehicle, m - Show map, h - Show history, x - exit ]:";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt,
});

rl.prompt();

rl.on("line", (line) => {
  switch (line.trim()) {
    case "x":
      rl.close();
      break;
    case "p":
      rl.question("Vehicle size [ 0-S, 1-M, 2-L ]: ", function (size) {
        rl.question(
          "Choose entrance [ 0-North, 1-West, 2-East ]",
          function (entrance) {
            rl.question("Type in your plate number: ", function (plateNumber) {
              parking.parkVehicle(size, entrance, plateNumber);
              parking.showMap();
              parking.showParkHistory();
              rl.prompt();
            });
          }
        );
      });

      break;

    case "u":
      rl.question(
        "Location of vehicle to unpark. Seperate by a space [row column]: ",
        function (loc) {
          rl.question("Plate number: ", function (plateNumber) {
            const strLoc = loc.trim().split(" ");

            if (strLoc.length >= 2) {
              const row = strLoc[0];
              const col = strLoc[1];
              parking.unparkVehicle(row, col, plateNumber);
              console.log("Vehicle unparked!");
            }
          });
        }
      );
      break;
    case "m":
      parking.showMap();
      break;
    case "h":
      parking.showParkHistory();
      break;
    default:
      break;
  }
  rl.prompt();
}).on("close", () => {
  console.log("Goodbye!");
  process.exit(0);
});
