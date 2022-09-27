export class Parking {
  constructor() {
    this.ROWS = 5;
    this.COLS = 3;
    this.SLOTSFORSP = 0;
    this.SLOTSFORMP = 0;
    this.SLOTSFORLP = 0;

    let parkingLot = this.initializeSlots(this.ROWS, this.COLS);
    let parkingLotDetails = [];

    parkingLot = this.randomizeTypeInSlots(parkingLot);
    for (let i = 0; i < this.ROWS; i++) {
      parkingLotDetails[i] = [];
      for (let j = 0; j < this.COLS; j++) {
        parkingLotDetails[i][j] = {
          isOccupied: parkingLot[i][j].isOccupied,
          type: parkingLot[i][j].type,
        };
      }
    }
    this.PARKINGLOT = parkingLot;
    this.PARKINGHISTORY = [];
  }

  initializeSlots(row, col) {
    let slot = [];
    for (let i = 0; i < row; i++) {
      slot[i] = [];
      for (let j = 0; j < col; j++) {
        slot[i][j] = { isOccupied: false, type: null, position: [i, j] };
      }
    }
    return slot;
  }

  randomizeTypeInSlots(parkingSlot) {
    const parkingSlotWithRandomizedTypes = parkingSlot;
    for (let i = 0; i < this.ROWS; i++) {
      for (let j = 0; j < this.COLS; j++) {
        let randomTypeGenerator = Math.floor(Math.random() * 10);
        if (randomTypeGenerator == 0) randomTypeGenerator++;
        if (randomTypeGenerator == 10) randomTypeGenerator--;
        if (1 <= randomTypeGenerator && randomTypeGenerator <= 3) {
          parkingSlotWithRandomizedTypes[i][j].type = "SP";
          this.SLOTSFORSP++;
        } else if (4 <= randomTypeGenerator && randomTypeGenerator <= 6) {
          parkingSlotWithRandomizedTypes[i][j].type = "MP";
          this.SLOTSFORMP++;
        } else if (7 <= randomTypeGenerator && randomTypeGenerator <= 9) {
          parkingSlotWithRandomizedTypes[i][j].type = "LP";
          this.SLOTSFORLP++;
        }
      }
    }
    return parkingSlotWithRandomizedTypes;
  }

  showMap() {
    let parkingLotDetails = [];
    for (let i = 0; i < this.ROWS; i++) {
      parkingLotDetails[i] = [];
      for (let j = 0; j < this.COLS; j++) {
        parkingLotDetails[i][j] = {
          isOccupied: this.PARKINGLOT[i][j].isOccupied,
          type: this.PARKINGLOT[i][j].type,
        };
      }
    }
    console.log("Showing map of parking lot");
    console.log(
      "======================================================================================================================="
    );
    console.log(`SLOTS FOR SP: ${this.SLOTSFORSP}`);
    console.log(`SLOTS FOR MP: ${this.SLOTSFORMP}`);
    console.log(`SLOTS FOR LP: ${this.SLOTSFORLP}`);
    console.log(
      "======================================================================================================================="
    );
    console.table(parkingLotDetails);
    //console.log(this.PARKINGLOT);
  }

  showParkHistory() {
    console.table(this.PARKINGHISTORY);
  }

  parkVehicle(size, entrance, plateNumber) {
    if (size > 2) {
      console.log("Invalid option for size");
      return;
    }
    if (entrance > 2) {
      console.log("Invalid option for entrance");
      return;
    }
    const parkPosition = this.whereIsNearestSlotFromEntrance(
      size,
      entrance,
      plateNumber
    );
    if (parkPosition.includes("No more slots")) return parkPosition;
    else return `Your parking position is at [${parkPosition}].`;
  }

  unparkVehicle(i, j, plateNumber) {
    this.PARKINGLOT[i][j].isOccupied = false;
    const parkingHistory = this.PARKINGHISTORY;
    const x = parkingHistory.find(
      (x) =>
        x.plateNumber == plateNumber &&
        JSON.stringify(x.position) == JSON.stringify([parseInt(i), parseInt(j)])
    );
    const index = parkingHistory.indexOf(x);
    console.log("index: ", index);
    this.PARKINGHISTORY[index].dateTimeOut = new Date();
    let dateTimeDiffInHours =
      Math.abs(
        this.PARKINGHISTORY[index].dateTimeOut -
          this.PARKINGHISTORY[index].dateTimeIn
      ) / 36e5;
    console.log(`${dateTimeDiffInHours} ms`);
    // for testing purposes
    dateTimeDiffInHours = Math.ceil(dateTimeDiffInHours * 1000);
    console.log(`${dateTimeDiffInHours} hr/s`);
    // for testing purposes
    if (dateTimeDiffInHours <= 3) {
      console.log("Total bill is Php 40.00");
      this.PARKINGHISTORY[index].status = "OUT";
      if (this.PARKINGHISTORY[index].parkedInType == "SP") this.SLOTSFORSP++;
      else if (this.PARKINGHISTORY[index].parkedInType == "MP")
        this.SLOTSFORMP++;
      else if (this.PARKINGHISTORY[index].parkedInType == "LP")
        this.SLOTSFORLP++;
    } else {
      if (this.PARKINGHISTORY[index].parkedInType == "SP") {
        const rate = 20;
        this.SLOTSFORSP++;
      } else if (this.PARKINGHISTORY[index].parkedInType == "MP") {
        const rate = 60;
        this.SLOTSFORMP++;
      } else if (this.PARKINGHISTORY[index].parkedInType == "LP") {
        const rate = 100;
        this.SLOTSFORLP++;
      }
      console.log(
        `Total bill is Php ${
          Math.floor(dateTimeDiffInHours / 24) * 5000 +
          (dateTimeDiffInHours % 24) * rate
        }.00`
      );
      this.PARKINGHISTORY[index].status = "OUT";
    }
    this.showMap();
    this.showParkHistory();
  }

  // size - 0 = S, 1 = M, 2 = L
  // entrance - 0 = North, 1 = West, 2 = East
  whereIsNearestSlotFromEntrance(size, entrance, plateNumber) {
    if (entrance == 0) {
      for (let i = 0; i < this.ROWS; i++) {
        for (let j = 0; j < this.COLS; j++) {
          if (!this.PARKINGLOT[i][j].isOccupied) {
            if (
              size == 0 &&
              (this.PARKINGLOT[i][j].type == "SP" ||
                this.PARKINGLOT[i][j].type == "MP" ||
                this.PARKINGLOT[i][j].type == "LP")
            ) {
              if (
                !(
                  this.SLOTSFORSP == 0 &&
                  this.SLOTSFORMP == 0 &&
                  this.SLOTSFORLP == 0
                )
              ) {
                this.PARKINGLOT[i][j].isOccupied = true;
                let parkingHistory = this.PARKINGHISTORY;
                const x = parkingHistory.find(
                  (x) => x.plateNumber == plateNumber
                );
                const index = parkingHistory.indexOf(x);
                if (index == -1) {
                  this.PARKINGHISTORY.push({
                    plateNumber: plateNumber,
                    position: [i, j],
                    parkedInType: this.PARKINGLOT[i][j].type,
                    dateTimeIn: new Date(),
                    dateTimeOut: null,
                    status: "parked",
                  });
                } else {
                  let timeBackDiff =
                    Math.abs(
                      new Date() - this.PARKINGHISTORY[index].dateTimeOut
                    ) / 36e5;
                  console.log(`${timeBackDiff} ms`);
                  // for testing purposes
                  timeBackDiff = Math.ceil(timeBackDiff * 1000);
                  console.log(`${timeBackDiff} hr/s`);
                  // for testing purposes
                  if (timeBackDiff <= 1) {
                    this.PARKINGHISTORY[index].dateTimeOut == null;
                    this.PARKINGHISTORY[index].position ==
                      this.PARKINGLOT[i][j].position;
                    this.PARKINGHISTORY[index].status == "parked";
                    this.PARKINGHISTORY[index].parkedInType ==
                      this.PARKINGLOT[i][j].type;
                  } else {
                    console.log("SPLICE");
                    this.PARKINGHISTORY.splice(index, 1);
                    console.table(this.PARKINGHISTORY);
                    this.PARKINGHISTORY.push({
                      plateNumber: plateNumber,
                      position: [i, j],
                      parkedInType: this.PARKINGLOT[i][j].type,
                      dateTimeIn: new Date(),
                      dateTimeOut: null,
                      status: "parked",
                    });
                  }
                }

                if (this.PARKINGLOT[i][j].type == "SP") this.SLOTSFORSP--;
                else if (this.PARKINGLOT[i][j].type == "MP") this.SLOTSFORMP--;
                else if (this.PARKINGLOT[i][j].type == "LP") this.SLOTSFORLP--;

                return this.PARKINGLOT[i][j].position;
              }
            } else if (
              size == 1 &&
              (this.PARKINGLOT[i][j].type == "MP" ||
                this.PARKINGLOT[i][j].type == "LP")
            ) {
              if (!(this.SLOTSFORMP == 0 && this.SLOTSFORLP == 0)) {
                this.PARKINGLOT[i][j].isOccupied = true;
                let parkingHistory = this.PARKINGHISTORY;
                const x = parkingHistory.find(
                  (x) => x.plateNumber == plateNumber
                );
                const index = parkingHistory.indexOf(x);
                console.log("index: ", index);
                if (index == -1) {
                  this.PARKINGHISTORY.push({
                    plateNumber: plateNumber,
                    position: [i, j],
                    parkedInType: this.PARKINGLOT[i][j].type,
                    dateTimeIn: new Date(),
                    dateTimeOut: null,
                    status: "parked",
                  });
                } else {
                  let timeBackDiff =
                    Math.abs(
                      new Date() - this.PARKINGHISTORY[index].dateTimeOut
                    ) / 36e5;
                  console.log(`${timeBackDiff} ms`);
                  // for testing purposes
                  timeBackDiff = Math.ceil(timeBackDiff * 1000);
                  console.log(`${timeBackDiff} hr/s`);
                  // for testing purposes
                  if (timeBackDiff <= 1) {
                    this.PARKINGHISTORY[index].dateTimeOut == null;
                    this.PARKINGHISTORY[index].position ==
                      this.PARKINGLOT[i][j].position;
                    this.PARKINGHISTORY[index].status == "parked";
                    this.PARKINGHISTORY[index].parkedInType ==
                      this.PARKINGLOT[i][j].type;
                  } else {
                    console.log("SPLICE");
                    this.PARKINGHISTORY.splice(index, 1);
                    console.table(this.PARKINGHISTORY);
                    this.PARKINGHISTORY.push({
                      plateNumber: plateNumber,
                      position: [i, j],
                      parkedInType: this.PARKINGLOT[i][j].type,
                      dateTimeIn: new Date(),
                      dateTimeOut: null,
                      status: "parked",
                    });
                  }
                }
                if (this.PARKINGLOT[i][j].type == "MP") this.SLOTSFORMP--;
                else if (this.PARKINGLOT[i][j].type == "LP") this.SLOTSFORLP--;

                return this.PARKINGLOT[i][j].position;
              }
            } else if (size == 2 && this.PARKINGLOT[i][j].type == "LP") {
              if (!(this.SLOTSFORLP == 0)) {
                this.PARKINGLOT[i][j].isOccupied = true;
                let parkingHistory = this.PARKINGHISTORY;
                const x = parkingHistory.find(
                  (x) => x.plateNumber == plateNumber
                );
                const index = parkingHistory.indexOf(x);
                console.log("index: ", index);
                if (index == -1) {
                  this.PARKINGHISTORY.push({
                    plateNumber: plateNumber,
                    position: [i, j],
                    parkedInType: this.PARKINGLOT[i][j].type,
                    dateTimeIn: new Date(),
                    dateTimeOut: null,
                    status: "parked",
                  });
                } else {
                  let timeBackDiff =
                    Math.abs(
                      new Date() - this.PARKINGHISTORY[index].dateTimeOut
                    ) / 36e5;
                  console.log(`${timeBackDiff} ms`);
                  // for testing purposes
                  timeBackDiff = Math.ceil(timeBackDiff * 1000);
                  console.log(`${timeBackDiff} hr/s`);
                  // for testing purposes
                  if (timeBackDiff <= 1) {
                    this.PARKINGHISTORY[index].dateTimeOut == null;
                    this.PARKINGHISTORY[index].position ==
                      this.PARKINGLOT[i][j].position;
                    this.PARKINGHISTORY[index].status == "parked";
                    this.PARKINGHISTORY[index].parkedInType ==
                      this.PARKINGLOT[i][j].type;
                  } else {
                    console.log("SPLICE");
                    this.PARKINGHISTORY.splice(index, 1);
                    console.table(this.PARKINGHISTORY);
                    this.PARKINGHISTORY.push({
                      plateNumber: plateNumber,
                      position: [i, j],
                      parkedInType: this.PARKINGLOT[i][j].type,
                      dateTimeIn: new Date(),
                      dateTimeOut: null,
                      status: "parked",
                    });
                  }
                }
                if (this.PARKINGLOT[i][j].type == "LP") this.SLOTSFORLP--;

                return this.PARKINGLOT[i][j].position;
              }
            }
          } else if (
            size == 0 &&
            this.SLOTSFORSP == 0 &&
            this.SLOTSFORMP == 0 &&
            this.SLOTSFORLP == 0
          ) {
            return "No more slots for S cars";
          } else if (
            size == 1 &&
            this.SLOTSFORMP == 0 &&
            this.SLOTSFORLP == 0
          ) {
            return "No more slots for M cars";
          } else if (size == 2 && this.SLOTSFORLP == 0) {
            return "No more slots for L cars";
          }
        }
      }
    } else if (entrance == 1) {
      for (let j = 0; j < this.COLS; j++) {
        for (let i = 0; i < this.ROWS; i++) {
          if (!this.PARKINGLOT[i][j].isOccupied) {
            if (
              size == 0 &&
              (this.PARKINGLOT[i][j].type == "SP" ||
                this.PARKINGLOT[i][j].type == "MP" ||
                this.PARKINGLOT[i][j].type == "LP")
            ) {
              if (
                !(
                  this.SLOTSFORSP == 0 &&
                  this.SLOTSFORMP == 0 &&
                  this.SLOTSFORLP == 0
                )
              ) {
                this.PARKINGLOT[i][j].isOccupied = true;
                let parkingHistory = this.PARKINGHISTORY;
                const x = parkingHistory.find(
                  (x) => x.plateNumber == plateNumber
                );
                const index = parkingHistory.indexOf(x);
                console.log("index: ", index);
                if (index == -1) {
                  this.PARKINGHISTORY.push({
                    plateNumber: plateNumber,
                    position: [i, j],
                    parkedInType: this.PARKINGLOT[i][j].type,
                    dateTimeIn: new Date(),
                    dateTimeOut: null,
                    status: "parked",
                  });
                } else {
                  let timeBackDiff =
                    Math.abs(
                      new Date() - this.PARKINGHISTORY[index].dateTimeOut
                    ) / 36e5;
                  console.log(`${timeBackDiff} ms`);
                  // for testing purposes
                  timeBackDiff = Math.ceil(timeBackDiff * 1000);
                  console.log(`${timeBackDiff} hr/s`);
                  // for testing purposes
                  if (timeBackDiff <= 1) {
                    this.PARKINGHISTORY[index].dateTimeOut == null;
                    this.PARKINGHISTORY[index].position ==
                      this.PARKINGLOT[i][j].position;
                    this.PARKINGHISTORY[index].status == "parked";
                    this.PARKINGHISTORY[index].parkedInType ==
                      this.PARKINGLOT[i][j].type;
                  } else {
                    console.log("SPLICE");
                    this.PARKINGHISTORY.splice(index, 1);
                    console.table(this.PARKINGHISTORY);
                    this.PARKINGHISTORY.push({
                      plateNumber: plateNumber,
                      position: [i, j],
                      parkedInType: this.PARKINGLOT[i][j].type,
                      dateTimeIn: new Date(),
                      dateTimeOut: null,
                      status: "parked",
                    });
                  }
                }
                if (this.PARKINGLOT[i][j].type == "SP") this.SLOTSFORSP--;
                else if (this.PARKINGLOT[i][j].type == "MP") this.SLOTSFORMP--;
                else if (this.PARKINGLOT[i][j].type == "LP") this.SLOTSFORLP--;

                return this.PARKINGLOT[i][j].position;
              }
            } else if (
              size == 1 &&
              (this.PARKINGLOT[i][j].type == "MP" ||
                this.PARKINGLOT[i][j].type == "LP")
            ) {
              if (!(this.SLOTSFORMP == 0 && this.SLOTSFORLP == 0)) {
                this.PARKINGLOT[i][j].isOccupied = true;
                let parkingHistory = this.PARKINGHISTORY;
                const x = parkingHistory.find(
                  (x) => x.plateNumber == plateNumber
                );
                const index = parkingHistory.indexOf(x);
                console.log("index: ", index);
                if (index == -1) {
                  this.PARKINGHISTORY.push({
                    plateNumber: plateNumber,
                    position: [i, j],
                    parkedInType: this.PARKINGLOT[i][j].type,
                    dateTimeIn: new Date(),
                    dateTimeOut: null,
                    status: "parked",
                  });
                } else {
                  let timeBackDiff =
                    Math.abs(
                      new Date() - this.PARKINGHISTORY[index].dateTimeOut
                    ) / 36e5;
                  console.log(`${timeBackDiff} ms`);
                  // for testing purposes
                  timeBackDiff = Math.ceil(timeBackDiff * 1000);
                  console.log(`${timeBackDiff} hr/s`);
                  // for testing purposes
                  if (timeBackDiff <= 1) {
                    this.PARKINGHISTORY[index].dateTimeOut == null;
                    this.PARKINGHISTORY[index].position ==
                      this.PARKINGLOT[i][j].position;
                    this.PARKINGHISTORY[index].status == "parked";
                    this.PARKINGHISTORY[index].parkedInType ==
                      this.PARKINGLOT[i][j].type;
                  } else {
                    console.log("SPLICE");
                    this.PARKINGHISTORY.splice(index, 1);
                    console.table(this.PARKINGHISTORY);
                    this.PARKINGHISTORY.push({
                      plateNumber: plateNumber,
                      position: [i, j],
                      parkedInType: this.PARKINGLOT[i][j].type,
                      dateTimeIn: new Date(),
                      dateTimeOut: null,
                      status: "parked",
                    });
                  }
                }
                if (this.PARKINGLOT[i][j].type == "MP") this.SLOTSFORMP--;
                else if (this.PARKINGLOT[i][j].type == "LP") this.SLOTSFORLP--;

                return this.PARKINGLOT[i][j].position;
              }
            } else if (size == 2 && this.PARKINGLOT[i][j].type == "LP") {
              if (!(this.SLOTSFORLP == 0)) {
                this.PARKINGLOT[i][j].isOccupied = true;
                let parkingHistory = this.PARKINGHISTORY;
                const x = parkingHistory.find(
                  (x) => x.plateNumber == plateNumber
                );
                const index = parkingHistory.indexOf(x);
                console.log("index: ", index);
                if (index == -1) {
                  this.PARKINGHISTORY.push({
                    plateNumber: plateNumber,
                    position: [i, j],
                    parkedInType: this.PARKINGLOT[i][j].type,
                    dateTimeIn: new Date(),
                    dateTimeOut: null,
                    status: "parked",
                  });
                } else {
                  let timeBackDiff =
                    Math.abs(
                      new Date() - this.PARKINGHISTORY[index].dateTimeOut
                    ) / 36e5;
                  console.log(`${timeBackDiff} ms`);
                  // for testing purposes
                  timeBackDiff = Math.ceil(timeBackDiff * 1000);
                  console.log(`${timeBackDiff} hr/s`);
                  // for testing purposes
                  if (timeBackDiff <= 1) {
                    this.PARKINGHISTORY[index].dateTimeOut == null;
                    this.PARKINGHISTORY[index].position ==
                      this.PARKINGLOT[i][j].position;
                    this.PARKINGHISTORY[index].status == "parked";
                    this.PARKINGHISTORY[index].parkedInType ==
                      this.PARKINGLOT[i][j].type;
                  } else {
                    console.log("SPLICE");
                    this.PARKINGHISTORY.splice(index, 1);
                    console.table(this.PARKINGHISTORY);
                    this.PARKINGHISTORY.push({
                      plateNumber: plateNumber,
                      position: [i, j],
                      parkedInType: this.PARKINGLOT[i][j].type,
                      dateTimeIn: new Date(),
                      dateTimeOut: null,
                      status: "parked",
                    });
                  }
                }
                if (this.PARKINGLOT[i][j].type == "LP") this.SLOTSFORLP--;

                return this.PARKINGLOT[i][j].position;
              }
            }
          } else if (
            size == 0 &&
            this.SLOTSFORSP == 0 &&
            this.SLOTSFORMP == 0 &&
            this.SLOTSFORLP == 0
          ) {
            return "No more slots for S cars";
          } else if (
            size == 1 &&
            this.SLOTSFORMP == 0 &&
            this.SLOTSFORLP == 0
          ) {
            return "No more slots for M cars";
          } else if (size == 2 && this.SLOTSFORLP == 0) {
            return "No more slots for L cars";
          }
        }
      }
    } else if (entrance == 2) {
      for (let j = this.COLS - 1; j > 0; j--) {
        for (let i = 0; i < this.ROWS; i++) {
          if (!this.PARKINGLOT[i][j].isOccupied) {
            if (
              size == 0 &&
              (this.PARKINGLOT[i][j].type == "SP" ||
                this.PARKINGLOT[i][j].type == "MP" ||
                this.PARKINGLOT[i][j].type == "LP")
            ) {
              if (
                !(
                  this.SLOTSFORSP == 0 &&
                  this.SLOTSFORMP == 0 &&
                  this.SLOTSFORLP == 0
                )
              ) {
                this.PARKINGLOT[i][j].isOccupied = true;
                let parkingHistory = this.PARKINGHISTORY;
                const x = parkingHistory.find(
                  (x) => x.plateNumber == plateNumber
                );
                const index = parkingHistory.indexOf(x);
                console.log("index: ", index);
                if (index == -1) {
                  this.PARKINGHISTORY.push({
                    plateNumber: plateNumber,
                    position: [i, j],
                    parkedInType: this.PARKINGLOT[i][j].type,
                    dateTimeIn: new Date(),
                    dateTimeOut: null,
                    status: "parked",
                  });
                } else {
                  let timeBackDiff =
                    Math.abs(
                      new Date() - this.PARKINGHISTORY[index].dateTimeOut
                    ) / 36e5;
                  console.log(`${timeBackDiff} ms`);
                  // for testing purposes
                  timeBackDiff = Math.ceil(timeBackDiff * 1000);
                  console.log(`${timeBackDiff} hr/s`);
                  // for testing purposes
                  if (timeBackDiff <= 1) {
                    this.PARKINGHISTORY[index].dateTimeOut == null;
                    this.PARKINGHISTORY[index].position ==
                      this.PARKINGLOT[i][j].position;
                    this.PARKINGHISTORY[index].status == "parked";
                    this.PARKINGHISTORY[index].parkedInType ==
                      this.PARKINGLOT[i][j].type;
                  } else {
                    console.log("SPLICE");
                    this.PARKINGHISTORY.splice(index, 1);
                    console.table(this.PARKINGHISTORY);
                    this.PARKINGHISTORY.push({
                      plateNumber: plateNumber,
                      position: [i, j],
                      parkedInType: this.PARKINGLOT[i][j].type,
                      dateTimeIn: new Date(),
                      dateTimeOut: null,
                      status: "parked",
                    });
                  }
                }
                if (this.PARKINGLOT[i][j].type == "SP") this.SLOTSFORSP--;
                else if (this.PARKINGLOT[i][j].type == "MP") this.SLOTSFORMP--;
                else if (this.PARKINGLOT[i][j].type == "LP") this.SLOTSFORLP--;

                return this.PARKINGLOT[i][j].position;
              }
            } else if (
              size == 1 &&
              (this.PARKINGLOT[i][j].type == "MP" ||
                this.PARKINGLOT[i][j].type == "LP")
            ) {
              if (!(this.SLOTSFORMP == 0 && this.SLOTSFORLP == 0)) {
                this.PARKINGLOT[i][j].isOccupied = true;
                let parkingHistory = this.PARKINGHISTORY;
                const x = parkingHistory.find(
                  (x) => x.plateNumber == plateNumber
                );
                const index = parkingHistory.indexOf(x);
                console.log("index: ", index);
                if (index == -1) {
                  this.PARKINGHISTORY.push({
                    plateNumber: plateNumber,
                    position: [i, j],
                    parkedInType: this.PARKINGLOT[i][j].type,
                    dateTimeIn: new Date(),
                    dateTimeOut: null,
                    status: "parked",
                  });
                } else {
                  let timeBackDiff =
                    Math.abs(
                      new Date() - this.PARKINGHISTORY[index].dateTimeOut
                    ) / 36e5;
                  console.log(`${timeBackDiff} ms`);
                  // for testing purposes
                  timeBackDiff = Math.ceil(timeBackDiff * 1000);
                  console.log(`${timeBackDiff} hr/s`);
                  // for testing purposes
                  if (timeBackDiff <= 1) {
                    this.PARKINGHISTORY[index].dateTimeOut == null;
                    this.PARKINGHISTORY[index].position ==
                      this.PARKINGLOT[i][j].position;
                    this.PARKINGHISTORY[index].status == "parked";
                    this.PARKINGHISTORY[index].parkedInType ==
                      this.PARKINGLOT[i][j].type;
                  } else {
                    console.log("SPLICE");
                    this.PARKINGHISTORY.splice(index, 1);
                    console.table(this.PARKINGHISTORY);
                    this.PARKINGHISTORY.push({
                      plateNumber: plateNumber,
                      position: [i, j],
                      parkedInType: this.PARKINGLOT[i][j].type,
                      dateTimeIn: new Date(),
                      dateTimeOut: null,
                      status: "parked",
                    });
                  }
                }
                if (this.PARKINGLOT[i][j].type == "MP") this.SLOTSFORMP--;
                else if (this.PARKINGLOT[i][j].type == "LP") this.SLOTSFORLP--;

                return this.PARKINGLOT[i][j].position;
              }
            } else if (size == 2 && this.PARKINGLOT[i][j].type == "LP") {
              if (!(this.SLOTSFORLP == 0)) {
                this.PARKINGLOT[i][j].isOccupied = true;
                let parkingHistory = this.PARKINGHISTORY;
                const x = parkingHistory.find(
                  (x) => x.plateNumber == plateNumber
                );
                const index = parkingHistory.indexOf(x);
                console.log("index: ", index);
                if (index == -1) {
                  this.PARKINGHISTORY.push({
                    plateNumber: plateNumber,
                    position: [i, j],
                    parkedInType: this.PARKINGLOT[i][j].type,
                    dateTimeIn: new Date(),
                    dateTimeOut: null,
                    status: "parked",
                  });
                } else {
                  let timeBackDiff =
                    Math.abs(
                      new Date() - this.PARKINGHISTORY[index].dateTimeOut
                    ) / 36e5;
                  console.log(`${timeBackDiff} ms`);
                  // for testing purposes
                  timeBackDiff = Math.ceil(timeBackDiff * 1000);
                  console.log(`${timeBackDiff} hr/s`);
                  // for testing purposes
                  if (timeBackDiff <= 1) {
                    this.PARKINGHISTORY[index].dateTimeOut == null;
                    this.PARKINGHISTORY[index].position ==
                      this.PARKINGLOT[i][j].position;
                    this.PARKINGHISTORY[index].status == "parked";
                    this.PARKINGHISTORY[index].parkedInType ==
                      this.PARKINGLOT[i][j].type;
                  } else {
                    console.log("SPLICE");
                    this.PARKINGHISTORY.splice(index, 1);
                    console.table(this.PARKINGHISTORY);
                    this.PARKINGHISTORY.push({
                      plateNumber: plateNumber,
                      position: [i, j],
                      parkedInType: this.PARKINGLOT[i][j].type,
                      dateTimeIn: new Date(),
                      dateTimeOut: null,
                      status: "parked",
                    });
                  }
                }
                if (this.PARKINGLOT[i][j].type == "LP") this.SLOTSFORLP--;

                return this.PARKINGLOT[i][j].position;
              }
            }
          } else if (
            size == 0 &&
            this.SLOTSFORSP == 0 &&
            this.SLOTSFORMP == 0 &&
            this.SLOTSFORLP == 0
          ) {
            return "No more slots for S cars";
          } else if (
            size == 1 &&
            this.SLOTSFORMP == 0 &&
            this.SLOTSFORLP == 0
          ) {
            return "No more slots for M cars";
          } else if (size == 2 && this.SLOTSFORLP == 0) {
            return "No more slots for L cars";
          }
        }
      }
    }
  }
}
