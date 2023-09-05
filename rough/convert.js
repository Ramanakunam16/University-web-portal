app.get('/uplodedFiles', (req, res) => {
  if (!req.files) {
    res.status(400).send('No file uploaded');
    return;
  } else {
    res.send('uploaded successfull');
  }
  const mdbFile = req.files.file;
  // if (mdbFile.type !== "application/x-mdb") {
  //   res.status(400).send("Invalid file ");
  //   return;
  // }
  const mdbFileData = mdbFile.data;

  console.log(req.files.file);
  // const nonNullMdbFileData = mdbFileData.filter(byte => byte !== 0x00);
  // fs.writeFileSync(mdbFile.name, nonNullMdbFileData);
  console.log(mdbFile.name);

  // const nonNullMdbFileData = mdbFileData.filter((byte) => byte !== 0x00);
  // fs.writeFileSync(mdbFileData, nonNullMdbFileData);
  // console.log(nonNullMdbFileData);

  const csvFilePath = `data.csv`;
  const tableName = 'Amber';

  console.log(tableName);

  // Convert MDB to CSV
  const mdbToCsvCommand = `mdb-export "${mdbFile.name}" ${tableName} > ${csvFilePath}`;
  console.log('Executing command:', mdbToCsvCommand);
  exec(mdbToCsvCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error extracting data: ${error.message}`);
      console.log('s2:', stderr);
      res.status(500).send('Error extracting data');
      return;
    }
    console.log('s1:', stdout);
    console.log('Data extracted successfully');
    // Convert CSV to Excel
    const csvData = fs.readFileSync(csvFilePath, 'utf-8');
    const csvRows = csvData.split('\n');
    const xlsxData = csvRows.map(row => [row.split(',')]);
    console.log(xlsxData);
    const xlsxBuffer = xlsx.build([{ name: 'Sheet 1', data: xlsxData }]);
    console.log(xlsxData);
    console.log(xlsxBuffer);

    // Send the xlsx data as a response
    res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
    res.type(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.send(xlsxBuffer);
  });
});
