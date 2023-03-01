import axios from "axios";
// import {history} from '../index';

export interface ICustomErrType extends Error { 
    response?: {
        data: {
            message: string;
            status: number;
        }
    }
}

export const config = {
    setCookie: (name:string, value:string, days:number) => {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    },
    getCookie: (name:string) => {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    getStore: (name:string) => {
        if (localStorage.getItem(name)) {
            return localStorage.getItem(name);
        }
        return null;
    },
    setStore: (name:string, value:any) => {
        localStorage.setItem(name, value);
    },
    huyStore: (name: string) => {
        localStorage.removeItem(name);
      },
    setStoreJson: (name:string, value:any) => {
        let json = JSON.stringify(value);
        localStorage.setItem(name, json);
    },
    getStoreJson: (name:string) => {
        if (localStorage.getItem(name)) {
            let result:any = localStorage.getItem(name);
            return JSON.parse(result);
        }
        return null;
    },
    ACCESS_TOKEN: 'accessToken',
    USER_LOGIN: 'userLogin'
}

export const { setCookie, getCookie, getStore, huyStore, setStore, setStoreJson, getStoreJson, ACCESS_TOKEN, USER_LOGIN } = config;

const DOMAIN = 'https://jiranew.cybersoft.edu.vn/api';
const TOKEN_CYBERSOFT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCAzNUUiLCJIZXRIYW5TdHJpbmciOiIwNy8wNi8yMDIzIiwiSGV0SGFuVGltZSI6IjE2ODYwOTYwMDAwMDAiLCJuYmYiOjE2NTczODYwMDAsImV4cCI6MTY4NjI0MzYwMH0.XsCcIZvawxcwye8KVYB2vJK4d3Gbr1XROtNyAL8nypA';

/* Cấu hình request cho tất cả api - response cho tất cả kết quả từ api trả về */

//Cấu hình domain gửi đi
export const http = axios.create({
    baseURL: DOMAIN,
    timeout: 30000
})
//Cấu hình request header
http.interceptors.request.use(
    config => {
        const user = getStoreJson(USER_LOGIN);

        let token = '';
        if (user) {
            token = user.accessToken;
        }

        console.log(user, token, 'token')
        config.headers = {
            ...config.headers,
            ['Authorization']: `Bearer ${token}`,
            ['TokenCybersoft']: TOKEN_CYBERSOFT
        }
        // config.headers['Content-Type'] = 'application/json';
        return config
    },
    error => {
        Promise.reject(error)
    }
)
//Cấu hình kết quả trả về
http.interceptors.response.use((response) => {
    console.log(response, 'response');
    return response;
}, err => {
    // const originalRequest = error.config;
    if(err.response && (err.response.status === 400 || err.response.status === 404)) {
        // history.push('/');
        return  Promise.reject(err);
    }
    if(err.response && (err.response.status === 401 || err.response.status === 403)) {
        alert('Token không hợp lệ ! Vui lòng đăng nhập lại !');
        // history.push('/login');
        return Promise.reject(err)
    }

    return Promise.reject(err)
})
/**
 * status code
 * 400: Tham số gửi lên không hợp lệ => kết quả không tìm được (Badrequest);
 * 404: Tham số gửi lên hợp lệ nhưng không tìm thấy => Có thể bị xoá rồi (Not found) ... 
 * 200: Thành công, OK
 * 201: Đã được tạo thành công => (Mình đã tạo rồi sau đó request tiếp thì sẽ trả 201) (Created)
 * 401: Không có quyền truy cập vào api đó (Unauthorize - Có thể do token không hợp lệ hoặc bị admin chặn )
 * 403: Chưa đủ quyền truy cập vào api đó (Forbiden - token hợp lệ tuy nhiên token đó chưa đủ quyền truy cập vào api)
 * 500: Lỗi xảy ra tại server (Nguyên nhân có thể frontend gửi dữ liệu không hợp lệ => backend trong quá trình xử lý code gây ra lỗi hoặc do backend code bị lỗi => Error in server )
 */ 

// var useDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

// tinymce.init({
//     selector: "textarea.open-source-plugins",
//     plugins:
//         "print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons",
//     imagetools_cors_hosts: ["picsum.photos"],
//     menubar: "file edit view insert format tools table help",
//     toolbar:
//         "undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl",
//     toolbar_sticky: true,
//     autosave_ask_before_unload: true,
//     autosave_interval: "30s",
//     autosave_prefix: "{path}{query}-{id}-",
//     autosave_restore_when_empty: false,
//     autosave_retention: "2m",
//     image_advtab: true,
//     link_list: [
//         { title: "My page 1", value: "https://www.tiny.cloud" },
//         { title: "My page 2", value: "http://www.moxiecode.com" },
//     ],
//     image_list: [
//         { title: "My page 1", value: "https://www.tiny.cloud" },
//         { title: "My page 2", value: "http://www.moxiecode.com" },
//     ],
//     image_class_list: [
//         { title: "None", value: "" },
//         { title: "Some class", value: "class-name" },
//     ],
//     importcss_append: true,
//     file_picker_callback: function (callback, value, meta) {
//         /* Provide file and text for the link dialog */
//         if (meta.filetype === "file") {
//             callback("https://www.google.com/logos/google.jpg", { text: "My text" });
//         }

//         /* Provide image and alt text for the image dialog */
//         if (meta.filetype === "image") {
//             callback("https://www.google.com/logos/google.jpg", { alt: "My alt text" });
//         }

//         /* Provide alternative source and posted for the media dialog */
//         if (meta.filetype === "media") {
//             callback("movie.mp4", { source2: "alt.ogg", poster: "https://www.google.com/logos/google.jpg" });
//         }
//     },
//     templates: [
//         {
//             title: "New Table",
//             description: "creates a new table",
//             content:
//                 '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>',
//         },
//         { title: "Starting my story", description: "A cure for writers block", content: "Once upon a time..." },
//         {
//             title: "New list with dates",
//             description: "New List with dates",
//             content: '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>',
//         },
//     ],
//     template_cdate_format: "[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]",
//     template_mdate_format: "[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]",
//     height: 300,
//     image_caption: true,
//     quickbars_selection_toolbar: "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
//     noneditable_noneditable_class: "mceNonEditable",
//     toolbar_mode: "sliding",
//     contextmenu: "link image imagetools table",
//     skin: useDarkMode ? "oxide-dark" : "oxide",
//     content_css: useDarkMode ? "dark" : "default",
//     content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
// });


// eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiIxMjY5NzY3MzM2OTM2NDE3QGZhY2Vib29rLmNvbSIsIm5iZiI6MTY3NTkxMTgyOSwiZXhwIjoxNjc1OTE1NDI5fQ.q-NBD9iPpJTbojQdJ_LpPshvYizhM5cMcGxywRZpwzU