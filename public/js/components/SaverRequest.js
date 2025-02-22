import AlertComponent from "./AlertComponent.js";
import { handleAjaxError, makeAjaxRequest } from "./MakeAjaxRequest.js";
class SaverRequest {
  constructor(baseUrl, general, props = {}) {
    this.baseUrl = baseUrl;
    this.general = general;
    this.props = props;
    this.props.isConfirmed = this.props.isConfirmed || false;
    this.functionsMap = this.props.functionsMap || {};
  }

  async sendRequest(saveObject) {
    this.general.disableSave();
    try {
      const response = await makeAjaxRequest(this.props.requestType, `${this.baseUrl}/${this.props.requestedUrl}`, saveObject, 'json');
      if (response) {
        this.handleResponse(response);
      }
    } catch (error) {
      handleAjaxError(error);
    } finally {
      this.general.enableSave();
    }
  }

  handleResponse(response) {
    if (response.status === false && response.error == "" && response.data == null) {
      AlertComponent.getAlertMessage({ title: 'Information!', message: response.message, type: 'info' });
    } else if (response.status === false && response.error !== "" && response.data == null) {
      AlertComponent.getAlertMessage({ title: 'Operation failed!', message: response.message, type: 'danger' });
    } else if (response.status === false && response.data) {
      AlertComponent.getAlertMessage({ title: 'Operation Warning!', message: response.message, type: 'warning' });
    } else {
      if (this.props.isConfirmed) {
        AlertComponent._getConfirmMessage('Successfully!', 'Voucher saved!\nWould you like to print the invoice as well?', 'success', function (result) {
          if (result) {
            this.props.propsPrintVoucher(response.data);
            this.props.propsResetVoucher();
          }
        }.bind(this));
        this.props.propsResetVoucher();
      }
      else {
        AlertComponent.getAlertMessage({ title: 'Operation Success!', message: response.message, type: 'success' });
        this.props.propsResetVoucher();
      }
    }
    this.general.enableSave();
  }
}
export default SaverRequest;