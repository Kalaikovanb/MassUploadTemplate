sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/message/MessageManager",
    "sap/m/MessagePopover",
    "sap/m/MessageItem",
    "sap/m/Button",
    "sap/ui/core/MessageType",
    "sap/ui/dom/isBehindOtherElement",
    "sap/ui/core/Element",
    "sap/ui/model/json/JSONModel",
    "sap/m/p13n/Engine",
    "sap/m/p13n/SelectionController",
    "sap/m/p13n/SortController",
    "sap/m/p13n/GroupController",
    "sap/m/p13n/FilterController",
    "sap/m/p13n/MetadataHelper",
    "sap/ui/model/Sorter",
    "sap/m/ColumnListItem",
    "sap/m/Text",
    "sap/ui/core/library",
    "sap/m/table/ColumnWidthController",
    "sap/ui/model/Filter",
  ],
  function (
    Controller,
    MessageManager,
    MessagePopover,
    MessageItem,
    Button,
    MessageType,
    isBehindOtherElement,
    Element,
    JSONModel,
    Engine,
    SelectionController,
    SortController,
    GroupController,
    FilterController,
    MetadataHelper,
    Sorter,
    ColumnListItem,
    Text,
    coreLibrary,
    ColumnWidthController,
    Filter
  ) {
    "use strict";
    return {
      onInit: function () {
        debugger
        this.byId('template:::ObjectPageAction:::SaveAndNext').setVisible(false);
        this.byId('template:::ObjectPageAction:::SaveAndNext').setEnabled(false);
        this._oMessageManager = sap.ui.getCore().getMessageManager();
        this.getView().setModel(
          this._oMessageManager.getMessageModel(),
          "message"
        );
        this.errorMess = [];
      },
      onDupCheck: function (oEvent) {
        this.getView().setBusy(true);
        let sPath = this.getView().getBindingContext().getPath();
        var sUrl = "/sap/opu/odata/sap/ZC_QUDG_MATERIALMASSUPLOAD_CDS";
        let oDataModel = this.getView().getModel();
        let reqid =
          this.getView().getBindingContext().sPath.split("'")[1] || "";
        let sno =
          this.getView()
            .getBindingContext()
            .sPath.split(",")[1]
            .split("=")[1] || "";
        let oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
        sap.ui.getCore().setModel(oModel);
        oDataModel.setProperty(sPath + "/dup_check_button", true);
        let oCurrentData = oDataModel.getData(sPath);
        let str =
          this.getView()
            .getBindingContext()
            .sPath.split(",")[3]
            .split("=")[1] || "";
        let identifyKey = str.replace(/['"]/g, "").replace(/[()]/g, "");
        oDataModel.update(
          "/ZC_QUDG_MaterialMassUpload(parent_reqid='" +
            reqid +
            "',s_no=" +
            sno +
            ",matnr=''," +
            "identification_key='" +
            identifyKey +
            "')",
          oCurrentData,
          {
            success: function (oData, oResponse) {
              var oApi = that.extensionAPI;
              var o = that.getView().getBindingContext();
              var oPromise = oApi.invokeActions(
                "/A8DB471512C6B76D81B2D196EDuplicate_check",
                [],
                {
                  parent_reqid: reqid,
                  matnr: "",
                  s_no: sno,
                  identification_key: identifyKey,
                }
              );
              oPromise.then(
                function (aResponse) {
                  oDataModel.setProperty(sPath + "/dup_check_button", false);
                  console.log(aResponse);
                  debugger;
                  var oMatnr = that.getView().getModel().oData[
                    "ZC_QUDG_MaterialMassUpload(parent_reqid='" +
                    reqid +
                    "',s_no=" +
                    sno +
                    ",matnr=''," +
                    "identification_key='" +
                    identifyKey +
                    "')"
                ]["matnr"];
                
                  var oMaktx = that.getView().getModel().oData[
                    "ZC_QUDG_MaterialMassUpload(parent_reqid='" +
                    reqid +
                    "',s_no=" +
                    sno +
                    ",matnr=''," +
                    "identification_key='" +
                    identifyKey +
                    "')"
                ]["maktx"];
                  var oMbrsh = that.getView().getModel().oData[
                    "ZC_QUDG_MaterialMassUpload(parent_reqid='" +
                    reqid +
                    "',s_no=" +
                    sno +
                    ",matnr=''," +
                    "identification_key='" +
                    identifyKey +
                    "')"
                ]["mbrsh"];
                  var oMtart = that.getView().getModel().oData[
                    "ZC_QUDG_MaterialMassUpload(parent_reqid='" +
                    reqid +
                    "',s_no=" +
                    sno +
                    ",matnr=''," +
                    "identification_key='" +
                    identifyKey +
                    "')"
                ]["mtart"];
                  var oWerks = that.getView().getModel().oData[
                    "ZC_QUDG_MaterialMassUpload(parent_reqid='" +
                    reqid +
                    "',s_no=" +
                    sno +
                    ",matnr=''," +
                    "identification_key='" +
                    identifyKey +
                    "')"
                ]["werks"];

                  var oJSONModel1 = new sap.ui.model.json.JSONModel({
                    data: [
                      {
                        matnr: oMatnr,
                        maktx: oMaktx,
                        mbrsh: oMbrsh,
                        mtart: oMtart,
                        werks: oWerks,
                      },
                    ],
                  });
                  that.getView().setModel(oJSONModel1, "JSONModel1");

                  if (aResponse[0] && aResponse[0].response) {
                    var oResponseContext = aResponse[0].response.context;
                    if (oResponseContext) {
                      var oJSONModel = new sap.ui.model.json.JSONModel({
                        data: aResponse[0].response.data.results,
                      });
                      debugger;
                      console.log(oJSONModel);
                      that.getView().setModel(oJSONModel, "JSONModel");
                      var oView = that.getView();

                      //p13n///////////////

                      that._registerForP13n();

                      ////////////
                      that.getView().setBusy(false);
                      if (!that._oFragment) {
                        that._oFragment = sap.ui.xmlfragment(
                          oView.getId(),
                          "com.list.masslist.ext.fragments.DuplicateCheck",
                          that
                        );
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
                          buttons: [
                            {
                              text: "Ignore Duplicates",
                              type: "Emphasized",
                              press: function () {
                                let path = that
                                  .getView()
                                  .getBindingContext()
                                  .getPath();
                                let oModelData = that.getView().getModel();
                                oModelData.setProperty(
                                  sPath + "/dup_indicator",
                                  "Duplicates Ignored"
                                );
                                that.duplicateCheckDialog.close();
                                sap.m.MessageToast.show(
                                  "Potential duplicates Ignored"
                                );
                              },
                            },
                            {
                              text: "Cancel",
                              press: function () {
                                that.duplicateCheckDialog.close();
                              },
                            },
                          ],
                          afterClose: function () {},
                        });
                      }
                      oView.addDependent(that.duplicateCheckDialog);
                      that.duplicateCheckDialog.open();
                      that.getView().setBusy(false);
                      that.ResponseContext = oResponseContext;
                    }
                  }
                },
                function () {
                  oDataModel.setProperty(sPath + "/dup_check_button", false);
                  that.getView().setBusy(false);
                }
              );
            },
            error: function (oError) {
              that.getView().setBusy(false);
              oDataModel.setProperty(sPath + "/dup_check_button", false);
            },
          }
        );

        var that = this;
        var oNavController = this.extensionAPI.getNavigationController();

        var oView = that.getView();

        if (!that._oFragment) {
          that._oFragment = sap.ui.xmlfragment(
            oView.getId(),
            "com.list.masslist.ext.fragments.DuplicateCheck",
            that
          );
        }
      },
      onSelectError: function () {
        this.getView().setBusy(true);
        var that = this;
        let sPath = this.getView().getBindingContext().getPath();
        var sUrl = "/sap/opu/odata/sap/ZC_QUDG_MATERIALMASSUPLOAD_CDS";
        let oDataModel = this.getView().getModel();
        let reqid = this.getView().getBindingContext().sPath.split("'")[1];
        let sno = this.getView()
          .getBindingContext()
          .sPath.split(",")[1]
          .split("=")[1];
        debugger;
        let str =
          this.getView()
            .getBindingContext()
            .sPath.split(",")[3]
            .split("=")[1] || "";
        let identifyKey = str.replace(/['"]/g, "").replace(/[()]/g, "");
        let oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
        sap.ui.getCore().setModel(oModel);
        oDataModel.setProperty(sPath + "/dup_check_button", false);
        oDataModel.setProperty(sPath + "/dup_indicator", "");
        let oCurrentData = oDataModel.getData(sPath);
        oDataModel.update(
          "/ZC_QUDG_MaterialMassUpload(parent_reqid='" +
            reqid +
            "',s_no=" +
            sno +
            ",matnr=''," +
            "identification_key='" +
            identifyKey +
            "')",
          oCurrentData,
          {
            success: function (oData, oResponse) {
              console.log(oResponse);
              that.getView().setBusy(false);
            },
            error: function (oError) {
              that.getView().setBusy(false);
              let model = that.getOwnerComponent().getModel();

              var aModels = [
                new sap.ui.model.odata.v2.ODataModel(
                  "/sap/opu/odata/sap/ZC_QUDG_MATERIALMASSUPLOAD_CDS/?sap-value-list=ZC_QUDG_MATERIALMASSUPLOAD_CDS.ZC_QUDG_MaterialMassUploadType/meins&sap-language=EN"
                ),
                new sap.ui.model.odata.v2.ODataModel(
                  "/sap/opu/odata/sap/ZC_QUDG_MATERIALMASSUPLOAD_CDS/?sap-value-list=ZC_QUDG_MATERIALMASSUPLOAD_CDS.ZC_QUDG_MaterialMassUploadType/aland,ZC_QUDG_MATERIALMASSUPLOAD_CDS.ZC_QUDG_MaterialMassUploadType/mtpos,ZC_QUDG_MATERIALMASSUPLOAD_CDS.ZC_QUDG_MaterialMassUploadType/tatyp,ZC_QUDG_MATERIALMASSUPLOAD_CDS.ZC_QUDG_MaterialMassUploadType/taxkm&sap-language=EN"
                ),
                new sap.ui.model.odata.v2.ODataModel(
                  "/sap/opu/odata/sap/ZC_QUDG_MATERIALMASSUPLOAD_CDS/?sap-value-list=ZC_QUDG_MATERIALMASSUPLOAD_CDS.ZC_QUDG_MaterialMassUploadType/casnr,ZC_QUDG_MATERIALMASSUPLOAD_CDS.ZC_QUDG_MaterialMassUploadType/herkl,ZC_QUDG_MATERIALMASSUPLOAD_CDS.ZC_QUDG_MaterialMassUploadType/herkr,ZC_QUDG_MATERIALMASSUPLOAD_CDS.ZC_QUDG_MaterialMassUploadType/mtvfp,ZC_QUDG_MATERIALMASSUPLOAD_CDS.ZC_QUDG_MaterialMassUploadType/steuc&sap-language=EN"
                ),
                new sap.ui.model.odata.v2.ODataModel(
                  "/sap/opu/odata/sap/ZC_QUDG_MATERIALMASSUPLOAD_CDS/?sap-value-list=ZC_QUDG_MATERIALMASSUPLOAD_CDS.ZC_QUDG_MaterialMassUploadType/dismm&sap-language=EN"
                ),
                new sap.ui.model.odata.v2.ODataModel(
                  "/sap/opu/odata/sap/ZC_QUDG_MATERIALMASSUPLOAD_CDS/?sap-value-list=ZC_QUDG_MATERIALMASSUPLOAD_CDS.ZC_QUDG_MaterialMassUploadType/bklas,ZC_QUDG_MATERIALMASSUPLOAD_CDS.ZC_QUDG_MaterialMassUploadType/bwtar,ZC_QUDG_MATERIALMASSUPLOAD_CDS.ZC_QUDG_MaterialMassUploadType/bwtty,ZC_QUDG_MATERIALMASSUPLOAD_CDS.ZC_QUDG_MaterialMassUploadType/eklas,ZC_QUDG_MATERIALMASSUPLOAD_CDS.ZC_QUDG_MaterialMassUploadType/qklas,ZC_QUDG_MATERIALMASSUPLOAD_CDS.ZC_QUDG_MaterialMassUploadType/vprsv&sap-language=EN"
                ),
              ];

              var aMetadataPromises = aModels.map(function (oModel) {
                return model.metadataLoaded();
              });
              Promise.all(aMetadataPromises)
                .then(
                  function () {
                    console.log("All metadata loaded before rendering");

                    that.onErrorCheck(oError);
                  }.bind(this)
                )
                .catch(function (error) {
                  console.error("Error loading metadata:", error);
                });
            },
          }
        );
      },
      _scrollToControl: function (oControl) {
        var oPage = this.byId(oControl.getId());
        while (oPage && !oPage.scrollToElement) {
          oPage = oPage.getParent();
        }

        if (oPage && oControl && oControl.getDomRef()) {
          oPage.scrollToElement(oControl.getDomRef(), 200, [0, -100]);
        }
      },
      onErrorCheck: function (Error) {
        var Error = Error;
        var that = this;
        if (!this._oMessagePopover) {
          this._oMessagePopover = new MessagePopover({
            activeTitlePress: function (oEvent) {
              var oItem = oEvent.getParameter("item"),
                oMessage = oItem.getBindingContext("message").getObject(),
                sTarget = oMessage.target,
                errorMessage = oMessage.message,
                oPage = that.getView().byId("objectPage");

              var oControl = that._findControlByTarget(sTarget);
              if (oControl && oControl !== "") {
                debugger;
                that._scrollToControl(oControl);
                oControl.setValueState("Error");
                oControl.setValueStateText(errorMessage);
                oControl.focus();
              }
            },
            items: {
              path: "message>/",
              template: new MessageItem({
                title: "{message>message}",
                subtitle: "{message>additionalText}",
                groupName: {
                  parts: [{ path: "message>controlIds" }],
                  formatter: this.getGroupName,
                },
                activeTitle: {
                  parts: [{ path: "message>controlIds" }],
                  formatter: this.isPositionable,
                },
                type: "{message>type}",
                description: "{message>message}",
              }),
            },
            placement: sap.m.VerticalPlacementType.Top,
            groupItems: true,
          });
          this.getView().byId("Errors").addDependent(this._oMessagePopover);
        }

        var errorDetails = JSON.parse(Error.responseText).error.innererror
          .errordetails;
        var oView = this.getView();
        var oMessageManager = this._oMessageManager;
        oMessageManager.removeAllMessages();
        errorDetails.forEach(function (data) {
          var oMessage = new sap.ui.core.message.Message({
            message: data.message,
            type: MessageType.Error,
            target: data.target,
            processor: oView.getModel(),
          });
          oMessageManager.addMessages(oMessage);
          that.errorMess.push(data.message);
        });

        this._showMessagePopover();
      },
      isPositionable: function (sControlId) {
        return sControlId ? true : true;
      },
      _findControlByTarget: function (sTarget) {
        var oControl = this.getView().byId(sTarget);
        var sInputValue = "";
        debugger;
        if (sTarget !== "") {
          if (!oControl) {
            var aControls = Element.registry.filter(function (oElement) {
              return oElement.getId().includes(sTarget);
            });
            oControl = aControls && aControls.length ? aControls : null;
          }

          for (var i = 0; i < oControl.length; i++) {
            var regExp = /::Field-input$/;

            if (oControl[i] instanceof sap.m.Input) {
              var controlId = oControl[i].getId();
              if (controlId.match(regExp)) {
                sInputValue = oControl[i];
                break;
              }
            }
          }
        }
        return sInputValue;
      },
      _showMessagePopover: function () {
        var oView = this.getView();
        this._oMessagePopover.openBy(oView.byId("Errors"));
      },

      getGroupName: function (sControlId) {
        var oControl = Element.registry.get(sControlId);

        if (oControl) {
          var sFormSubtitle = oControl
              .getParent()
              .getParent()
              .getTitle()
              .getText(),
            sFormTitle = oControl
              .getParent()
              .getParent()
              .getParent()
              .getTitle();

          return sFormTitle + ", " + sFormSubtitle;
        }
      },

      _registerForP13n: function () {
        debugger;
        const oTable = this.byId("persoTable");

        this.oMetadataHelper = new MetadataHelper([
          {
            key: "Material",
            label: "Material",
            path: "Material",
          },
          {
            key: "Description",
            label: "Description",
            path: "Description",
          },
          {
            key: "MaterialType",
            label: "MaterialType",
            path: "MaterialType",
          },
          {
            key: "IndustrySector",
            label: "IndustrySector",
            path: "IndustrySector",
          },
          {
            key: "Plant",
            label: "Plant",
            path: "Plant",
          },
          {
            key: "Score",
            label: "Score",
            path: "Score",
          },
          {
            key: "Rule",
            label: "Rule",
            path: "Rule",
          },
        ]);

        const _oMetadataHelperRows = new MetadataHelper("JSONModel1");

        Engine.getInstance().register(oTable, {
          helper: this.oMetadataHelper,
          controller: {
            Columns: new SelectionController({
              targetAggregation: "columns",
              control: oTable,
              persistenceIdentifier: "selection-columns",
            }),
            Rows: new SelectionController({
              targetAggregation: "items",
              helper: _oMetadataHelperRows,
              control: oTable,
              persistenceIdentifier: "selection-items",
              enableReorder: false,
              getKeyForItem: function (oListItem) {
                return oListItem.getCells()[0].getText();
              },
            }),
          },
        });

        Engine.getInstance().attachStateChange(
          this.handleStateChange.bind(this)
        );
      },
      openPersoDialog: function (oEvt) {
        debugger;
        const oTable = this.byId("persoTable");
        this._registerForP13n();

        Engine.getInstance().show(oTable, ["Columns"], {
          contentHeight: "35rem",
          contentWidth: "32rem",
          source: oEvt.getSource(),
        });
      },
      handleStateChange: function (oEvt) {
        debugger;
        const oTable = this.byId("persoTable");
        const oState = oEvt.getParameter("state");

        if (!oState) {
          return;
        }

        oTable.getColumns().forEach(function (oColumn, iIndex) {
          oColumn.setVisible(false);
          console.log("bande");
          oColumn.setSortIndicator(coreLibrary.SortOrder.None);
          oColumn.data("grouped", false);
        });

        oState.Columns.forEach(
          function (oProp, iIndex) {
            const oCol = this.byId(oProp.key);
            oCol.setVisible(true);
            console.log(oState);
            console.log("illi bande");
            oTable.removeColumn(oCol);
            oTable.insertColumn(oCol, iIndex);
          }.bind(this)
        );

        oTable.getItems().forEach(function (oItem, iIndex) {
          oItem.setVisible(false);
        });

        oState.Rows.forEach(
          function (oProp, iIndex) {
            const aItems = this.byId("persoTable").getItems();
            const oFoundItem = aItems.find(
              (oItem) => oItem.getCells()[0].getText() == oProp.key
            );

            oFoundItem.setVisible(true);

            oTable.removeItem(oFoundItem);
            oTable.insertItem(oFoundItem, iIndex);
          }.bind(this)
        );
      },
    };
  }
);
