/*
 *  solriaUpload 1.0 - jQuery plugin
 *  written by Frederico Regateiro
 *  http://regateiro.azurewebsites.net/
 *
 *  Copyright (c) 2015 Pedro Molina (http://regateiro.azurewebsites.net/)
 *  Dual licensed under the MIT (MIT-LICENSE.txt)
 *  and GPL (GPL-LICENSE.txt) licenses.
 *
 *  Built for jQuery library
 *  http://jquery.com
 *
 */
(function ($) {
    $.fn.solriaUpload = function (options) {
        // default configuration properties
        var defaults = {
            dragMode: false,
            dragText: 'Drag and Drop your files here',
            btnText: 'Browse files...',
            allowedExtensions: '',
            invalidExtError: 'Invalid File Type',
            maxSize: 0,
            sizeError: 'Size of the file is greather than allowed',
            showPreview: true,
            showFilename: true,
            showPercent: true,
            showErrorAlerts: true,
            errorOnResponse: 'There has been an error uploading your file',
            onSubmit: false,
            url: '',
            data: null,
            limit: 0,
            limitError: 'You have reached the limit of files that you can upload',
            delfiletext: 'Remove from queue',
            dragContainerCss: 'well well-lg',
            uploadButtonCss: 'btn btn-primary btn-upload',
            uploadButtonIconCss: 'glyphicon glyphicon-upload',
            previewIconFileCss: 'glyphicon glyphicon-file',
            onFileError: function (file, error) { },
            onFileSuccess: function (file, data) { }
        };
        options = $.extend(defaults, options);
        var solriaUpload = {
            obj: $(this),
            files: [],
            uparea: null,
            container: null,
            uploadedfiles: 0,
            hasErrors: false,
            init: function () {
                this.replacehtml();
                this.uparea.on('click', function () {
                    solriaUpload.selectfiles();
                });
                ///Handle events when drag
                if (options.dragMode) {
                    this.handledragevents();
                }
                this.handlebuttonevents();
                //Dismiss all warnings
                $(document).on('click', '.su-wrn-cl', function () {
                    $(this).parent('div').remove();
                });
                //Bind event if is on Submit
                if (options.onSubmit) {
                    this.handleFormSubmission();
                }
            },
            replacehtml: function () {
                var html = null;
                switch (options.dragMode) {
                    case true:
                        html = '<div class="' + options.dragContainerCss + ' su-uparea su-dragarea" style="cursor:pointer"><h4>' + options.dragText + "</h4></div>";
                        break;
                    case false:
                        html = '<a href="javascript:void(0)" class="su-uparea"> <i class="' + options.uploadButtonCss + ' ' + options.uploadButtonIconCss + '"></i> ' + options.btnText + "</a>";
                        break;
                }
                this.obj.hide();
                this.uparea = $(html).insertAfter(this.obj);
                this.container = $('<div class="su-container"><ul></ul></div>').insertAfter(this.uparea);
            },
            selectfiles: function () {
                this.obj.click();
            },
            handlebuttonevents: function () {
                $(this.obj).on('change', this.obj.selector, function () {
                    solriaUpload.checkFile(solriaUpload.obj[0].files[0]);
                });
                $(document).on('click', '.su-del', function () {
                    var parent = $(this).parent('div').parent('div');
                    solriaUpload.delAndRearrange(parent);
                });
            },
            handledragevents: function () {
                $(document).on('dragenter', function (e) {
                    this.stopDefaultEvent(e);
                });
                $(document).on('dragover', function (e) {
                    this.stopDefaultEvent(e);
                });
                $(document).on('drop', function (e) {
                    this.stopDefaultEvent(e);
                });
                this.uparea.on('dragenter', function (e) {
                    this.stopDefaultEvent(e);
                    $(this).css('border', '2px solid #0B85A1');
                });
                this.uparea.on('dragover', function (e) {
                    this.stopDefaultEvent(e);
                });
                this.uparea.on('drop', function (e) {
                    $(this).css('border', '2px dotted #0B85A1');
                    e.preventDefault();
                    var files = e.originalEvent.dataTransfer.files;
                    for (var i = 0; i < files.length; i++) {
                        solriaUpload.checkFile(files[i]);
                    }
                });
            },
            stopDefaultEvent: function (e) {
                e.stopPropagation();
                e.preventDefault();
            },
            checkFile: function (file) {
                error = this.validateFile(file);
                if (error) {
                    if (options.showErrorAlerts) {
                        this.addWarning(error);
                    }
                    this.hasErrors = true;
                    options.onFileError(file, error);
                } else {
                    this.files.push(file);
                    if (this.files.length > options.limit && options.limit > 0) {
                        this.files.splice(this.files.length - 1, 1);
                        if (options.showErrorAlerts) {
                            this.addWarning(options.limitError, this.obj);
                        }
                        this.hasErrors = true;
                        options.onFileError(file, error);
                    } else {
                        this.addRow(file);
                        if (options.onSubmit === false) {
                            this.upload(file, this.files.length - 1);
                        }
                    }
                }
            },
            addWarning: function (error, c) {
                var html = '<div class="alert alert-danger"><button type="button" class="close su-wrn-cl" data-dismiss="alert">&times;</button> ' + error + "</div>";

                if (!c) {
                    this.container.append(html);
                } else {
                    $(html).insertBefore(c);
                }
            },
            validateFile: function (file) {
                if (!this.checkExtension(file)) {
                    return options.invalidExtError;
                }
                if (!this.checkSize(file)) {
                    return options.sizeError;
                }
                return null;
            },
            checkExtension: function (file) {
                if (options.allowedExtensions === '') {
                    return true;
                }
                var ext = file.name.split('.').pop().toLowerCase();
                var allowed = options.allowedExtensions.split('|');
                if ($.inArray(ext, allowed) === -1) {
                    return false;
                } else {
                    return true;
                }
            },
            checkSize: function (file) {
                if (options.maxSize === 0 || file.size <= options.maxSize) {
                    return true;
                } else {
                    return false;
                }
            },
            addRow: function (file) {
                var i = this.files.length - 1,
                    newRow = null,
                    prev = null,
                    finfo = null,
                    progress = null,
                    dismiss = null;

                newRow = $('<div class="row sr-rw" rel="' + i + '"></div>').appendTo(this.container);
                if (options.showPreview) {
                    prev = $('<div class="col-lg-2 col-md-2 col-xs-4"></div>').appendTo(newRow);
                    this.previewFile(prev, file);
                }
                finfo = $('<div class="col-lg-8 col-md-8 col-xs-8"></div>').appendTo(newRow);
                if (options.showFilename) {
                    finfo.append('<div class="filename">' + file.name + "</div>");
                }
                if (options.notAjax === false) {
                    progress = $('<div class="progress"><div class="su-uppbr progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em;"></div></div>').appendTo(finfo);
                    if (options.showPercent) {
                        progress.find('div.progress-bar').text('0%');
                    }
                }
                dismiss = $('<div class="col-lg-2 col-md-2 col-xs-2"></div>').appendTo(newRow);
                $('<a href="javascript:void(0);" class="btn btn-danger su-del">' + options.delfiletext + '</a>').appendTo(dismiss);
            },
            previewFile: function (container, file) {
                var type = file.type.split('/')[0],
                    prev = null;
                switch (type) {
                    case 'image':
                        prev = $('<img class="thumbnail" src="' + window.URL.createObjectURL(file) + '" height="64" />').appendTo(container);
                        break;

                    case 'video':
                        prev = $('<video src="' + window.URL.createObjectURL(file) + '" width="100%" controls></video>').appendTo(container);
                        break;

                    case 'audio':
                        prev = $('<audio src="' + window.URL.createObjectURL(file) + '" width="100%" controls></audio>').appendTo(container);
                        break;

                    default:
                        prev = $('<i class="' + options.previewIconFileCss + '"></i>').appendTo(container);
                        break;
                }
            },
            upload: function (file, pos) {
                var formData = new FormData();
                formData.append(this.obj.attr('name'), file);
                for (var key in options.data) {
                    formData.append(key, options.data[key]);
                }
                $.ajax({
                    url: options.url,
                    type: 'POST',
                    data: formData,
                    dataType: 'json',
                    success: function (data) {
                        if (data === 1 || data.success === 1) {
                            solriaUpload.files[pos] = null;
                            $('div.row[rel="' + pos + '"]').find('.su-uppbr').css('width', '100%');
                            options.onFileSuccess(file, data);
                        } else {
                            solriaUpload.files.splice(pos, 1);
                            var err = null;
                            if (error in data) {
                                err = null;
                            } else {
                                err = options.errorOnResponse;
                            }
                            if (options.showErrorAlerts) {
                                solriaUpload.addWarning(err, $('div.row[rel="' + pos + '"]'));
                            }
                            $('div.row[rel="' + pos + '"]').remove();
                            solriaUpload.hasErrors = true;
                            options.onFileError(file, err);
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        solriaUpload.files.splice(pos, 1);
                        if (options.showErrorAlerts) {
                            solriaUpload.addWarning(thrownError, $('div.sr-rw[rel="' + pos + '"]'));
                        }
                        solriaUpload.hasErrors = true;
                        options.onFileError(file, thrownError);
                        $('div.sr-rw[rel="' + pos + '"]').remove();
                    },
                    xhr: function () {
                        myXhr = $.ajaxSettings.xhr();
                        if (myXhr.upload) {
                            myXhr.upload.addEventListener('progress', function (e) {
                                solriaUpload.handleProgress(e, pos);
                            }, false);
                        }
                        return myXhr;
                    },
                    complete: function () {
                        if (options.onSubmit) {
                            solriaUpload.uploadedfiles++;
                            if (solriaUpload.uploadedfiles === solriaUpload.files.length && solriaUpload.hasErrors === false) {
                                solriaUpload.obj.remove();
                                solriaUpload.obj.parent('form').submit();
                            }
                        }
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                });
            },
            handleProgress: function (e, pos) {
                if (e.lengthComputable) {
                    var total = e.total;
                    var loaded = e.loaded;
                    var percent = Number((e.loaded * 100 / e.total).toFixed(2));
                    var progressbar = $('div.sr-rw[rel="' + pos + '"]').find('.su-uppbr');
                    progressbar.css('width', percent + '%');
                    if (options.showPercent) {
                        progressbar.text(percent + '%');
                    }
                }
            },
            handleFormSubmission: function () {
                var form = this.obj.parent('form');
                form.submit(function () {
                    solriaUpload.hasErrors = false;
                    solriaUpload.uploadedfiles = 0;
                    for (var i = 0; i < solriaUpload.files.length; i++) {
                        if (solriaUpload.files[i]) {
                            solriaUpload.upload(solriaUpload.files[i], i);
                        } else {
                            solriaUpload.uploadedfiles++;
                            if (solriaUpload.uploadedfiles === solriaUpload.files.length && solriaUpload.hasErrors === false) {
                                solriaUpload.obj.remove();
                                return true;
                            }
                        }
                    }
                    return false;
                });
            },
            delAndRearrange: function (parent) {
                var id = parent.attr('rel');
                solriaUpload.files.splice(parseInt(id), 1);
                parent.remove();
                solriaUpload.container.find('div.sr-rw').each(function (index) {
                    $(this).attr('rel', index);
                });
            }
        };
        solriaUpload.init();
    };
})(jQuery);
