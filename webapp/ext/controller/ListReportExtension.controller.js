sap.ui.define(["sap/ui/core/mvc/ControllerExtension", "sap/m/MessageBox"], function (
	ControllerExtension, 
) {
	"use strict";

	return ControllerExtension.extend("com.list.masslist.ext.controller.ListReportExtension", {
        override: {
			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf com.account.account.ext.controller.UpdateExt
			 */
			onAfterRendering:function(){
				debugger
				var url = window.location.href;
				var urlObj = new URL(url);
				var params = new URLSearchParams(urlObj.search);
				var parentReqId = params.get('parent_reqid');
				var oSmartFilterBar=this.base.getView().byId('listReportFilter');
				var token=oSmartFilterBar.getAllFilterItems()[120].getControl();
				token.setEditable(false);
				token.setTokens([
					new sap.m.Token({
						key: parentReqId,
						text: parentReqId
					})
				])
				setTimeout(function() {
					oSmartFilterBar.fireSearch();
				}, 0);
				
			}
			
		}
	});
});