export default {
    replay: (value: string) => {
        return `🔁  Chế độ lặp lại: **${value}**`
    },
    processing: '> *Đã nhận link, bot đang xử lý.....*',
    defaultError: '❌ Vui lòng thử lại với từ khoá khác.',
    error: '❌ Lỗi mẹ ùi!',
    notYoutubeLink: '🔊 Tìm một link youtube rồi thử lại!',
    notALink: '🔊 Tìm kiếm bằng từ khóa chưa hỗ trợ!',
    playerNotCreated: '🔊 Bot chưa vào kênh!',
    cantFindAnyThing: "❌ Chịu, không tìm thấy gì cả!",
    userJoinVoiceChannel: (username: string) => {
        return `🔊 Mời ${username} vào voice channel rồi thử lại nhé!`
    },
    joinVoiceChannel: '🔊 Để bot vào voice channel rồi thử lại!',
    failToJoinVoiceChannel: '❌ Không vào nổi kênh nói!',
    playerNotFound: '❌ Player Không tìm thấy/chưa được tạo.',
    failToPlay: '❌ Fail to hát!',
    addedToQueue: (payload: any) => {
        return `:notes: Đã thêm \*\*${payload.title}(\`${payload.length}\`)\*\* vào danh sách chờ.`;
    },
    author: 'Trình bày',
    length: 'Độ dài',
    type: 'Type',
    platform: 'Nền tảng',
    noSongsInQueue: '👀 Không có bài nào trong list cả!',
    skippedSong: (payload: any) => {
        return `:notes: Đang phát bài \*\*${payload.title}\*\* - ${payload.requester}`;
    },
    selectSongToPlay: 'Chọn một bài để phát',
    notPlaying: '🔇 Không hát!',
    alreadyPaused: '⏸ Already tạm dừng!',
    paused: '⏸ Tạm dừng!',
    resumed: '▶ Tiếp tục!',
    alreadyPlaying: '▶ Already hát!',
    leaved: '👋 Bye bye',
    nothing: '🤷‍♂️ Không có j`',
    yourQueue: '🎶 Danh sách của bạn',
    invalidPosition: '❌ Invalid position!',
    jumpedTo: '⏩ Di chuyển tới',
    removed: '🗑 Removed',
    help: '💡 Help',
    ping: '📶 Ping',
    requestedBy: 'Phát bởi',
    emptyQueue: 'Danh sách trống!',
    setUpPaP: 'Dùng câu lệnh music-area để set up PaP',
    settingUpPaP: (id: string) => {
        return `Cài đặt Music Area cho tính năng PaP (channel ID: ${id})`
    }
};

