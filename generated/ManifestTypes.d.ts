/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    notificationMessage: ComponentFramework.PropertyTypes.StringProperty;
    lookupFieldTocheck: ComponentFramework.PropertyTypes.StringProperty;
    MessageToShow: ComponentFramework.PropertyTypes.StringProperty;
}
export interface IOutputs {
    notificationMessage?: string;
}
