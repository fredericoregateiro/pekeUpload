###### What is solriaUpload?
is a jQuery plugin, based on pekeUpload, that allows you to easily add multiple or single file upload functionality to your website.
This plugin uses html5 only.

Dependencies:

1. jQuery 1.4.x or greater
2. Twitter Bootstrap v3.0.x or greater

Some Features include:

1.  Lightweight
2.  Set File size limit
3.  Set File extensions restrictions
4.  Custom error messages and custom css classes
5.  Real-Time Progress Indicators
6.  Drag & Drop File Upload support
7.  Preview your media file (images,audios and videos)
6.  And others more...

###### Why 

The original pekeUpload was great, but i needed some changes and the support was slow. So i forked a new project to do my custom work on it.

###### Use
1.  Download solriaUpload zip.
2.  Unzip solriaUpload zip.
3.  Then add a reference to the jQuery library.
    ```
    <script type="text/javascript" src="js/jquery-2.1.4.min.js"></script>
    ```
    
4.  Below the reference to jQuery, add a reference to the pekeUpload script.
    ```
    <script type="text/javascript" src="js/solriaUpload.min.js"></script>
    ```
    
5.  On the page, add a file input.
    ```
    <input id="file" type="file" name="file" />
    ```
    
6.  Initialize solriaUpload on the file input.
    ```
    $("#file").solriaUpload();
    ```
 
###### Plugin Options

| Option | Default | Format | Description|
| ------ | ------- | ------- | ---------- |
| dragMode| false  | true/false | Set the mode of uploading the files, if you prefer the user drags & drops, or to click on a button and browse for the file |
| dragText| "Drag and Drop your files here" | string | Set the text for the drag & drop area |
| btnText| "Browse files..." | string | Set the text of the upload button |
| allowedExtensions | "" | "ext1" | Sets the file extensions allowed to upload |
| invalidExtError | "Invalid File Type" | string | Sets the error message when the file has an unsupported extension |
| maxSize | 0 | float | Set the file size limit in MB, 0 means no limit |
| sizeError | "Size of the file is greather than allowed" | string | Sets the error message when the file is bigger than size allowed |
| showPreview| true | true/false | Sets if you want to show a preview (if the file is an audio,image or video) on the uploader queue |
| showFilename | true | true/false | Sets if you want to show the file name on the uploader queue |
| showPercent | true | true/false | Sets if you want to show the percent on the uploader queue |
| showErrorAlerts | true | true/false | Sets if you want to show error alerts on the uploader queue |
| errorOnResponse | "There has been an error uploading your file" | string | Sets the message when the file is uploaded and the response script returns that there is an error but a error message on the response was not found |
| onSubmit| false | true/false | Gives you the option of upload the files when the files are selected or when you submit the form. |
| url| "upload.php" | string | Set the url of upload script |
| data | null | {var1:"value"} | Set POST additional data associated to the file |
| limit | 0 | integer | Sets the limits of files that an user can uploads, 0 is unlimited |
| limitError | "You have reached the limit of files that you can upload" | string | Sets the error message when a user tried to upload more files than the limit |
| delfiletext | "Remove from queue" | string | Sets the default message of the button which allows to delete a file from a queue of uploads |
| dragContainerCss | "well well-lg" | string | Sets the css for the drag container div |
| uploadButtonCss | "btn btn-primary btn-upload" | string | Sets the css for the drag container div |
| uploadButtonIconCss | "glyphicon glyphicon-upload" | string | Sets the css for the upload button |
| previewIconFileCss | "glyphicon glyphicon-file" | string | Sets the css for the preview icon file |
|  onFileError | function(file,error){} | function(file,error){} | Event triggered when some error ocurs, returns error (string), file (object). file returns file.name and file.size |
|  onFileSuccess | function(file,data){} | function(file,data){} | Event triggered when the file has been uploaded succesfully, returns data (string), file (object). file returns file.name and file.size |

###### Sever side script considerations

The file is received by the server side script with the name of the input, for example: if you set that the name of the input is image, then you must expect on the server-side script an input called image.

The server side script must return '1' or '{success:1}', if you wish to attach more data to the response just print a json string, if you want to set your custom error message, return the error property on the json string. See upload.php

	


