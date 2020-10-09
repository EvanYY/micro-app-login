export function HANDLE_ID_ARR(arr) {
    let id_arr = [];
    for (let item of arr) {
        if (item.parentId !== 0) {
            id_arr.push(item.parentId);
        }
        if (item.grandpa_id && item.grandpa_id !== 0) {
            id_arr.push(item.grandpa_id);
        }
        if (item.all_id && item.all_id.length) {
            for (let id_item of item.all_id) {
                id_arr.push(id_item);
            }
        }
        id_arr.push(item.id);
    }
    let set = new Set(id_arr);
    return [...set];
}


export function HANDLE_PRESON_ID_ARR(arr) {
    let id_arr = [];
    for (let item of arr) {
        if (item.type === 'person') {
            id_arr.push(item.id);
        }
    }
    return id_arr;
}
