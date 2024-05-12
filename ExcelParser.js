	//let stateVal = '';
	//set the LOCNAME field 
	const stateKey = 'LOCNAME';
	//table container ID 
	//let tableContainerID = 'GSTable-container';
	//load excel file logic
	function  loadExcelFile(excelFilePath, state, tableElementID) {
		//tableContainerID = tableElementID;
		//stateVal = state;
		var sheetData = [];

		fetch(excelFilePath)
		  .then((res) => res.blob())
		  .then((text) => {
		    // do something with "text"
		    var reader = new FileReader();
			reader.onload = function(e) {
		      var data = e.target.result;
		      var workbook = XLSX.read(data, {
		        type: 'binary'
		      });

		      workbook.SheetNames.forEach(function(sheetName) {
		        // Here is your object
		        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
		        XL_row_object.forEach((element, index) => {
		        	var keys = [];
		        	var values = [];
		        	for (const [key, value] of Object.entries(element)) {
		        		keys.push(key);
		        		values.push(value);
					}
					if(index == 0){
						sheetData.push(keys);
					}
					sheetData.push(values);
			    });
		        
		        var json_object = JSON.stringify(XL_row_object);
		        analyzeExcelSheet(sheetData, state, tableElementID);
		      })

		    };

		    reader.onerror = function(ex) {
		      console.log(ex);
		    };

		    reader.readAsBinaryString(text);
		   })
		  .catch((e) => console.error(e));
	}

	//Excel file data parse/analize logic
	function analyzeExcelSheet(sheetData, stateVal, tableContainerID) {
		var stateList = [];
		var stateSheets = [];
		var sheetKeys = [];
		sheetData.forEach((element, index) => {
			element.forEach((item, eIndex) => {
					if(index == 0){
						if(item == stateKey){
							stateIndex = eIndex;
						}	
						sheetKeys = element;
					}else{
						if(eIndex == stateIndex ){
							if(!stateList.find((stateVal) => stateVal == item)){
								stateList.push(item);
								var stateItem = {
									state: item,
									sheetkeys: sheetKeys,
									sheet: [element]
								};
								stateSheets.push(stateItem);
							}else{
								stateSheets.map(sheetItem => {
									if(sheetItem.state == item){
										sheetItem.sheet.push(element);
									}
								})
							};
							
						}
					}
					
				});
		});
		buildAnualTable(stateSheets, stateVal, tableContainerID);
	}
	//Make the GS anunal Table Data from excel Sheet data
	function buildAnualTable(stateSheetData, stateVal, tableContainerID){

		var keyWord = 'annual';
		
		stateSheetData.forEach(stateData => {
			var indexs = [];
			var anunalKeys = [];
			console.log(stateData);
			stateData.sheetkeys.forEach((kItem, kIndex)=> {
				if(kItem.toLowerCase() == 'grade'){
					indexs.push(kIndex);
					anunalKeys.push(kItem);
				}
				if(kItem.toLowerCase().includes(keyWord)){
					indexs.push(kIndex);
					anunalKeys.push(kItem);
				}	
			});

			var anualTable = [];
			anualTable.push(anunalKeys);
			stateData.sheet.forEach((sItem, sindex) => {
				var getItems = [];
				indexs.forEach(item => {
					getItems.push(sItem[item]);
				});
				anualTable.push(getItems);
			});
			stateData.anualTable = anualTable;
		});
		ExcelRender(stateSheetData, stateVal, tableContainerID);
	}

	//Render Table from the sheet data
	function ExcelRender(stateSheet, stateVal, tableContainerID){
		var stateKey = stateVal? stateVal.toLowerCase() : "";

		var viewSheets = stateSheet;
		
		var tableContainer = document.getElementById(tableContainerID);
		console.log(tableContainerID, tableContainer);
		viewSheets.forEach((element, index) => {
			
			if(element.state.toLowerCase().includes(stateKey)){
				
				var renderTable = document.createElement('table');
				renderTable.classList.add('table');
				renderTable.classList.add('table-bordered');
				renderTable.classList.add('table-sm');
				var strTR = '';
				element.anualTable.forEach((aItem, aIndex) => {
					if(aIndex == 0){
						strTR += `<tr class="table-primary"><td>State</td>`;	
					}else{
						strTR += `<tr><td>${element.state}</td>`;
					}
					
					aItem.forEach((cItem, cIndex ) => {
							if(cIndex > 0 && aIndex > 0){
								strTR +=`<td>$${cItem}</td>`;	
							}else{
								strTR +=`<td>${cItem}</td>`;
							}
						})
					strTR += '</tr>';
				})
				renderTable.innerHTML = strTR;
				//pannelBody.append(renderTable);
				tableContainer.append(renderTable);
			}
		})
		
	}