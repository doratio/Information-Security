module.exports = {
    FGMult: function (a, b) {
        let aa = a, bb = b, r = 0, t;
        while (aa != 0) {
            if ((aa & 1) != 0) r = r ^ bb;
            t = bb & 0x80;
            bb = bb << 1;
            if (t != 0) bb = bb ^ 0x11b;
            aa = (aa & 0xff) >> 1;
        }
        return r;
    }
}