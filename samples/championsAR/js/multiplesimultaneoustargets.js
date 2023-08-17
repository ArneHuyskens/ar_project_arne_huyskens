var World = {
    loaded: false,

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
        this.targetCollectionResource = new AR.TargetCollectionResource("assets/champions.wtc", {
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
            Initiates a ImageDrawable to show the splash art of each champion, initiates with a default picture.
        */
        var splashArtImage = new AR.ImageDrawable(new AR.ImageResource("assets/default.png"), 1, {
            enabled: true,
            translate: { x: 0, y: -0.2 }
        });

        // Create an AR.HtmlDrawable to show champion info
        var championInfoOverlay = new AR.HtmlDrawable({
            uri: "assets/overlay.html"
        }, 2.0, {
            horizontalAnchor: AR.CONST.HORIZONTAL_ANCHOR.CENTER,
            verticalAnchor: AR.CONST.VERTICAL_ANCHOR.TOP,
            translate: {
                x: 0.0,
                y: -0.3
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
        this.championTrackable = new AR.ImageTrackable(this.tracker, "*", {
            /*
                Show the splashart and champion info upon scanning a champion icon.
            */
            drawables: {
              cam: [splashArtImage, championInfoOverlay]
            },
            onImageRecognized: function(target) {
                // Get the recognized target's name
                var recognizedTargetName = target.name;
                console.log("Recognized Target Name:", recognizedTargetName);
                
                // Get data from the champion API
                const apiURL = `https://ddragon.leagueoflegends.com/cdn/13.16.1/data/en_US/champion/${recognizedTargetName}.json`;
                console.log(apiURL);
                fetch(apiURL)
                    .then(response => response.json())
                    .then(data => {
                        const championInfo = data.data[recognizedTargetName];
                        console.log(championInfo);
                        if (championInfo) {
                            // Create champion info HTML content using fetched data
                            const championInfoHtml = `
                            <body style="font-family: 'Arial', sans-serif; margin: 0; padding: 0; color: white; overflow: hidden; text-align: center; display: flex; justify-content: center; align-items: center; height: 100vh;">
                                <div class="champion-info" id="championInfo" style="background-color: rgba(0, 0, 0, 0.9); border-radius: 10px; padding: 20px; max-width: 80%;">
                                    <div class="champion-name" style="font-size: 50px; font-weight: bold; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);">${championInfo.name}</div>
                                    <div class="champion-title" style="font-size: 32px; margin-bottom: 5px; color: #FFD700;">Title: ${championInfo.title}</div>
                                    <div class="champion-class" style="font-size: 28px; margin-bottom: 5px; color: #66CCFF;">Class: ${championInfo.tags[0]}</div>
                                    <div class="champion-passive" style="font-size: 28px; margin-bottom: 5px; color: #FF5733;">Passive: ${championInfo.passive.name}</div>
                                    <div class="champion-lore" style="font-size: 28px; margin-bottom: 5px;">${championInfo.lore}</div>
                                </div>
                            </body>
                            `;

                            // Update the HTML content of the champion info overlay
                            championInfoOverlay.html = championInfoHtml;
                            championInfoOverlay.onClick = function() {
                                AR.context.openInBrowser(`https://www.leagueoflegends.com/en-pl/champions/${recognizedTargetName}/`);
                            };
                            championInfoOverlay.zOrder = 1;

                            // Update the splash art to the art of the scanned champion
                            splashArtImage.imageResource = new AR.ImageResource("assets/splasharts/" + recognizedTargetName + ".png");
                            splashArtImage.zOrder = 0;

                            // Play a voice line of the scanned champion
                            championVoice = new AR.Sound("assets/videos/" + recognizedTargetName + ".wav", {});
                            championVoice.play();

                            // Assign the updated champion info HTML drawable to the recognized target's drawables
                            target.drawables = { cam: [splashArtImage, championInfoOverlay] };
                            
                            // Show the champion info overlay
                            World.showInfoBar();
                        }
                    })
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