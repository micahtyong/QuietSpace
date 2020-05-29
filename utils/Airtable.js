var Airtable = require("airtable");
var base = new Airtable({ apiKey: "keyQCsxwtKfVXBGQ7" }).base(
  "appd8lkyTKLsh6D99"
);

export const fetchCurrent = () => {
  return new Promise((resolve, reject) => {
    base("BLM").find("recWVCnlxDRFfUxMs", function (err, record) {
      if (err) {
        console.error(err);
        reject(err);
      }
      resolve(record["fields"]["Currently"]);
    });
  });
};

export const mourn = (newAmount) => {
  return new Promise((resolve, reject) => {
    base("BLM").update(
      [
        {
          id: "recWVCnlxDRFfUxMs",
          fields: {
            Name: "BLM",
            Currently: newAmount,
            Total: newAmount,
          },
        },
      ],
      function (err, records) {
        if (err) {
          console.error(err);
          reject(err);
        }
        records.forEach(function (record) {
          console.log(record.get("Currently"));
        });
        resolve(newAmount);
      }
    );
  });
};
