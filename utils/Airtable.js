var Airtable = require("airtable");
var base = new Airtable({ apiKey: "keyQCsxwtKfVXBGQ7" }).base(
  "appd8lkyTKLsh6D99"
);

const fetchCurrent = () => {
  base("BLM").find("recWVCnlxDRFfUxMs", function (err, record) {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Retrieved", record);
  });
};

const mourn = () => {
  base("BLM").update(
    [
      {
        id: "recWVCnlxDRFfUxMs",
        fields: {
          Name: "BLM",
          Currently: 0,
          Total: 0,
        },
      },
    ],
    function (err, records) {
      if (err) {
        console.error(err);
        return;
      }
      records.forEach(function (record) {
        console.log(record.get("Currently"));
      });
    }
  );
};
