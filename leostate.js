
function statesRender(states){
    var statesElement = document.getElementById('state-map');
    statesElement.classList.add('border-rounded')
    var stateBtns = '<h4 class="mb-2">States Map</h4>';
    stateBtns = '<p>You can put the map insteaded of it</p>'
    states.forEach(stateVal => {
        stateBtns += `<a href="./leo.html?stateVal=${stateVal}"><button type="button" id="stateButton-${stateVal}" class="state-Btn btn btn-primary" >${stateVal}</button></a>`;
    })
    statesElement.innerHTML = stateBtns;
}



// function analyzeSheetByState(sheetData){
//     var stateList = [];
//     var stateSheets = [];
//     var sheetKeys = [];
//     var stateIndex = 0;
//     const stateKey = 'LOCNAME';
//     sheetData.forEach((element, index) => {
//         element.forEach((item, eIndex) => {
//                 if(index == 0){
//                     if(item == stateKey){
//                         stateIndex = eIndex;
//                     }	
//                     sheetKeys = element;
//                 }else{
//                     if(eIndex == stateIndex ){
//                         if(!stateList.find((stateVal) => stateVal == item)){
//                             stateList.push(item);
//                             var stateItem = {
//                                 state: item,
//                                 sheetkeys: sheetKeys,
//                                 sheet: [element]
//                             };
//                             stateSheets.push(stateItem);
//                         }else{
//                             stateSheets.map(sheetItem => {
//                                 if(sheetItem.state == item){
//                                     sheetItem.sheet.push(element);
//                                 }
//                             })
//                         };
                        
//                     }
//                 }
                
//             });
//     });
//     statesRender(stateList);
// }




function analyzeSheetByState(sheetData){
    var stateList = [];
    var stateSheets = [];
    var sheetKeys = [];
    var stateIndex = 0;
    const stateKey = 'LOCNAME';
    sheetData.forEach((element, index) => {
        element.forEach((item, eIndex) => {
            if(index == 0){
                // Identifying the index for state information
                if(item === stateKey){
                    stateIndex = eIndex;
                }
                // Store the keys from the first row
                sheetKeys = element;
            }else{
                // Process each row after the first
                if(eIndex === stateIndex ){
                    // Clean the state name by removing (LEO)
                    var cleanedState = item.replace(/\(LEO\)/g, '').trim();
                    if(!stateList.includes(cleanedState)){
                        // Add to state list if not already included
                        stateList.push(cleanedState);
                        // Create a new state item
                        var stateItem = {
                            state: cleanedState,
                            sheetkeys: sheetKeys,
                            sheet: [element]
                        };
                        stateSheets.push(stateItem);
                    } else {
                        // Add the current row to the existing state sheet
                        stateSheets.forEach(sheetItem => {
                            if(sheetItem.state === cleanedState){
                                sheetItem.sheet.push(element);
                            }
                        });
                    };
                }
            }            
        });
    });
    // Render the state list
    statesRender(stateList);
}








function parseExcel(excelFilePath){
    var sheetData = [];
    fetch(excelFilePath)
      .then((res) => res.blob())
      .then((text) => {
        var reader = new FileReader();
        reader.onload = function(e) {
          var data = e.target.result;
          var workbook = XLSX.read(data, {
            type: 'binary'
          });

          workbook.SheetNames.forEach(function(sheetName) {
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
            analyzeSheetByState(sheetData);
          })

        };

        reader.onerror = function(ex) {
          console.log(ex);
        };

        reader.readAsBinaryString(text);
       })
      .catch((e) => console.error(e));
}












