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
}
