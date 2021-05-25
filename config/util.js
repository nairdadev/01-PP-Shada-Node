var json = require('json2csv')
 
module.exports = {
downloadResource: (res, fileName, fields, data) => {
  const json2csv = new json.Parser({ fields });
  const csv = json2csv.parse(data);
  res.header('Content-Type', 'text/csv');
  res.attachment(fileName);
  return res.send(csv);
}
}