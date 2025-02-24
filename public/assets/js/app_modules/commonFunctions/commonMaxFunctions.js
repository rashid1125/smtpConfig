const getMaxVoucherNumber = (url, method,vrdate="") => {
    return new Promise((resolve, reject) => {
        $.ajax({
            type    : method,
            url     : base_url + 'index.php/' + url,
            data    : {vrdate},
            datatype: 'JSON',
            success : function (response) {
                resolve(response);
            },
            error: function (xhr, status, error) {
                reject(console.log(xhr.responseText));
            }
        });
    });
};
const populateGetMaxVrnoa = async (url, method) => {
    const res = await getMaxVoucherNumber(url, method);
    if (res !==false) {
        $('#txtVrnoa').val(res);
        $('#txtMaxVrnoaHidden').val(res);
        $('#txtVrnoaHidden').val(res);
    }
};
const populateGetMaxVrno = async (url, method,vrdate) => {
    const res = await getMaxVoucherNumber(url, method,vrdate);
    if (res !==false) {
        $('#txtVrno').val(res);
        $('#txtMaxVrnoHidden').val(res);
        $('#txtVrnoHidden').val(res);
    }
};

const getMaxVrnoa = (url, method) => {
    populateGetMaxVrnoa(url, method);
};

const getMaxVrno = (url, method,vrdate) => {
    populateGetMaxVrno(url, method,vrdate);
};

export { getMaxVrnoa,getMaxVrno };