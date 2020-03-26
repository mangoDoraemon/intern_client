const baseURL = process.env.VUE_APP_BASE_API

// 通用下载方法
export function download(resource) {
    // window.location.href = baseURL + "/common/download?resource=" + encodeURI(resource);
    window.location.href = encodeURI(encodeURI( baseURL + "/common/download?resource="+resource)) ;
}