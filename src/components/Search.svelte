<script lang>
    import AutoComplete from "@/components/SimpleAutocomplete.svelte";

    async function searchTracks(keyword) {
        const url = `/api/spotify/search?q=${encodeURIComponent(keyword)}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.tracks.items;
    }

    // biome-ignore lint/style/useConst: <explanation>
    let selectedTrack = {};
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
</style>
