const USER_ID = "1243657660704755775";

const REST_URL =
    `https://api.lanyard.rest/v1/users/${USER_ID}`;

const WS_URL =
    "wss://api.lanyard.rest/socket";


/* =========================
   CONNECTIONS
========================= */

const CONNECTIONS = {
    github: "https://github.com/afrige",

    youtube:
        "https://www.youtube.com/@Aevnloll",

    twitch:
        "https://www.twitch.tv/nick_thenewb",

    steam:
        "https://steamcommunity.com/profiles/76561198749923280/",

    roblox: "",

    spotify:
        "https://open.spotify.com/user/31og5rmygokugx5lnm4dphp6qlty?si=c39d67ef0ece433b",

    instagram:
        "https://www.instagram.com/nick_lamao/?hl=en",

    twitter:
        "https://x.com/itsghoulzlol",

    tiktok:
        "https://www.tiktok.com/@sleepynicklol",

    website: ""
};


/* =========================
   HELPERS
========================= */

const $ = id =>
    document.getElementById(id);


/* =========================
   ELEMENTS
========================= */

const avatar =
    $("avatar");

const username =
    $("username");

const globalName =
    $("global-name");

const statusText =
    $("status-text");

const statusBubble =
    $("status-bubble");

const infoCreated =
    $("info-created");

const infoActivity =
    $("info-activity");

const infoStatus =
    $("info-status");

const infoDevice =
    $("info-device");

const infoPlatform =
    $("info-platform");

const infoSpotify =
    $("info-spotify");

const spotifyArt =
    $("spotify-art");

const spotifySong =
    $("spotify-song");

const spotifyArtist =
    $("spotify-artist");

const spotifyAlbum =
    $("spotify-album");

const spotifyProgress =
    $("spotify-progress");

const spotifyCurrent =
    $("spotify-current");

const spotifyDuration =
    $("spotify-duration");

const activityImage =
    $("activity-image");

const activityName =
    $("activity-name");

const activityDetail =
    $("activity-detail");

const device =
    $("device");

const discordId =
    $("discord-id");

const connectionText =
    $("connection-text");

const connectionDot =
    $("connection-dot");

const viewCount =
    $("view-count");

const lanyardStat =
    $("lanyard-stat");


const DEFAULT_ACTIVITY_IMAGE =
    "assets/activity.png";

const DEFAULT_AVATAR =
    "https://cdn.discordapp.com/embed/avatars/0.png";


/* =========================
   VIEWS
========================= */

let localViews =
    Number(
        localStorage.getItem("profileViews") || "0"
    );

localViews++;

localStorage.setItem(
    "profileViews",
    localViews
);

if (viewCount) {
    viewCount.textContent =
        localViews.toLocaleString();
}


/* =========================
   FORMAT TIME
========================= */

function formatTime(ms) {

    if (!Number.isFinite(ms) || ms < 0) {
        return "0:00";
    }

    const totalSeconds =
        Math.floor(ms / 1000);

    const minutes =
        Math.floor(totalSeconds / 60);

    const seconds =
        totalSeconds % 60;

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}


/* =========================
   DISCORD CREATED DATE
========================= */

function getDiscordCreated(id) {

    try {

        const snowflake =
            BigInt(id);

        const discordEpoch =
            1420070400000n;

        const timestamp =
            Number(
                (snowflake >> 22n) +
                discordEpoch
            );

        return new Date(timestamp);

    } catch {
        return null;
    }
}


/* =========================
   STATUS
========================= */

function statusLabel(status) {

    switch (status) {

        case "online":
            return "ONLINE";

        case "idle":
            return "IDLE";

        case "dnd":
            return "DO NOT DISTURB";

        default:
            return "OFFLINE";
    }
}


/* =========================
   DEVICE
========================= */

function getDevice(platforms) {

    if (!platforms) {
        return "UNKNOWN";
    }

    const names = [];

    if (platforms.desktop) {
        names.push("DESKTOP");
    }

    if (platforms.mobile) {
        names.push("MOBILE");
    }

    if (platforms.web) {
        names.push("WEB");
    }

    return names.length
        ? names.join(" / ")
        : "UNKNOWN";
}


/* =========================
   PROFILE
========================= */

function updateProfile(data) {

    const user =
        data?.discord_user;

    if (!user) {
        return;
    }


    /* Avatar */

    if (avatar) {

        const avatarUrl =
            user.avatar
                ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}?size=256`
                : DEFAULT_AVATAR;

        avatar.src =
            avatarUrl;
    }


    /* Username */

    if (username) {

        username.textContent =
            user.username || "Unknown";
    }


    /* Global name */

    if (globalName) {

        globalName.textContent =
            user.global_name ||
            user.username ||
            "Unknown";
    }


    /* Discord ID */

    if (discordId) {

        discordId.textContent =
            `ID: ${user.id}`;
    }


    /* Created */

    if (infoCreated) {

        const created =
            getDiscordCreated(user.id);

        if (created) {

            infoCreated.textContent =
                created.toLocaleDateString(
                    undefined,
                    {
                        month: "short",
                        year: "numeric"
                    }
                );
        }
    }
}


/* =========================
   STATUS + CUSTOM STATUS
========================= */

function updateStatus(data) {

    const status =
        data?.discord_status || "offline";


    /* Bubble */

    if (statusBubble) {

        statusBubble.className =
            `status-bubble status-${status}`;
    }


    /* Status text */

    if (statusText) {

        const custom =
            data.activities?.find(
                activity =>
                    activity.type === 4
            );

        if (custom?.state) {

            statusText.textContent =
                custom.state;

        } else {

            statusText.textContent =
                statusLabel(status);
        }
    }


    /* Stats */

    if (infoStatus) {

        infoStatus.textContent =
            statusLabel(status);
    }


    /* Device */

    const platforms =
        data.active_on_discord_desktop ||
        data.active_on_discord_mobile ||
        data.active_on_discord_web
            ? {
                desktop:
                    data.active_on_discord_desktop,

                mobile:
                    data.active_on_discord_mobile,

                web:
                    data.active_on_discord_web
            }
            : null;

    const deviceName =
        getDevice(platforms);


    if (device) {

        device.textContent =
            `DEVICE: ${deviceName}`;
    }

    if (infoDevice) {

        infoDevice.textContent =
            deviceName;
    }


    /* Platform */

    if (infoPlatform) {

        const platformList = [];

        if (data.active_on_discord_desktop) {
            platformList.push("Desktop");
        }

        if (data.active_on_discord_mobile) {
            platformList.push("Mobile");
        }

        if (data.active_on_discord_web) {
            platformList.push("Web");
        }

        infoPlatform.textContent =
            platformList.length
                ? platformList.join(" / ")
                : "None";
    }
}


/* =========================
   SPOTIFY
========================= */

let spotifyInterval = null;

function updateSpotify(data) {

    const spotify =
        data?.spotify;


    if (!spotify) {

        if (spotifyArt) {

            spotifyArt.removeAttribute("src");
        }

        if (spotifySong) {
            spotifySong.textContent =
                "Not listening to Spotify";
        }

        if (spotifyArtist) {
            spotifyArtist.textContent =
                "—";
        }

        if (spotifyAlbum) {
            spotifyAlbum.textContent =
                "—";
        }

        if (spotifyProgress) {
            spotifyProgress.style.width =
                "0%";
        }

        if (spotifyCurrent) {
            spotifyCurrent.textContent =
                "0:00";
        }

        if (spotifyDuration) {
            spotifyDuration.textContent =
                "0:00";
        }

        if (infoSpotify) {
            infoSpotify.textContent =
                "NOT LISTENING";
        }

        if (spotifyInterval) {
            clearInterval(spotifyInterval);
            spotifyInterval = null;
        }

        return;
    }


    /* Artwork */

    if (spotifyArt) {

        spotifyArt.src =
            spotify.album_art_url || "";
    }


    /* Song */

    if (spotifySong) {

        spotifySong.textContent =
            spotify.song || "Unknown";
    }


    /* Artist */

    if (spotifyArtist) {

        spotifyArtist.textContent =
            spotify.artist || "Unknown";
    }


    /* Album */

    if (spotifyAlbum) {

        spotifyAlbum.textContent =
            spotify.album || "Unknown";
    }


    /* Stats */

    if (infoSpotify) {

        infoSpotify.textContent =
            spotify.song || "LISTENING";
    }


    function renderProgress() {

        const start =
            spotify.timestamps?.start;

        const end =
            spotify.timestamps?.end;

        if (!start || !end) {
            return;
        }

        const now =
            Date.now();

        const elapsed =
            now - start;

        const duration =
            end - start;

        const percentage =
            Math.max(
                0,
                Math.min(
                    100,
                    (elapsed / duration) * 100
                )
            );


        if (spotifyProgress) {

            spotifyProgress.style.width =
                `${percentage}%`;
        }


        if (spotifyCurrent) {

            spotifyCurrent.textContent =
                formatTime(elapsed);
        }


        if (spotifyDuration) {

            spotifyDuration.textContent =
                formatTime(duration);
        }
    }


    renderProgress();


    if (spotifyInterval) {
        clearInterval(spotifyInterval);
    }

    spotifyInterval =
        setInterval(
            renderProgress,
            1000
        );
}


/* =========================
   ACTIVITY
========================= */

function updateActivity(data) {

    const activities =
        data?.activities || [];


    const filtered =
        activities.filter(
            activity =>
                activity.type !== 4
        );


    if (!filtered.length) {

        if (activityName) {
            activityName.textContent =
                "No activity";
        }

        if (activityDetail) {
            activityDetail.textContent =
                "Nothing is being played";
        }

        if (activityImage) {
            activityImage.src =
                DEFAULT_ACTIVITY_IMAGE;
        }

        if (infoActivity) {
            infoActivity.textContent =
                "NONE";
        }

        return;
    }


    const activity =
        filtered[0];


    if (activityName) {

        activityName.textContent =
            activity.name ||
            "Unknown activity";
    }


    if (activityDetail) {

        const details = [
            activity.details,
            activity.state
        ].filter(Boolean);

        activityDetail.textContent =
            details.join(" • ") ||
            "Active";
    }


    if (infoActivity) {

        infoActivity.textContent =
            activity.name ||
            "ACTIVE";
    }


    /* Activity image */

    let imageUrl =
        DEFAULT_ACTIVITY_IMAGE;


    if (activity.assets?.large_image) {

        const image =
            activity.assets.large_image;


        if (image.startsWith("mp:external/")) {

            imageUrl =
                `https://media.discordapp.net/${image.replace("mp:", "")}`;

        } else if (image.startsWith("http")) {

            imageUrl =
                image;

        } else if (activity.application_id) {

            imageUrl =
                `https://cdn.discordapp.com/app-assets/${activity.application_id}/${image}.png?size=256`;
        }
    }


    if (activityImage) {

        activityImage.src =
            imageUrl;
    }
}


/* =========================
   LANYARD DATA
========================= */

function updateAll(data) {

    updateProfile(data);

    updateStatus(data);

    updateSpotify(data);

    updateActivity(data);
}


/* =========================
   CONNECTION STATUS
========================= */

function setConnectionStatus(
    state,
    label
) {

    const connection =
        document.querySelector(
            ".connection"
        );


    if (connection) {

        connection.classList.remove(
            "connected",
            "error"
        );

        if (state === "connected") {

            connection.classList.add(
                "connected"
            );
        }

        if (state === "error") {

            connection.classList.add(
                "error"
            );
        }
    }


    if (connectionText) {

        connectionText.textContent =
            label;
    }


    if (lanyardStat) {

        lanyardStat.textContent =
            label;
    }
}


/* =========================
   REST FALLBACK
========================= */

async function loadProfile() {

    try {

        setConnectionStatus(
            "connecting",
            "CONNECTING"
        );


        const response =
            await fetch(
                REST_URL,
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}`
            );
        }


        const result =
            await response.json();


        if (!result.success) {
            throw new Error(
                "Lanyard returned an error"
            );
        }


        updateAll(result.data);


        setConnectionStatus(
            "connected",
            "CONNECTED"
        );

    } catch (error) {

        console.error(
            "[Lanyard REST]",
            error
        );

        setConnectionStatus(
            "error",
            "CONNECTION ERROR"
        );
    }
}


/* =========================
   WEBSOCKET
========================= */

let socket = null;

let reconnectTimer = null;

let heartbeatTimer = null;


function connectLanyard() {

    if (socket) {

        try {
            socket.close();
        } catch {}
    }


    setConnectionStatus(
        "connecting",
        "CONNECTING"
    );


    socket =
        new WebSocket(WS_URL);


    socket.addEventListener(
        "open",
        () => {

            console.log(
                "[Lanyard] WebSocket connected"
            );
        }
    );


    socket.addEventListener(
        "message",
        event => {

            try {

                const packet =
                    JSON.parse(event.data);


                /* HELLO */

                if (packet.op === 1) {

                    const interval =
                        packet.d?.heartbeat_interval ||
                        30000;


                    if (heartbeatTimer) {
                        clearInterval(
                            heartbeatTimer
                        );
                    }


                    heartbeatTimer =
                        setInterval(
                            () => {

                                if (
                                    socket &&
                                    socket.readyState ===
                                        WebSocket.OPEN
                                ) {

                                    socket.send(
                                        JSON.stringify({
                                            op: 3,
                                            d: null
                                        })
                                    );
                                }

                            },
                            interval
                        );


                    socket.send(
                        JSON.stringify({
                            op: 2,
                            d: {
                                subscribe_to_id:
                                    USER_ID
                            }
                        })
                    );

                    return;
                }


                /* INITIAL */

                if (packet.t === "INIT_STATE") {

                    if (
                        Array.isArray(
                            packet.d
                        )
                    ) {

                        const user =
                            packet.d.find(
                                item =>
                                    item.user_id ===
                                    USER_ID
                            );

                        if (user) {

                            updateAll(user);

                            setConnectionStatus(
                                "connected",
                                "LIVE"
                            );
                        }
                    }

                    return;
                }


                /* PRESENCE UPDATE */

                if (packet.t === "PRESENCE_UPDATE") {

                    if (
                        packet.d?.user_id ===
                        USER_ID
                    ) {

                        updateAll(packet.d);

                        setConnectionStatus(
                            "connected",
                            "LIVE"
                        );
                    }
                }

            } catch (error) {

                console.error(
                    "[Lanyard WebSocket]",
                    error
                );
            }
        }
    );


    socket.addEventListener(
        "error",
        error => {

            console.error(
                "[Lanyard WebSocket]",
                error
            );

            setConnectionStatus(
                "error",
                "CONNECTION ERROR"
            );
        }
    );


    socket.addEventListener(
        "close",
        () => {

            setConnectionStatus(
                "connecting",
                "RECONNECTING"
            );


            if (heartbeatTimer) {

                clearInterval(
                    heartbeatTimer
                );

                heartbeatTimer = null;
            }


            if (reconnectTimer) {
                clearTimeout(
                    reconnectTimer
                );
            }


            reconnectTimer =
                setTimeout(
                    connectLanyard,
                    3000
                );
        }
    );
}


/* =========================
   CONNECTION LINKS
========================= */

function setupConnections() {

    const cards =
        document.querySelectorAll(
            ".connection-card"
        );


    cards.forEach(card => {

        const name =
            card.dataset.connection;

        const url =
            CONNECTIONS[name];


        if (!url) {

            card.style.display =
                "none";

            return;
        }


        card.href =
            url;

        card.target =
            "_blank";

        card.rel =
            "noopener noreferrer";
    });
}


/* =========================
   START
========================= */

setupConnections();

loadProfile();

connectLanyard();