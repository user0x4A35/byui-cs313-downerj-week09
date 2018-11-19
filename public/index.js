function byId(id) {
    return document.getElementById(id);
}

let divAjax;
let divAjaxResponse;
let selOutput;
let frmMain;
let btRequest;

function ajax() {

}

function validateInputs() {
    const validTypes = [
        'letter-stamped',
        'letter-metered',
        'large-flat',
        'first-class-retail',
    ];
    const validOutputs = [
        'html',
        'json',
        'ajax',
    ];

    let type = frmMain.elements['type'].value;
    let weight = frmMain.elements['weight'].value;
    let output = frmMain.elements['output'].value;

    let validType = validTypes.indexOf(type) >= 0;
    let validOutput = validOutputs.indexOf(output) >= 0;
    let validWeight = (!isNaN(weight) && (weight >= 0.01 && weight <= 13.00));

    return validType && validWeight && validOutput;
}

function onOutputSelectorChange() {
    divAjaxResponse.innerHTML = '';

    if (selOutput.value === 'ajax') {
        divAjax.style.display = '';
    } else {
        divAjax.style.display = 'none';
    }
}

function onWindowLoad() {
    divAjax = byId('div-ajax');
    divAjaxResponse = byId('div-ajax-response');
    selOutput = byId('sel-output');
    frmMain = byId('frm-main');
    btRequest = byId('bt-request');

    // call triggers once to initialize
    onOutputSelectorChange();
    onFormChange();
}

function onFormChange() {
    btRequest.disabled = !validateInputs();
}

function onRequestClick() {
    switch (selOutput.value) {
        case 'html':
        case 'json':
            if (validateInputs()) {
                frmMain.submit();
            }
            break;
        
        case 'ajax':
            if (validateInputs()) {
                let data = new FormData(frmMain);
                
                for (let datum of data) {
                    console.log(datum);
                }

                ajaxGet('/getRate', data)
                .then((html) => {
                    divAjaxResponse.innerHTML = html;
                })
                .catch((err) => {
                    console.log(err);
                });
            }
            break;
    }
}

window.addEventListener('load', onWindowLoad);