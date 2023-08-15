var World = {
    loaded: false,
    dinoSettings: {
        kayn: {
            scale: 0.4
        },
        katarina: {
            scale: 0.004
        },
        jinx: {
            scale: 0.4
        },
        milio: {
            scale: 0.4
        }
    },

    init: function initFn() {
        this.createOverlays();
    },

    createOverlays: function createOverlaysFn() {
        /*
            First a AR.TargetCollectionResource is created with the path to the Wikitude Target Collection(.wtc) file.
            This .wtc file can be created from images using the Wikitude Studio. More information on how to create them
            can be found in the documentation in the TargetManagement section.
            Each target in the target collection is identified by its target name. By using this
            target name, it is possible to create an AR.ImageTrackable for every target in the target collection.
         */
        this.targetCollectionResource = new AR.TargetCollectionResource("assets/dinosaurs.wtc", {
            onError: World.onError
        });

        /*
            This resource is then used as parameter to create an AR.ImageTracker. Optional parameters are passed as
            object in the last argument. In this case a callback function for the onTargetsLoaded trigger is set. Once
            the tracker loaded all of its target images this callback function is invoked. We also set the callback
            function for the onError trigger which provides a sting containing a description of the error.
         */
        this.tracker = new AR.ImageTracker(this.targetCollectionResource, {
            onTargetsLoaded: World.showInfoBar,
            onError: World.onError
        });

        /*
            Pre-load models such that they are available in cache to avoid any slowdown upon first recognition.
         */
        new AR.Model("assets/models/annie.wt3");
        new AR.Model("assets/models/jinx.wt3");
        new AR.Model("assets/models/kayn.wt3");
        new AR.Model("assets/models/poppy.wt3");


        // Create an AR.HtmlDrawable for the champion info
        var championInfoOverlay = new AR.HtmlDrawable({
            uri: "assets/overlay.html"
        }, 2.0, {
            horizontalAnchor: AR.CONST.HORIZONTAL_ANCHOR.CENTER,
            verticalAnchor: AR.CONST.VERTICAL_ANCHOR.TOP,
            translate: {
                x: 0.0,
                y: 0.5
            },
            clickThroughEnabled: true,
            onDocumentLocationChanged: function(uri) {
                AR.context.openInBrowser(uri);
            },
            onError: World.onError
        });

        /*
            Note that this time we use "*" as target name. That means that the AR.ImageTrackable will respond to
            any target that is defined in the target collection. You can use wildcards to specify more complex name
            matchings. E.g. 'target_?' to reference 'target_1' through 'target_9' or 'target*' for any targets
            names that start with 'target'.
         */

        this.pageOne = new AR.ImageTrackable(this.tracker, "jinx", {
            drawables: {
                cam: [championInfoOverlay]
            }
        })
        this.dinoTrackable = new AR.ImageTrackable(this.tracker, "*", {
            onImageRecognized: function(target) {
                // Get the recognized target's name
                var recognizedTargetName = target.name;
            
                // Define a mapping between recognized target names and corresponding champion info
                var targetToChampionMap = {
                    kayn: {
                        name: "Kayn",
                        role: "Jungler",
                        class: "Assassin",
                        region: "Shadow Isles"
                    },
                    katarina: {
                        name: "Katarina",
                        role: "Midlaner",
                        class: "Assassin",
                        region: "Noxus"
                    },
                    jinx: {
                        name: "Jinx",
                        role: "Botlaner",
                        class: "Marksman",
                        region: "Piltover & Zaun"
                    },
                    milio: {
                        name: "Milio",
                        role: "Toplaner",
                        class: "Tank",
                        region: "Freljord"
                    }
                };
            
                console.log("Recognized Target Name:", recognizedTargetName);
                console.log("Available Target Keys:", Object.keys(targetToChampionMap));
            
                // Get the information for the recognized target
                var info = targetToChampionMap[recognizedTargetName];

                if (info) {
                    // Update the champion info HTML content
                    var championInfoHtml = `
                        <div class="champion-info" id="championInfo">
                            <div class="champion-name">${info.name}</div>
                            <div class="champion-role">Role: ${info.role}</div>
                            <div class="champion-class">Class: ${info.class}</div>
                            <div class="champion-region">Region: ${info.region}</div>
                        </div>
                    `;

                    // Update the HTML content of the champion info overlay
                    championInfoOverlay.html = championInfoHtml;

                    console.log(championInfoHtml)

                    // Assign the updated champion info HTML drawable to the recognized target's drawables
                    target.drawables = { cam: [championInfoOverlay] };

                    console.log(target.drawables);
                    
                    // Show the champion info overlay
                    World.showInfoBar();
                } else {
                    console.error(`Champion info not found for target: ${recognizedTargetName}`);
                    console.log(target); // Log the target object for debugging
                }
            },
            onError: World.onError
        });
    },

    onError: function onErrorFn(error) {
        alert(error);
    },

    hideInfoBar: function hideInfoBarFn() {
        document.getElementById("infoBox").style.display = "none";
    },

    showInfoBar: function worldLoadedFn() {
        document.getElementById("infoBox").style.display = "table";
        document.getElementById("loadingMessage").style.display = "none";
    }
};

World.init();