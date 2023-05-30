// Copyright (C) 2022 Scott Henshaw

export default class App {

    #dialogState;

    constructor() {
        // this is where we build an instance of this app
        this.#dialogState = false;

        // handle a simple button press
        document.querySelector("#press-me")
            .addEventListener("click", event =>
                this.openDialog("Opened the dialog")
            );

        document.querySelector("#close-me")
            .addEventListener("click", event => {
                // when the user presses the button...
                this.closeDialog("Closed the dialog")
            })
    }


    openDialog( msg = "opened") {

        if (this.#dialogState)
            return;

        this.#dialogState = !this.#dialogState;
        document.querySelector("#result-dlg").show();
        console.log( msg )
    }


    closeDialog( msg = "closed") {

        if (!this.#dialogState)
            return;

        this.#dialogState = !this.#dialogState;
        document.querySelector("#result-dlg").close()
        console.log( msg )
    }  



}