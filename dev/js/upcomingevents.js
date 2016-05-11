'use strict';
var matfessStaffing = matfessStaffing || {};

//function to open pages in a dialog
function openInDialog(Id) 
{      
	
    var pageUrl = "http://sharepoint.matfess.com/sites/MySite/Staffing Dashboard/EditForm.aspx?ID=" + Id + "",
        dlgWidth = 850,
        dlgHeight = 650,
        dlgAllowMaximize = true,
        dlgShowClose = true,
        needCallbackFunction = true;
        
    var options = { url: pageUrl, width: dlgWidth, height: dlgHeight, allowMaximize: dlgAllowMaximize,
        showClose: dlgShowClose		
		};
    
    console.log(options);
	if(needCallbackFunction)
	{
		options.dialogReturnValueCallback = Function.createDelegate(null, CloseDialogCallback);
	}
    SP.SOD.execute('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', options);
    
}

function CloseDialogCallback(dialogResult, returnValue)
{
	//if user click on OK or Save
     if(dialogResult == SP.UI.DialogResult.OK)
     {  // refresh parent page
         matfessStaffing.BuildTable();
 		//SP.SOD.execute('sp.ui.dialog.js', 'SP.UI.ModalDialog.RefreshPage', SP.UI.DialogResult.OK); 	 		
     }
     // if user click on Close or Cancel
     else if(dialogResult == SP.UI.DialogResult.cancel)
     {	// Do Nothing or add any logic you want 
     }
     else
     {//alert("else " + dialogResult);
     }
}

matfessStaffing.BuildTable = function(){
        
        $('table#example tr').not('thead tr').empty();
    	$.ajax({
        url: _spPageContextInfo.siteAbsoluteUrl + "/_api/web/lists/getbytitle('Staffing%20Dashboard')/items?$select=Title,Id,Available,Consultant/Role,Active_x0020_Client/ActiveClient,Probability1,Consultant/Practice_x0020_Area_x0020_2,Probability2,Note,Primary,Secondary&$expand=Consultant,Active_x0020_Client",
		method: "GET",
		headers: { "Accept": "application/json; odata=verbose" },
		success: function(xData, request){
            $('#example').dataTable({
            "bDestroy": true,
            "bProcessing": true,
            "aLengthMenu": [[25, 50, 100], [25, 50, 100]],
            "iDisplayLength": 25,
            "aaData": xData.d.results,
            "aoColumns": [
            { "mData": "Consultant.Practice_x0020_Area_x0020_2" },
            { "mData": "Title", 
              "mRender": function(data, type, full){
               //return "<a href='#' onclick='matfessStaffing.UpdateRecord("+full.Id+")'>"+data+"</a>";
               return "<a href='#' onclick='openInDialog("+full.Id+")'>"+data+"</a>";
              }
            },
            { "mData": function(data, type, val){
                var activeClients = "";
                if(data.Active_x0020_Client.results.length > 0){
                    for (var i = 0; i < data.Active_x0020_Client.results.length; i++) { 
                        activeClients = activeClients + data.Active_x0020_Client.results[i].ActiveClient + " ";
                    }
                }else{
                    activeClients = "";
                }
                return activeClients;
            }
            },
            { "mData": function(data, type, val){
                var available = moment(data.Available).utcOffset(-240).format('MM/DD/YY');
                return available;
            }},
            { "mData": "Primary" },
            { "mData": "Probability1" },  
            { "mData": "Secondary" },
            { "mData": "Probability2" },
            { "mData": "Note" }
            ]
            });
            
        },
		error: matfessStaffing.getUserError
	});
    
    
}

$(document).ready(function () {
    
    matfessStaffing.BuildTable();
 
 });