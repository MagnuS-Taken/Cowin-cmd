#!/usr/bin/env node

const chalk = require(`chalk`);
const axios = require(`axios`);
const debounce = require(`lodash.debounce`);
const { spawn } = require(`child_process`);
const program = require("caporal");

const findOn = [149, 141];
const returnMathces = (arr) => {
  const map = {
    141: "Central Delhi",
    145: "East Delhi",
    140: "New Delhi",
    146: "North Delhi",
    147: "North East Delhi",
    143: "North West Delhi",
    148: "Shahdara",
    149: "South Delhi",
    144: "South East Delhi",
    150: "South West Delhi",
    142: "West Delhi",
  };

  console.log(chalk.red("Running on districts"));
  for (let val of arr) {
    console.log(val, map[val]);
  }
};

const day = new Date();

let today = `${day.getDate()}-${day.getMonth() + 1}-${day.getFullYear()}`;

let nextDay1 = `${day.getDate() + 1}-${
  day.getMonth() + 1
}-${day.getFullYear()}`;

let nextDay2 = `${day.getDate() + 2}-${
  day.getMonth() + 1
}-${day.getFullYear()}`;

let nextDay3 = `${day.getDate() + 3}-${
  day.getMonth() + 1
}-${day.getFullYear()}`;

program
  .version("2.0.0")
  .description("COWIN")
  .action(() => {
    console.log(
      chalk.bgRed(
        `Getting slots, time of request ${day.getHours()}:${day.getMinutes()}`
      )
    );

    async function fetch2(date = today) {
      const response1 = axios.get(
        `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=149&date=${date}`
      );
      const response2 = axios.get(
        `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=141&date=${date}`
      );
      response1.apikey =
        response2.apikey = `3sjOr2rmM52GzhpMHjDEE1kpQeRxwFDr4YcBEimi`;

      const buffer = await Promise.all([response1]);

      for (let here of buffer) {
        for (let hit of here[`data`][`sessions`]) {
          if (
            hit[`available_capacity_dose2`] > 0 &&
            hit[`fee_type`] == `Free` &&
            (hit[`min_age_limit`] === 45 || hit["allow_all_age"] === true)
          ) {
            console.log(chalk.yellow(`Name`), chalk.cyan(` : ${hit["name"]}`));
            console.log(
              chalk.yellow(`Address`),
              chalk.cyan(` : ${hit["address"]}`)
            );
            console.log(chalk.blue(`Date`), ` : ${date}`);
            console.log(chalk.blue(`PIN`), ` : ${hit["pincode"]}`);
            console.log(chalk.blue(`Fee Type`), ` : ${hit["fee_type"]}`);
            console.log(
              chalk.blue(`Min. Age Limit`),
              ` : ${hit["min_age_limit"]}`
            );
            console.log(
              chalk.blue(`Allow all Ages`),
              ` : ${hit["allow_all_age"]}`
            );
            console.log(chalk.white(`District`), ` : ${hit["district_name"]}`);
            console.log(
              chalk.white(`Available`),
              ` : ${hit[`available_capacity`]}`
            );
            console.log(
              chalk.white(`Dose 1 availability`),
              ` : ${hit[`available_capacity_dose1`]}`
            );
            console.log(
              chalk.white(`Dose 2 availability`),
              ` : ${hit[`available_capacity_dose2`]}`
            );
            console.log(
              chalk.bgWhite(
                `--------------------------------------------------------------------------------------------------------------------------------`
              )
            );
          }
        }
      }
    }

    fetch2();
    fetch2(nextDay1);
    fetch2(nextDay2);
    fetch2(nextDay3);

    let proc;
    const start = debounce(() => {
      if (proc) {
        console.log(`Terminated older process`);
        proc.kill();
      }

      let name = `D:/FORGE/cowin/app.js`;
      process.stdout.write("\033c");
      proc = spawn(`node`, [name], { stdio: "inherit" });
    }, 40000);

    start();
  })
  .command("runningOn")
  .action(() => {
    returnMathces(findOn);
  });

program.parse(process.argv);

// getStates();
// async function getStates() {
//   const response = axios.get(
//     "https://cdn-api.co-vin.in/api/v2/admin/location/states"
//   );
//   response.apikey = "3sjOr2rmM52GzhpMHjDEE1kpQeRxwFDr4YcBEimi";

//   response.then((res) => {
//     console.log(res["data"]);
//   });
//   // DELHI state_id=9;
// }

// getDistricts(9);
// async function getDistricts(state_id) {
//   const response = axios.get(
//     `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${state_id}`
//   );
//   response.apikey = "3sjOr2rmM52GzhpMHjDEE1kpQeRxwFDr4YcBEimi";

//   response.then((res) => {
//     console.log(res["data"]);
//   });
// }

//       __    __        ______        ______        __   __        __  __        ______
//      /\ "-./  \      /\  __ \      /\  ___\      /\ "-.\ \      /\ \/\ \      /\  ___\
//      \ \ \-./\ \     \ \  __ \     \ \ \__ \     \ \ \-.  \     \ \ \_\ \     \ \___  \
//       \ \_\ \ \_\     \ \_\ \_\     \ \_____\     \ \_\\"\_\     \ \_____\     \/\_____\
//        \/_/  \/_/      \/_/\/_/      \/_____/      \/_/ \/_/      \/_____/      \/_____/
//
