sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageBox"],
  function (Controller, MessageBox) {
    "use strict";
    return {
      onIgnoreErrors: function () {
        var that=this
        MessageBox.confirm("Are you sure you want to Delete all entries contain Errors?", {
          actions: [MessageBox.Action.YES, MessageBox.Action.NO],
          onClose: function (oAction) {
            if (oAction === MessageBox.Action.YES) {
              that.getView().setBusy(true)
              that.performAction();
            }
          },
        });
      },
      performAction: function () {
        var that=this; 
			var sUrl = "/sap/opu/odata/sap/ZQU_DG_MATERIAL_MASS_UPLOAD_SRV";
      let oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
      var url = window.location.href;
        var urlObj = new URL(url);
        var params = new URLSearchParams(urlObj.search);
        var parentReqId = params.get("parent_reqid");
      oModel.callFunction("/DELETE_ERRORS", {
        method: "GET",
        urlParameters: {
          reqid: parentReqId
        },
        success: function(data) {
          console.log(data);
          oModel.refresh(true);
          var oSmartTable = that.byId("listReport");
          oSmartTable.rebindTable();
          that.getView().setBusy(false)
          sap.m.MessageBox.success("Successfully Ignored all the errors in your entries");
        },
        error: function(err) {
          that.getView().setBusy(false)
            var errorMsg =
              res &&
              res[0] &&
              res[0].error &&
              res[0].error.response &&
              res[0].error.response.responseText
                ? res[0].error.response.responseText
                : "An unknown error occurred";
            sap.m.MessageBox.error(errorMsg);
        }
      });
      },
      onNextWorkflow: function () {
        debugger;
        var that = this;

        MessageBox.confirm("Are you sure you want to continue?", {
          actions: [MessageBox.Action.YES, MessageBox.Action.NO],
          onClose: function (oAction) {
            if (oAction === MessageBox.Action.YES) {
              that.getView().setBusy(true)
              var oApi = that.extensionAPI;
              var url = window.location.href;
              var urlObj = new URL(url);
              var params = new URLSearchParams(urlObj.search);
              var parentReqId = params.get("parent_reqid");
              that.getView().getModel().read("/ZC_QUDG_MaterialMassUpload", {
                urlParameters: {
                  "$select": "identification_key",
                  "$top": 1,
                  "$filter": "parent_reqid eq '" + encodeURIComponent(parentReqId) + "'"
                },
                success: function (oData) {
                  var oPromise = oApi.invokeActions(
                    "/ZC_QUDG_MaterialMassUploadInitiate_wf",
                    [],
                    { parent_reqid: parentReqId, s_no: "1", matnr: "",identification_key:oData.results[0].identification_key }
                  );
                  oPromise.then(
                    function (aResponse) {
                      debugger;
                      console.log(aResponse);             
                      that.getView().setBusy(false)
                      sap.m.MessageBox.success("Request Submitted Successfully");
                    },
                    function (res) {                   
                      that.getView().setBusy(false)
                      var errorMsg =
                        res &&
                        res[0] &&
                        res[0].error &&
                        res[0].error.response &&
                        res[0].error.response.responseText
                          ? res[0].error.response.responseText
                          : "An unknown error occurred";
                      sap.m.MessageBox.error(errorMsg);
                    }
                  );
                },
                error: function (oError) {
                  that.getView().setBusy(false)
                  console.error("Error fetching data for line chart", oError);
                }
              });



              
            }
          },
        });
      },
    };
  }
);
