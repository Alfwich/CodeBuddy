// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509

(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var buddy = new CodeBuddy.Buddy("Some fake code thats not really code!", new WinJS.Binding.List([]));

    var viewModel = {
        code: buddy.rawCode,
        overlay: buddy.passedCode,
        errorList: buddy.errors
    };

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }
            args.setPromise(WinJS.UI.processAll()
                .then(function () {
                    var listControl = document.getElementById("error-list").winControl;
                    listControl.itemDataSource = viewModel.errorList.dataSource;
                })
            );
        }

        WinJS.Binding.processAll( document.getElementById("content-main"), viewModel);
        var bindingSource = WinJS.Binding.as(viewModel);

        bindingSource.setProperty("reset", WinJS.Utilities.markSupportedForProcessing(
                function (e) {
                    buddy.clear();
                    bindingSource.setProperty("overlay", buddy.passedCode);
                })
        );

        bindingSource.setProperty("generate", WinJS.Utilities.markSupportedForProcessing(
                function (e) {
                    var generatedText = CodeBuddy.Generator.Code(buddy.errors);
                    buddy.update( generatedText );

                    bindingSource.setProperty("code", buddy.rawCode);
                    bindingSource.setProperty("overlay", buddy.passedCode);
                })
        );

        bindingSource.setProperty("open", WinJS.Utilities.markSupportedForProcessing(
                function (e) {
                    var openPicker = new Windows.Storage.Pickers.FileOpenPicker();
                    openPicker.viewMode = Windows.Storage.Pickers.PickerViewMode.thumbnail;
                    openPicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.documentsLibrary;
                    openPicker.fileTypeFilter.replaceAll([".txt", ".js", ".html"]);

                    openPicker.pickSingleFileAsync().then(function (file) {
                        if (file) {
                            Windows.Storage.FileIO.readLinesAsync(file)
                                .then(function (lines) {
                                    buddy.update(lines.join("\n"));
                                    bindingSource.setProperty("code", buddy.rawCode);
                                    bindingSource.setProperty("overlay", buddy.passedCode);
                                })
                        }
                    });
                })
        );

        // I need to capture 'enter' keypresses with the onkeyup function for some reason. 
        document.onkeyup = function (e) {
            if ( ( e.keyCode == 10 || e.keyCode == 13 ) && buddy.evalKeypress(e.keyCode) ) {
                e.preventDefault();
            }

            bindingSource.setProperty("overlay", buddy.passedCode);
        }

        document.onkeypress = function (e) {
            if (buddy.evalKeypress(e.keyCode)) {
                e.preventDefault();
            }

            bindingSource.setProperty("overlay", buddy.passedCode);
        }

    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    app.start();
})();
