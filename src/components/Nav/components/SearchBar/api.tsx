export async function searchGoogle(query: string) {
    const yt_api_key = localStorage.getItem('yt_api_key') ?? process.env.NEXT_PUBLIC_YT_API_KEY;
    const res = await fetch('https://www.googleapis.com/youtube/v3/search?q=' + query + '&part=snippet&maxResults=50&type=video&key=' + yt_api_key);

    return res.json();
}

export async function getContentDetails(videoIds: string) {
    const yt_api_key = localStorage.getItem('yt_api_key') ?? process.env.NEXT_PUBLIC_YT_API_KEY;
    const res = await fetch('https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=' + videoIds + '&key=' + yt_api_key);

    return res.json();
}
