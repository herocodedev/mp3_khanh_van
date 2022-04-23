const API_RANK_SONG = "https://music-player-pink.vercel.app/api/top100";
const API_PLAYLIST_SONG =
  "https://music-player-pink.vercel.app/api/playlist?id=";
const API_GET_SONG = "https://music-player-pink.vercel.app/api/song?id=";

let audioOutstandingSongs = [];

const getMp3Music = async (encodeId) => {
  const { data } = await axios.get(API_GET_SONG + encodeId);
  return data.data;
};

const getMusicOutstanding = async () => {
  const res1 = await axios.get(API_RANK_SONG);
  const encodeId = res1.data.data[0].items[0].encodeId;
  const { data } = await axios.get(API_PLAYLIST_SONG + encodeId);

  // Get songs
  const songs = data.data.song.items;
  console.log(songs);
  // Render all songs
  // Addevent when click song
  // Call api get song

  // Note can bai nao thi get bai do ra thoi neu loa het chay k noi
};

const main = async () => {
  getMusicOutstanding();
};

main();
