sap.ui.define(
  ["sap/ui/core/mvc/ControllerExtension", "sap/m/MessageBox"],
  function () {
    "use strict";
    return {        
        onIgnoreErrors: function () {
			debugger			
			this.getView().setBusy(true); 
			var oApi = this.extensionAPI;
			var that = this;
			var url = window.location.href;
			var urlObj = new URL(url);
			var params = new URLSearchParams(urlObj.search);
			var parentReqId = params.get('parent_reqid');
			var oPromise = oApi.invokeActions("/A8DB471512C6B76D81B2D196Delete_error_req", [], { parent_reqid: parentReqId });
			oPromise.then(function (aResponse) {
				console.log(aResponse);
			}, function () {
			  that.getView().setBusy(false);
			});
        },
    };
  }
);
