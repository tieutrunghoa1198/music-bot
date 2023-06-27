export const exactMatch = (a: any, b: any) => {
    a = a.split(' ');
    b = b.split(' ');
    let s: any = [];
    let out = [];
    let x = a.map((x: any) => b.includes(x) ? x : null);
    x.forEach((v: any) => {
        if (v == null) {
            out.push(s);
            s = [];
        } else {
            s.push(v);
        }
    });
    out.push(s);
    out = out.map(x => x.join(' ')).filter(x => x);
    return out;
}

export const limitString = (text: string, limit: number) => {
    if (text.length > limit) {
        text = text.slice(0, limit);
    }
    return text;
}
