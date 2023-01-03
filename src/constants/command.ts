export class Command {
    public static readonly pause = {
        name: 'tamdung',
        description: 'Tạm dừng phát nhạc.'
    }

    public static readonly resume = {
        name: 'tieptuc',
        description: 'Tiếp tục hát bài đang chạy.'
    }

    public static readonly listQueue = {
        name: 'danhsach',
        description: 'Danh sách các bài hát trong hàng chờ.'
    }

    public static readonly skip = {
        name: 'boqua',
        description: 'Bỏ qua bài hát hiện tại.'
    }

    public static readonly leave = {
        name: 'thoat',
        description: 'Thoát khỏi kênh chat.'
    }

    public static readonly play = {
        name: 'phatnhac',
        description: 'Phát nhạc bằng link.'
    }

    public static readonly setMusicArea = {
        name: 'music-area',
        description: 'Cài đặt kênh cho PaP'
    }

    public static readonly clear = {
        name: 'xoahet',
        description: 'Xóa danh sách hiện tại'
    }

    public static readonly restrict = {
        name: 'restrict',
        description: 'Xóa danh sách hiện tại'
    }

    public static readonly nowPlaying = {
        name: 'dangphat',
        description: 'Bài hát đang phát!'
    }
}
export class BuilderID {
    public static readonly trackSelectMenu = 'track_select_menu';
}
