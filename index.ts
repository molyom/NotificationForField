import { stringify } from "querystring";
import {IInputs, IOutputs} from "./generated/ManifestTypes";


declare var Xrm: any;

export class NotificationPulsing implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private contextObj: ComponentFramework.Context<IInputs>;
	private _LookupFieldName : string;
	private _MessageToShow : string;
	private accountId : string;
	private _successCallback : any;
	
	// value of our field is stored to this variable
	private _value: string;

	// PCF framework to notify of changes
	private _notifyOutputChanged: () => void;

	// Define Standard container element
	private _container: HTMLDivElement;
	
 
	// Define Display Elements
	private _boxDiv: HTMLDivElement;
	private _boxInnerDiv: HTMLDivElement;
	private _textAnchor: HTMLAnchorElement;

			
	
	// Event handler 'refreshData' reference
	private _refreshData: EventListenerOrEventListenerObject;

	/**
	 * Empty constructor.
	 */
	constructor()
	{

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='starndard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		this.contextObj = context;

		// Add code to update control view
		if(context.parameters.notificationMessage.raw != null){
			this._value = context.parameters.notificationMessage.raw			
		  }

		 if (context.parameters.lookupFieldTocheck.raw != null){
			 this._LookupFieldName = context.parameters.lookupFieldTocheck.raw
		 }
		  if (context.parameters.MessageToShow.raw != null){
		 	this._MessageToShow = context.parameters.MessageToShow.raw
		 }

		// define standard control elements		
		this._container = document.createElement("div");

		// define the control elements
		this._boxDiv = document.createElement("div");
		this._boxDiv.setAttribute("class", "box");
		
		this._boxInnerDiv = document.createElement("div");
		this._boxInnerDiv.setAttribute("class", "animated pulse");
		
		
		this._textAnchor = document.createElement("a");
		 //this._textAnchor.setAttribute("href", "#"); // right now this does not link to anywhere, future version it may
		 //this._textAnchor.setAttribute("target", "_blank"); // right now this does not link to anywhere, future version it may
	
		this._textAnchor.innerHTML = "THIS IS A DEBUG TEST!"

		// inception stuff going on
		this._boxDiv.appendChild( this._boxInnerDiv);
		this._boxInnerDiv.appendChild( this._textAnchor );
		
		

		// add control elements to the div
		this._container.appendChild(this._boxDiv);
		container.appendChild(this._container);


	    //this._notifyOutputChanged = notifyOutputChanged;		

	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		
		if( this._value == "" || this._value === null ){			
			console.log("No value");
			this._boxDiv.setAttribute("style", "visibility:hidden;");
		}else{
			this._boxDiv.setAttribute("style", "visibility:visible;");
			
	}
	

		if((<any>this.contextObj).page.entityId != null 
		&& (<any>this.contextObj).page.entityId != "00000000-0000-0000-0000-000000000000")
		{

	
// this.contextObj.webAPI.retrieveRecord((<any>this.contextObj).page.entityTypeName, (<any>this.contextObj).page.entityId, "?$select=pes_accountmetid").then();
	 var url = (<any>Xrm).Utility.getGlobalContext().getClientUrl();
	// //var recordUrl: string = url + "/api/data/v9.1/"+(<any>this.contextObj).page.entityTypeName+ "(" + (<any>this.contextObj).page.entityId + ")?$select=_"+ this._LookupFieldName+"_value";
	 var recordUrl: string = url + "/api/data/v9.1/"+(<any>this.contextObj).page.entityTypeName+ "s(" + (<any>this.contextObj).page.entityId + ")?$select=_"+this._LookupFieldName+"_value";
	// // https://alantrapre.crm4.dynamics.com/api/data/v9.1/pes_newmeetingnotes(c93e3040-d98d-ea11-a811-000d3a20ff86)?$select=_pes_accountmetid_value
	//  var _pes_accountmetid_value  = "";	
	//  var _pes_accountmetid_value_formatted ="";
	 var req = new XMLHttpRequest();
	 var self = this;
	 req.open("GET",recordUrl , true);
	 req.setRequestHeader("OData-MaxVersion", "4.0");
	 req.setRequestHeader("OData-Version", "4.0");
	 req.setRequestHeader("Accept", "application/json");
	 req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	 req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
	 req.onreadystatechange = function() {
	 	if (this.readyState === 4) {
	 		req.onreadystatechange = null;
	 		if (this.status === 200) {
	 			var result = JSON.parse(this.response);
				 
				// self._textAnchor.innerHTML = result["_pes_accountmetid_value@OData.Community.Display.V1.FormattedValue"] + self._MessageToShow; // "<br> Is PE type. click on Accountmet Filed to update PE preferences";
				 self._textAnchor.innerHTML = result["_"+self._LookupFieldName+"_value@OData.Community.Display.V1.FormattedValue"] + self._MessageToShow; // "<br> Is PE type. click on Accountmet Filed to update PE preferences";

				
			
				//  _pes_accountmetid_value = result["_pes_accountmetid_value"];
				//  _pes_accountmetid_value_formatted = result["_pes_accountmetid_value@OData.Community.Display.V1.FormattedValue"];
	 			// var _pes_accountmetid_value_lookuplogicalname = result["_pes_accountmetid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];

	 		
				
	 		} else {

	 			//Xrm.Utility.alertDialog(this.statusText);
			}
		}
	 };


	
	 req.send();

	
	
		}
	 else{
		alert("ELSE ");
	 }
		
	}

	
	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {
			notificationMessage : this._value
		};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
	}
}