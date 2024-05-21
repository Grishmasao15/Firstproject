function fact(num: number): number {
    if (isNaN(num)) {
        return 0;
    }
    if (num == 0) {
        return 1;
    }
    else {
        return num * fact(num - 1);
    }
}
export default fact;