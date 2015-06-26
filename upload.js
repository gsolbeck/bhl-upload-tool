/*
 * BHL Upload Tool
 * (c) 2015 Tiltfactor
 */

// Edit globalUrl and globalToken before using this tool.
var globalUrl = null;
var globalToken = null;

var statusDiv = document.getElementById("status");

//Store session data globally
function readFile(form) {
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
    } else {
      alert('The File APIs are not fully supported in this browser.');
    }
    var inFiles = form.fileselect.files;
    for (var i = 0; i < inFiles.length; i++) {
        var reader = new FileReader();
        reader.onload = function(file) {
            try {
                var json = JSON.parse(file.target.result);
            } catch (e) {
                console.error("Invalid JSON format in input file:");
                console.error(e);
                return;
            }
            for (var i = 0; i < json.inputs.length; i += 50) {
                postJSON({items: json.inputs.slice(i, i+50)});
            }
        }
        reader.readAsText(inFiles[i]);
    }
}

function postJSON(data) {
    var xhr = new XMLHttpRequest();
    if (!xhr) {
        console.error("Error: XML Http Request format not available");
        return;
    }
    var postString = JSON.stringify(data);
    xhr.open("POST", globalUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('x-access-token', globalToken);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            displayResponse(xhr);
        }
    }
    xhr.send(postString);
    statusDiv.style.display = "inline";
}

var numPages = 0;
function displayResponse(req) {
    var books = JSON.parse(req.responseText);
    var numBooks = books.length || 0;
    for (var i = 0; i < numBooks; i++) {
        numPages += books[i].pages.length;
    }
    statusDiv.textContent = "Upload successful! Saved " + numPages + " pages.";
    console.log(req.responseXML);
}
