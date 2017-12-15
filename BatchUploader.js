let BatchUpLLoder = new function()
{
    let abort = true;
    let uploadRequests = [];

    this.uploadFiles = function(e)
    {
        e.preventDefault();
        getFiles(e.target);
        e.target.blur();
    };

    const processUpload = function (target, files) {
        if (!files.length) {
            return;
        }

        abort = false;
        let abortBttn = document.createElement("button");
        abortBttn.id = "foxlinksAbortBttn";
        abortBttn.textContent = "Abort Upload";
        abortBttn.addEventListener("click", abortUpload, false);
        let form = target.parentNode;
        form.appendChild(document.createTextNode(" "));
        form.appendChild(abortBttn);
        let imageBox = document.getElementById("foxlinksUploadImageBox");

        if (!imageBox) {
            imageBox = document.createElement("textarea");
            imageBox.readOnly = true;
            imageBox.id = "foxlinksUploadImageBox";
            imageBox.cols = 60;
            imageBox.rows = 6;
            imageBox.style.setProperty("position", "fixed", "");
            imageBox.style.setProperty("opacity", "0.8", "");
            imageBox.style.setProperty("bottom", "20px", "");
            imageBox.style.setProperty("right", "5px", "");
            imageBox.style.setProperty("z-index", "21", "");
            imageBox.addEventListener("click", function (e) {
                e.target.select();
            }, false);
            document.body.appendChild(imageBox);
            let closeBox = document.createElement("a");
            closeBox.href = "javascript:void(0)";
            closeBox.style.setProperty("display", "block", "");
            closeBox.style.setProperty("text-align", "center", "");
            closeBox.style.setProperty("position", "fixed", "");
            closeBox.style.setProperty("height", "13px", "");
            closeBox.style.setProperty("width", "13px", "");
            closeBox.style.setProperty("background", `url(data:image/gif;base64,R0lGODlhDQANAPcAAAAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwAAAAADQANAAAILwABBBhIsGAAgQINEkx4UGHDggwHRlxI0WHDiQoxGkRo8aFHiBtDZqzokGPHgwEBADs=)`, "");
            closeBox.style.setProperty("border", "black 1px solid", "");
            closeBox.style.setProperty("bottom", (imageBox.offsetHeight + 20 - 13 - 1).toString() + "px", "");
            closeBox.style.setProperty("right", "5px", "");
            closeBox.style.setProperty("z-index", "22", "");
            closeBox.addEventListener("click", (e) => {
                imageBox.parentNode.removeChild(imageBox);
                e.target.parentNode.removeChild(e.target);
                abortUpload();
            }, false);
            document.body.appendChild(closeBox);
        }

        document.getElementById("foxlinksUploadBttn").disabled = true;

        const filesArray = Array.from(files);

        imageBox.value = filesArray.map(() => "UPLOADING...\n").join("");

        let uploadPromises = filesArray.map((f, i) => new Promise((resolve, reject) => {
            doUpload(resolve, reject, f, i);
        }));

        Promise.all(uploadPromises).then(abortUpload);
    };

    function getFiles(target)
    {
        const filepicker = document.createElement("input");
        filepicker.type = "file";
        filepicker.multiple = true;
        filepicker.accept = "image/*";
        filepicker.onchange = () => { processUpload(target, filepicker.files); };
        filepicker.click();
    }

    function abortUpload()
    {
        abort = true;
        const offset = 0;

        let abortBttn = document.getElementById("foxlinksAbortBttn");

        if (abortBttn)
        {
            abortBttn.parentNode.removeChild(abortBttn);
        }

        document.getElementById("foxlinksUploadBttn").disabled = false;

        while (uploadRequests.length > 0)
        {
            if (uploadRequests[0].readyState !== XMLHttpRequest.DONE)
            {
                uploadRequests[0].abort();
            }

            uploadRequests.shift();
        }
    }

    function doUpload(resolve, reject, file, index)
    {
        let form = new FormData();
        form.append("file", file);

        let request = new XMLHttpRequest();

        request.onreadystatechange = () => {
            if (request.readyState !== XMLHttpRequest.DONE)
            {
                if (abort)
                {
                    request.abort();
                    reject();
                }
                return;
            }

            let img = request.responseText.match(/<input value="<img src=&quot;(.*?)&quot; \/>"/);

            let imageBox = document.getElementById("foxlinksUploadImageBox");

            if (imageBox)
            {
                let values = imageBox.value.split("\n");

                if (img && request.responseText.indexOf("Errors were encountered processing one or more of your uploads") === -1)
                {
                    values[index] = `<img src="${img[1]}" />`;
                }
                else
                {
                    values[index] = `[FILE UPLOAD "${file.name}" FAILED!]`;
                }

                imageBox.value = values.join("\n");
            }

            let uploadRequestsIndex = uploadRequests.indexOf(request);
            if (uploadRequestsIndex >= 0)
            {
                uploadRequests.splice(uploadRequestsIndex, 1);
            }

            resolve();
        };

        request.open("POST", "http://u.endoftheinter.net/u.php", true);
        request.send(form);
        uploadRequests.push(request);
    }
};

let imageBttn = document.querySelector('input[value="Upload Image"]');
if (imageBttn)
{
    let batchBttn = document.createElement("button");
    batchBttn.id = "foxlinksUploadBttn";
    batchBttn.textContent = "Batch Uploader";
    batchBttn.addEventListener("click", BatchUpLLoder.uploadFiles, false);
    imageBttn.parentNode.insertBefore(batchBttn, imageBttn.nextSibling);
    imageBttn.parentNode.insertBefore(document.createTextNode(" "), imageBttn.nextSibling);
}
