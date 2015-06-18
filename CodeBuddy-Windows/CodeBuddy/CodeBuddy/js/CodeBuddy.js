(function () {
    WinJS.Namespace.define( "CodeBuddy", {
        Buddy : WinJS.Class.define( 
            function (defaultText,errorList) {
                this.rawCode = "";
                this.passedCode = CodeBuddy.Buddy.leader;
                this.inErrorState = false;
                this.codePos = 0;
                this.errors = errorList ? errorList : [];
                this.delayErrorTimeout = null;
                this.storageObject = localStorage;
                this.loadState();

                if (defaultText) {
                    this.update(defaultText);
                }
            }, {

                update : function (text) {
                    this.rawCode = this.formatText(text);
                    this.passedCode = CodeBuddy.Buddy.leader;
                    this.codePos = 0;
                    this.inErrorState = false;
                },

                formatText : function (text) {
                    return this.replaceTabs(text);
                },

                replaceTabs : function (text) {
                    return text.replace(/\t/g, "  ");
                },

                processChar : function (c) {
                    // Add the correct char to the end of the passedCode string with the static leader
                    this.passedCode = this.passedCode.substr(0, this.passedCode.length - 1) + c + CodeBuddy.Buddy.leader;
                },

                generateError : function (type, val) {
                    return {
                        type: type,
                        val: val,
                        occ: 1
                    };
                },

                markError : function (type) {
                    var val = "",
                        result = null;

                    switch (type) {
                        case "delay":
                        case "key":
                            val = this.rawCode[this.codePos];
                            break;

                        case "transition":
                            val = this.rawCode[this.codePos] + this.rawCode[this.codePos + 1];
                            break;

                        case "block":
                            val = this.rawCode.substr(this.codePos - 1, 5);
                            break;


                    };

                    if (val) {
                        var existError = null, i = 0;
                        for (i = 0; i < this.errors.length; i++) {
                            var ele = this.errors.getAt(i);
                            if (ele.type === type && ele.val === val) {
                                existError = ele;
                                break;
                            }
                        }

                        if( existError ) {
                            existError.occ++;
                            this.errors.setAt(i, existError);
                        } else {
                            this.errors.push(this.generateError(type,val));
                        }
                    }

                    return result;
                },

                handleErrors : function (keyPressCorrect) {
                    if (keyPressCorrect) {
                        // Delay error
                        clearTimeout(this.delayErrorTimeout);

                        // Set a delay error timeout if we are not at the end of the input
                        if (!this.isComplete()) {
                            this.delayErrorTimeout =
                              setTimeout(this.markError.bind(this, "delay"), 1000);
                        }
                    } else {

                        // Record the error stroke and that an error transition occured
                        if (!/undefined|\s/.test(this.rawCode[this.codePos])) {
                            this.markError("key");
                        }

                        if (this.codePos &&
                            !/undefined|\s/.test(this.rawCode[this.codePos] + this.rawCode[this.codePos + 1])) {
                            var transition = this.markError("transition");
                        }

                        this.saveState();
                    }
                },

                processKeypress : function (keyCode) {
                    var result = false;

                    if (keyCode == this.rawCode.charCodeAt(this.codePos)) {
                        this.processChar(this.rawCode[this.codePos++]);
                        result = true;
                    }

                    this.handleErrors(result);

                    return result;
                },

                saveState : function () {
                    if (this.storageObject) {
                        var save = [];
                        this.errors.forEach( function( ele ){ save.push( ele ); } );
                        this.storageObject.setItem("CodeBuddy.errorMap", JSON.stringify( save ));
                    }
                },

                loadState : function () {
                    if (this.storageObject) {
                        var savedErrors = this.storageObject.getItem("CodeBuddy.errorMap");
                        if (savedErrors) {
                            savedErrors = JSON.parse(savedErrors);
                            savedErrors.forEach(function (ele) { this.errors.push(ele) }.bind(this));
                        }
                    }
                },

                keyCodeTransform : function (keyCode) {
                    switch (keyCode) {
                        case 13:
                            keyCode = 10;
                            break;
                    }

                    return keyCode;
                },

                // Return if we are done with the available content
                isComplete : function () {
                    return !this.inErrorState && this.codePos >= this.rawCode.length;
                },

                postProcessEval : function (keyCode) {
                    switch (keyCode) {
                        case 10:
                        case 13:
                            while (this.codePos < this.rawCode.length && this.rawCode[this.codePos] == ' ') {
                                this.processChar(this.rawCode[this.codePos++]);
                            }
                            break;
                    }
                },

                evalKeypress : function (keyCode) {
                    if (!this.isComplete()) {
                        // Apply any keycode transformation needed 
                        keyCode = this.keyCodeTransform(keyCode);

                        // process the keypress and set the error state
                        this.inErrorState = !this.processKeypress(keyCode);

                        // Perform special post-processing
                        this.postProcessEval(keyCode);

                    }

                    return !this.inErrorState && !this.isComplete();
                },

                clear : function () {
                    this.passedCode = CodeBuddy.Buddy.leader;
                    this.codePos = 0;
                },

                clearErrors : function () {
                    this.errors = this.errors.splice(0, this.errors.length);
                    this.saveState();
                },

                removeError : function (error) {
                    delete this.errors[error.val];
                    this.saveState();
                }
            }, {
                leader : "_"
            }
        )
    });
})();
