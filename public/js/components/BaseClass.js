import AlertComponent from "./AlertComponent.js";

// public/js/components/BaseClass.js
export default class BaseClass {
  runException(closure) {
    try {
      return closure();
    } catch (e) {
      let customMessage = e.message;
      // Check for "Cannot read properties of null" error
      if (e.message.includes("Cannot read properties of null")) {
        customMessage = "An error occurred: Attempted to access properties of a null object.";
      } else if (e.message.includes("event.attributes is not a function")) {
        // Handle specific case where 'event.attributes' is not a function
        customMessage = "An error occurred: 'event.attributes' is not a function.";
      } else {
        // General error message for other exceptions
        customMessage = `An unexpected error occurred: ${e.message}`;
      }
      console.warn(e);  // Provide a custom warning
      return AlertComponent.getAlertMessage({ title: 'Error!', message: e.message, type: 'danger' });
    }
  }
}
