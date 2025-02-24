import SettingConfigurationComponent from "./SettingConfigurationComponent.js";

const defaultSettingConfiguration = {
    supplierslevel3: null,
    customerlevel3: null,
    bankslevel3: null,
    incomelevel3: null,
    expenseslevel3: null,
    generalaccountslevel3: null,
    cash: null,
    ftax: null,
    taxrate: null,
    default_cash_sale_account: -1,
    cashaccounts: -1,
    hr_cash_account: -1,
    salary_account: -1,
    salary_payable_account: -1,
    wages_account: -1,
    wages_payable_account: -1,
    eobi_account: -1,
    insurance_account: -1,
    social_security_account: -1,
    incentive_account: -1,
    penalty_account: -1
};

const baseConfiguration = { ...defaultSettingConfiguration };

async function initializeAndFetchConfiguration() {
    const settingComponent = new SettingConfigurationComponent();
    await settingComponent.initialize(); // Call the initialize method
    Object.assign(baseConfiguration, settingComponent.getConfiguration());
}

// Use the function and catch any potential errors
await initializeAndFetchConfiguration().catch(error => {
    console.error('Error initializing configuration:', error);
});

export { baseConfiguration };


