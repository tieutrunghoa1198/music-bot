export default {
    error: '❌ Error!',
    cantFindAnyThing: "❌ Can't find anything!",
    joinVoiceChannel: '🔊 Let bot join voice channel then try again!',
    failToJoinVoiceChannel: '❌ Failed to join voice channel!',
    failToPlay: '❌ Failed to play!',
    addedToQueue: (payload: any) => {
        return `:notes: Đã thêm \*\*${payload.title}(\`${payload.length}\`)\*\* vào danh sách chờ.`;
    },
    author: 'Trình bày',
    length: 'Độ dài',
    type: 'Type',
    platform: 'Nền tảng',
    noSongsInQueue: '👀 No songs in queue!',
    skippedSong: (payload: any) => {
        return `:notes: Bỏ qua bài \*\*${payload.title}\*\* - ${payload.requester}`;
    },
    notPlaying: '🔇 Not playing!',
    alreadyPaused: '⏸ Already paused!',
    paused: '⏸ Paused!',
    resumed: '▶ Resumed!',
    alreadyPlaying: '▶ Already playing!',
    leaved: '👋 Bye bye',
    nothing: '🤷‍♂️ Nothing',
    yourQueue: '🎶 Your queue',
    invalidPosition: '❌ Invalid position!',
    jumpedTo: '⏩ Jumped to',
    removed: '🗑 Removed',
    help: '💡 Help',
    ping: '📶 Ping',
    requestedBy: 'Phát bởi',
    emptyQueue: 'Queue is empty'
};

