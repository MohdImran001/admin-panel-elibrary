window.onload = function()
{
    let  count = 0;
    function checkStatus(totalFiles) {
        const status = document.querySelector('#uploadStatus');
        if(count === totalFiles)
        {
            status.innerText = `uploaded ${totalFiles} files`;
        }
        else
        {
            status.innerText = `uploading ${count}/${totalFiles} files`;
        }
    }

    document.querySelector('#file-input').onchange = () => {
        const files = document.querySelector('#file-input').files;
        const file = files[0];
        if(file == null)
            return alert('No File Selected');

        // hidden input value field
        const input = document.getElementById('content');
        input.value = '';
        count = 0; //global variable count for updating status

        //some counts
        const totalFiles = Array.from(files).length;
        Array.from(files).forEach((file, index) => {
            getSignedRequest(file, totalFiles);
        });
    };

    function getSignedRequest(file, totalFiles) {

        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/admin/sign?file-name=${file.name}&file-type=${file.type}`);
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4) {
                if(xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    uploadFile(file, response.signedRequest, response.url, totalFiles)
                }
            }
        };
        xhr.send();

    }

    function uploadFile(file, signedRequest, url, totalFiles){
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', signedRequest);
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4) {
                //console.log(xhr.responseText);
                if(xhr.status === 200) {

                    let obj = {};
                    obj.name = file.name;
                    obj.path = url;
                    obj.type = file.type;

                    const input = document.getElementById('content');
                    if(input.value === '')
                      input.value += `${JSON.stringify(obj)}`;
                    else {
                      input.value += `|${JSON.stringify(obj)}`;
                    }

                    //update status
                    count++;
                    checkStatus(totalFiles);
                }
                else {
                    alert('file not uploaded');
                }
            }
        };
        xhr.send(file);
    }
};
