export async function searchGoogle(query: string) {
    const res = await fetch('https://www.googleapis.com/youtube/v3/search?q=' + query + ' drum lesson&part=snippet&maxResults=50&type=video&key=' + process.env.REACT_APP_YT_API_KEY);

    return res.json();
}

export async function getContentDetails(videoIds: string) {
    const res = await fetch('https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=' + videoIds + '&key=' + process.env.REACT_APP_YT_API_KEY);

    return res.json();
}
