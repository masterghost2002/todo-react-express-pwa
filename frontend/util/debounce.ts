const debounce = (callback:(...args:any)=>void, timeout = 1000)=>{
    let tid:any;
    return (...args:any)=>{
        clearTimeout(tid);
        tid = setTimeout(()=>{
            callback.apply(this, args);
        }, timeout)
    }
};
export default debounce;