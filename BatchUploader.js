var BatchUpLLoder = new function()
{
    var abort = true;
    var imageBox = null;
    var uploadRequests = [];

    this.uploadFiles = function(e)
    {
        e.preventDefault();
        getFiles(e.target);
        e.target.blur();
    };

    processUpload = function(target, files)
    {
        if (!files.length)
        {
            return;
        }

        abort = false;
        var abortBttn = document.createElement("button");
        abortBttn.id = "foxlinksAbortBttn";
        abortBttn.textContent = "Abort Upload";
        abortBttn.addEventListener("click", abortUpload, false);
        var form = target.parentNode;
        form.appendChild(document.createTextNode(" "));
        form.appendChild(abortBttn);
        var imageBox = document.getElementById("foxlinksUploadImageBox");

        if (!imageBox)
        {
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
            imageBox.addEventListener("click", function(e) { e.target.select(); }, false);
            document.body.appendChild(imageBox);
            var closeBox = document.createElement("a");
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

        filesArray = Array.from(files);

        imageBox.value = filesArray.map(() => "UPLOADING...\n").join("")

        var uploadPromises = filesArray.map((f, i) => new Promise((resolve, reject) => {
            doUpload(resolve, reject, f, i);
        }));

        Promise.all(uploadPromises).then(abortUpload);
    }

    function getFiles(target)
    {
        filepicker = document.createElement("input");
        filepicker.type = "file"
        filepicker.multiple = true;
        filepicker.accept = "image/*";
        filepicker.onchange = () => { processUpload(target, filepicker.files); };
        filepicker.click();
    }

    function abortUpload()
    {
        abort = true;
        offset = 0;

        var abortBttn = document.getElementById("foxlinksAbortBttn");

        if (abortBttn)
        {
            abortBttn.parentNode.removeChild(abortBttn);
        }

        document.getElementById("foxlinksUploadBttn").disabled = false;

        while (uploadRequests.length > 0)
        {
            if (uploadRequests[0].readyState != XMLHttpRequest.DONE)
            {
                uploadRequests[0].abort();
            }

            uploadRequests.shift();
        }
    }

    function doUpload(resolve, reject, file, index)
    {
        var form = new FormData();
        form.append("file", file);

        var request = new XMLHttpRequest();

        request.onreadystatechange = () => {
            if (request.readyState != XMLHttpRequest.DONE)
            {
                if (abort)
                {
                    request.abort();
                    reject();
                }
                return;
            }

            var img = request.responseText.match(/<input value="<img src=&quot;(.*?)&quot; \/>"/);

            var imageBox = document.getElementById("foxlinksUploadImageBox");

            if (imageBox)
            {
                var values = imageBox.value.split("\n");

                if (img && request.responseText.indexOf("Errors were encountered processing one or more of your uploads") == -1)
                {
                    values[index] = `<img src="${img[1]}" />`;
                }
                else
                {
                    values[index] = `[FILE UPLOAD "${file.name}" FAILED!]`;
                }

                imageBox.value = values.join("\n");
            }

            var uploadRequestsIndex = uploadRequests.indexOf(request);
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

var imageBttn = document.querySelector('input[value="Upload Image"]');
if (imageBttn)
{
    var batchBttn = document.createElement("button");
    batchBttn.id = "foxlinksUploadBttn";
    batchBttn.textContent = "Batch Uploader";
    batchBttn.addEventListener("click", BatchUpLLoder.uploadFiles, false);
    imageBttn.parentNode.insertBefore(batchBttn, imageBttn.nextSibling);
    imageBttn.parentNode.insertBefore(document.createTextNode(" "), imageBttn.nextSibling);
}
