// Import the AJAX request helper function
import { makeAjaxRequest } from "./MakeAjaxRequest.js";

export default class SettingConfigurationComponent {
  constructor() {
    this.settingConfiguration = {};
    this.isLoading = true;
    this.error = null;
  }

  async initialize() {
    await this.fetchSettingConfiguration();
  }

  async fetchSettingConfiguration() {
    try {
      const response = await makeAjaxRequest('GET', `${base_url}/setting_configuration/getSettingConfigurationById`, { id: 1 });
      this.settingConfiguration = { ...response.data };
      this.isLoading = false; // Update loading state
    } catch (error) {
      this.error = error;
      this.isLoading = false; // Update loading state
    }
  }

  getConfiguration() {
    return this.settingConfiguration;
  }
}
