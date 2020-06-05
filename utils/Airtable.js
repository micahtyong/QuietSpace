var Airtable = require("airtable");
var base = new Airtable({ apiKey: "keyQCsxwtKfVXBGQ7" }).base(
  "appd8lkyTKLsh6D99"
);

export const fetchLives = () => {
  return new Promise((resolve, reject) => {
    const lives = [];
    base("Lives")
      .select({
        maxRecords: 30,
        view: "Grid view",
      })
      .eachPage(
        function page(records, fetchNextPage) {
          records.forEach(function (record) {
            if (record.get("Include")) {
              lives.push([record.get("Name"), record.get("Life")]);
            }
          });
          fetchNextPage();
        },
        function done(err) {
          if (err) {
            reject(err);
          }
          resolve(lives);
        }
      );
  });
};

export const fetchCurrent = () => {
  return new Promise((resolve, reject) => {
    base("BLM").find("recWVCnlxDRFfUxMs", function (err, record) {
      if (err) {
        reject(err);
      }
      const stats = {
        current: record.get("Currently"),
        total: record.get("Total"),
      };
      resolve(stats);
    });
  });
};

export const mourn = (newCurrent, newTotal) => {
  return new Promise((resolve, reject) => {
    base("BLM").update(
      [
        {
          id: "recWVCnlxDRFfUxMs",
          fields: {
            Name: "BLM",
            Currently: newCurrent,
            Total: newTotal,
          },
        },
      ],
      function (err, records) {
        if (err) {
          reject(err);
        }
        records.forEach(function (record) {});
        resolve(newCurrent);
      }
    );
  });
};
