const apiURL            = base_url;
const emailApiEndpoints = {
    getEmailById      : `${apiURL}/smtpUser/getEmailById`,
    getEmailDataTable : `${apiURL}/smtpUser/getEmailDataTable`,
    saveEmail         : `${apiURL}/smtpUser/saveEmail`,
    getAllEmail       : `${apiURL}/smtpUser/getAllEmail`
};

export {
    emailApiEndpoints, apiURL
};
