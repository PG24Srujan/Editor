// Copyright (C) 2022 Scott Henshaw

export default class App {

    #dialogState;

    constructor() {
        this.dialogState = false;

        this.$editWindow = $("#edit-window");

        // initialize the app itself
        this.initApp();

        // Go get all the prefabs
        this.fetchPrefabs();

        // Go get the list of levels
        this.fetchLevelList();

        // Handle user selections, new level or load level?
        this.initMenuHandlers();
        // Init level editing handlers (draggables, dialogs, save)

        this.initMenuButtons();
        // The button actions in the menu

        this.initDragHandler();
    }


    initApp() {
        this.debugDraggableStaticBox();
    }

    debugDraggableStaticBox() {

        $("#moving-box")
            .on('dragstart', event => {
                // grap data about the thing you are dragging
                event.stopPropagation();
                let copy = true;
                if ($(event.target).hasClass("placed")) {
                    // Moving stuff here...
                    copy = false;
                }

                let myCustomData = { elId: "box-one" };
                event.originalEvent
                    .dataTransfer
                    .setData("text/plain", JSON.stringify(myCustomData));

                $(event.target).css("opacity", "0.4");
            })
            .on('drag', event => {
                event.stopPropagation();
                // Behaviour while dragging
            })
            .on('dragend', event => {
                // when we stop dragging it
                $(event.target).addClass("placed");
            });


        $("#edit-window")
            .on('dragenter', event => { })
            .on('dragover', event => {
                event.preventDefault();
            })
            .on('dragleave', event => { })
            .on('drop', event => {

                // fetch the data from the dropped thing
                let droppedData = event.originalEvent
                    .dataTransfer.getData("text/plain");

                let myData = JSON.parse(droppedData);

                let $basePrefab = $(`#${myData.elId}`);

                $("#status-window").html(myData.help);
            });
    }

    initMenuHandlers() {
        // TODO: Init the menu bar click handlers
    }

    fetchPrefabs() {
        // TODO: Go to the server and get the list of prefabs
    }

    fetchLevelList() {
        // TODO: Go to the server and get the list of levels
        // then load the selection list, wait for selection
        let params = {
            "userid": "test"
        }

        let userID = "srujan";

        $.post(`/api/get_level_list/${userID}`, params)
            .then(response => JSON.parse(response))
            .then(data => {
                this.updateLevelList(data);
            });


        // TODO:  hook up the level select handlers

        // After level selected, load the level
        this.fetchLevel();
    }

    initMenuButtons() {
        // TODO: Add properties to menu buttons

        const levelButton = $("#save-level");
        levelButton.click( e => {
            this.saveToFile();
        });

        $("info-form").submit(
            e=> {
                e.preventDefault();
            }
        );

    }

    initDragHandler() {
        const canvas = document.querySelector("#edit-window");
        canvas.addEventListener("dragstart", this.drag.bind(this));
        canvas.addEventListener("dragover", this.allowDrop.bind(this));
        canvas.addEventListener("drop", this.drop.bind(this));
    }

    updateLevelList(data) {
        // TODO: fill in the level list select options from the data
        if (data.error)
            return;

        const $list = $("#level-list");
        $list.html("")
        for (let level of data.payload) {

            let markup = `<option value="${level.filename}">${level.name}</option>`;
            $list.append(markup);
        }
    }


    drag(event) {
        event.dataTransfer.setData("text/plain", event.target.src);
        console.log("drag(event)");
    }

    allowDrop(event) {
        event.preventDefault();
        console.log("allowDrop(event)");
    }

    drop(event) {
        event.preventDefault();
        const imageUrl = event.dataTransfer.getData("text/plain");
        const img = new Image();
        img.src = imageUrl;
        img.classList.add("dragged-image");
        img.style.position = "absolute";
        img.style.left = `${event.clientX - 40}px`;
        img.style.top = `${event.clientY - 40}px`;
        event.currentTarget.appendChild(img);

        // Add click event listener to remove image
        img.addEventListener("click", function () {
            this.parentNode.removeChild(this);
        });
    }


saveToFile() {
    console.log("saving");

    const images = document.querySelectorAll(".dragged-image");
    const imagePositions = [];
    images.forEach(img => {
        const position = {
            type: img.src,
            x: img.offsetLeft + img.width / 2,
            y: img.offsetTop + img.height / 2
        };
        imagePositions.push(position);
    });

   

    const json = JSON.stringify(imagePositions);
    const parsedJson = JSON.parse(json);
   
    fetch('/api/save_level', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: json
    }).then(response => {
        if (response.ok) {
            console.log('Level saved successfully');
        } else {
            console.log('Failed to save level');
        }
    }).catch(error => {
        console.log('Error saving level', error);
    });
}



}