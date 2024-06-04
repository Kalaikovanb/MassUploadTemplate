sap.ui.define(['sap/ui/core/mvc/Controller',
"sap/ui/core/message/MessageManager",
    "sap/m/MessagePopover",
    "sap/m/MessageItem",
    "sap/m/Button",
    "sap/ui/core/MessageType",
	
	"sap/ui/dom/isBehindOtherElement",
	'sap/ui/core/Element',
	'sap/ui/core/library'
], function (Controller,MessageManager, MessagePopover, MessageItem, Button, MessageType,isBehindOtherElement,Element,library) {
		'use strict';
		
		
		return{
		onInit:function(){
			
			this._oMessageManager = sap.ui.getCore().getMessageManager();
			this.getView().setModel(this._oMessageManager.getMessageModel(), "message");
		
		},
		onDupCheck: function (oEvent) {
			debugger;
			this.getView().setBusy(true);
			let sPath = this.getView().getBindingContext().getPath();
			var sUrl = "/sap/opu/odata/sap/ZC_QUDG_MATERIALMASSUPLOAD_CDS";
			let oDataModel = this.getView().getModel();
			let reqid = this.getView().getBindingContext().sPath.split("'")[1];
			let sno = this.getView().getBindingContext().sPath.split(",")[1].split('=')[1];
			let oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
			sap.ui.getCore().setModel(oModel);
			oDataModel.setProperty(sPath + "/dup_check_button", true);
			let oCurrentData = oDataModel.getData(sPath);
			oDataModel.update("/ZC_QUDG_MaterialMassUpload(parent_reqid='" + reqid + "',s_no="+ sno+ ",matnr='')", oCurrentData, {
			  success: function (oData, oResponse) {
				var oApi = that.extensionAPI;
				var o = that.getView().getBindingContext();
				var oPromise = oApi.invokeActions("/A8DB471512C6B76D81B2D196EDuplicate_check", [], { parent_reqid: reqid, matnr: '',s_no:sno});
				oPromise.then(function (aResponse) {
					oDataModel.setProperty(sPath + "/dup_check_button", false);
					console.log(aResponse);
					debugger
				  var oMatnr = that.getView().getModel().oData["ZC_QUDG_MaterialMassUpload(parent_reqid='" + reqid + "',s_no="+ sno+ ",matnr='')"]["matnr"];
				  var oMaktx = that.getView().getModel().oData["ZC_QUDG_MaterialMassUpload(parent_reqid='" + reqid + "',s_no="+ sno+ ",matnr='')"]["maktx"];
				  var oMbrsh = that.getView().getModel().oData["ZC_QUDG_MaterialMassUpload(parent_reqid='" + reqid + "',s_no="+ sno+ ",matnr='')"]["mbrsh"];
				  var oMtart = that.getView().getModel().oData["ZC_QUDG_MaterialMassUpload(parent_reqid='" + reqid + "',s_no="+ sno+ ",matnr='')"]["mtart"];
				  var oWerks = that.getView().getModel().oData["ZC_QUDG_MaterialMassUpload(parent_reqid='" + reqid + "',s_no="+ sno+ ",matnr='')"]["werks"];
	  
				  var oJSONModel1 = new sap.ui.model.json.JSONModel({
					data: [{
					  "matnr": oMatnr,
					  "maktx": oMaktx,
					  "mbrsh": oMbrsh,
					  "mtart": oMtart,
					  "werks": oWerks
					}]
				  });
				  that.getView().setModel(oJSONModel1, "JSONModel1");
	  
				  if (aResponse[0] && aResponse[0].response) {
					var oResponseContext = aResponse[0].response.context;
					if (oResponseContext) {
					  var oJSONModel = new sap.ui.model.json.JSONModel({ data: aResponse[0].response.data.results });
					  debugger
					  console.log(oJSONModel);
					  that.getView().setModel(oJSONModel, "JSONModel");
					  var oView = that.getView();
	  
					  // Create or instantiate the fragment
					  if (!that._oFragment) {
						that._oFragment = sap.ui.xmlfragment(oView.getId(), "com.list.masslist.ext.fragments.DuplicateCheck", that);
						oView.addDependent(that._oFragment);
					  }
	  
					  if (!that.duplicateCheckDialog) {
						that.duplicateCheckDialog = new sap.m.Dialog({
						  contentWidth: "auto",
						  contentHeight: "auto",
						  draggable: true,
						  resizable: true,
						  title: "Duplicate Check",
						  content: [that._oFragment],
						  buttons: [{
							text: "Ignore Duplicates",
							type: "Emphasized",
							press: function () {
							  let path = that.getView().getBindingContext().getPath();
							  let oModelData = that.getView().getModel();
							  oModelData.setProperty(sPath + "/dup_indicator", "Duplicates Ignored");
							  that.duplicateCheckDialog.close();
							  sap.m.MessageToast.show("Potential duplicates Ignored");
	  
							}
						  },
						  {
							text: "Cancel",
							press: function () {
							  that.duplicateCheckDialog.close();
	  
							}
						  }],
						  afterClose: function () {
						  }
						});
					  }
					  oView.addDependent(that.duplicateCheckDialog);
					  that.duplicateCheckDialog.open();
					  that.getView().setBusy(false);
					  that.ResponseContext = oResponseContext;
					}
				  }
				}, function () {
					oDataModel.setProperty(sPath + "/dup_check_button", false);
				  that.getView().setBusy(false);
				});
			  },
			  error: function (oError) {
				that.getView().setBusy(false);
				oDataModel.setProperty(sPath + "/dup_check_button", false);
			  }
			}
			);
	  
			var that = this;
			var oNavController = this.extensionAPI.getNavigationController();
	  
	  
			var oView = that.getView();
	  
			if (!that._oFragment) {
			  that._oFragment = sap.ui.xmlfragment(oView.getId(), "com.list.masslist.ext.fragments.DuplicateCheck", that);
	  
			}
	  
		  },
		  onSelectError:function(){
			this.getView().setBusy(true);
			var that=this;
			let sPath = this.getView().getBindingContext().getPath();
			var sUrl = "/sap/opu/odata/sap/ZC_QUDG_MATERIALMASSUPLOAD_CDS";
			let oDataModel = this.getView().getModel();
			let reqid = this.getView().getBindingContext().sPath.split("'")[1];
			let sno = this.getView().getBindingContext().sPath.split(",")[1].split('=')[1];
			let oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
			sap.ui.getCore().setModel(oModel);
			oDataModel.setProperty(sPath + "/dup_check_button", false);
			let oCurrentData = oDataModel.getData(sPath);
			oDataModel.update("/ZC_QUDG_MaterialMassUpload(parent_reqid='" + reqid + "',s_no="+ sno+ ",matnr='')", oCurrentData, {
			  success: function (oData, oResponse) {
				console.log(oResponse);
				that.getView().setBusy(false);
			  },
			  error: function (oError) {
				that.getView().setBusy(false);
				that.onErrorCheck(oError)
				// oDataModel.setProperty(sPath + "/dup_check_button", false);
			  }
			}
			);
		  },
		  _scrollToControl: function (oControl) {
			// For a template-based application, you might need to use a more generic scroll function
			var oPage = oControl.getParent();
			while (oPage && !oPage.scrollToElement) {
			  oPage = oPage.getParent();
			}
	  
			if (oPage && oControl && oControl.getDomRef()) {
			  oPage.scrollToElement(oControl.getDomRef(), 200, [0, -100]);
			}
		  },
		  onErrorCheck: function (Error) {
			var Error=Error;
			var that=this;
			if (!this._oMessagePopover) {
                this._oMessagePopover = new MessagePopover({
					activeTitlePress: function (oEvent) {
						var oItem = oEvent.getParameter("item"),
						oMessage = oItem.getBindingContext("message").getObject(),
						sTarget = oMessage.target,
						oPage=that.getView().byId('objectPage');

					
					// Find the control dynamically
					var oControl = that._findControlByTarget(sTarget);
					if (oControl && oControl !=='') {
						that._scrollToControl(oControl);
						oControl.setValueState("Error");
						oControl.focus();
					}
					
					},
					items: {
						path: "message>/",
						template: new MessageItem({
							title: "{message>message}",
							subtitle: "{message>additionalText}",
							groupName: {parts: [{path: 'message>controlIds'}], formatter: this.getGroupName},						
							activeTitle: {parts: [{path: 'message>controlIds'}], formatter: this.isPositionable},
							type: "{message>type}",
							description: "{message>message}"
						})
					},
					groupItems: true
				});
				this.getView().byId("Errors").addDependent(this._oMessagePopover);
            }

			var errorDetails=JSON.parse(Error.responseText).error.innererror.errordetails;
            var oView = this.getView();
            var oMessageManager = this._oMessageManager;
            oMessageManager.removeAllMessages();
            errorDetails.forEach(function (data) {
                var oMessage = new sap.ui.core.message.Message({
                    message: data.message,
                    type: MessageType.Error,
                    target: data.target,
                    processor: oView.getModel()
                });
                oMessageManager.addMessages(oMessage);
            });

            this._showMessagePopover();
        
        },
		isPositionable : function (sControlId) {
			return sControlId ? true : true;
		},
		_findControlByTarget: function (sTarget) {
			var oControl = this.getView().byId(sTarget);
			var sInputValue = "";
			if(sTarget !=='')
			{		
				if (!oControl) {
					var aControls = Element.registry.filter(function (oElement) {
					return oElement.getId().includes(sTarget);
					});
					oControl = aControls && aControls.length ? aControls : null;
				}
			
					
			
					for (var i = 0; i < oControl.length; i++) {
						if (oControl[i].isA("sap.m.Input")) {
							sInputValue = oControl[i];
							break;
						}
					}
				
			}
			return sInputValue;
		  },
		_showMessagePopover: function () {
            var oView = this.getView();
            this._oMessagePopover.openBy(oView.byId("Errors")); 
        },

        getGroupName : function (sControlId) {
			var oControl = Element.registry.get(sControlId);

			if (oControl) {
				var sFormSubtitle = oControl.getParent().getParent().getTitle().getText(),
					sFormTitle = oControl.getParent().getParent().getParent().getTitle();

				return sFormTitle + ", " + sFormSubtitle;
			}
		},
		}
		
	}
	
)