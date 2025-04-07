<script lang>
    import AutoComplete from "@/components/SimpleAutocomplete.svelte";

    const { user } = $props();

    async function searchTracks(keyword) {
        const url = `/api/spotify/search?q=${encodeURIComponent(keyword)}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.tracks.items;
    }

    // biome-ignore lint/style/useConst: <explanation>
    let selectedTrack = {};

    const payload = {
        song_info: {
            track: "Roots Bloody Roots",
            artist: "Sepultura",
            album: "Roots",
            url: "https://open.spotify.com/track/6ursmCnbc9oDRGa2yHKkoZ",
        },
        image_url: "https://i.scdn.co/image/ab67616d0000b2730bd5e7cce9765c2ef519424e",
        user: "Dan Cigrang",
    };

    const sendTheSong = async (event) => {
        const spotify_response = JSON.parse(JSON.stringify(selectedTrack));

        if (!Object.hasOwn(spotify_response, "name")) {
            console.log("No track selected");
            return;
        }
        console.log({ spotify_response });
        const song_info = {
            track: spotify_response.name,
            artist: spotify_response.artists[0].name,
            album: spotify_response.album.name,
            url: spotify_response.external_urls.spotify,
        };
        const image_url = spotify_response.album.images[0].url;
        const payload = {
            song_info,
            image_url,
            user,
        };
        await fetch("/api/spotify/print", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        window.location.reload();
    };
</script>

<AutoComplete
    searchFunction={searchTracks}
    delay="750"
    localFiltering={false}
    labelFieldName="name"
    placeholder="Search for a track"
    bind:selectedItem={selectedTrack}
    autocompleteOffValue="off"
    showClear={true}
    locked={true}
>
    {#snippet item(item, label)}
        <img src={item.album.images[2].url} alt="Album cover" />
        <div>
            <div>{@html label}</div>
            <div>{item.artists[0].name}</div>
        </div>
    {/snippet}
</AutoComplete>

<button id="search-button" onclick={(event) => sendTheSong(event)}>Add</button>

<style>
    :global(.autocomplete-list-item) {
        display: flex;
        justify-content: space-between;
        & > div {
            display: flex;
            flex-direction: column;
            text-align: right;
            justify-content: space-evenly;
        }
        &:not(:last-child) {
            border-bottom: 1px solid #ccc;
        }
    }
    :global(.autocomplete) {
        width: 60%;
    }
    button {
        padding: 0.5rem 1rem;
        font-size: 1rem;
        background-color: #4a90e2;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    button:hover {
        background-color: #357abd;
    }
</style>
