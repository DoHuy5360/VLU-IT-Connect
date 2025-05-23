import { defineStore } from "pinia";
import { RouterLink, useRouter } from "vue-router";
import Swal from "sweetalert2";

// Main Pinia Store
export const useTemplateStore = defineStore({
    id: "template",
    state: () => ({
        // App vital details
        app: {
            name: "IT-Connect",
            version: "1.0",
            copyright: new Date().getFullYear(),
            language: localStorage.getItem("it-connect:language") || "VN",
            baseURL: import.meta.env.VITE_BASE_URL,
            assetURL: import.meta.env.BASE_URL,
        },

        breadcrumb: {
            path: [],
        },

        heroTitleName: {
            vn: "",
            en: "",
        },

        // Default layout options
        layout: {
            header: true,
            sidebar: true,
            sideOverlay: true,
            footer: true,
        },

        // Default template settings
        // Various of them are also set in each layout variation under layouts/variations/ folder
        settings: {
            colorTheme: "", // 'amethyst', 'city', 'flat', 'modern', 'smooth'
            darkMode: false,
            darkModeSystem: true,
            sidebarLeft: true,
            sidebarMini: false,
            sidebarDark: true,
            sidebarVisibleDesktop: true,
            sidebarVisibleMobile: false,
            sideOverlayVisible: false,
            sideOverlayHoverable: false,
            pageOverlay: true,
            headerFixed: true,
            headerDark: false,
            headerSearch: false,
            headerLoader: false,
            pageLoader: false,
            rtlSupport: false,
            sideTransitions: true,
            mainContent: "", // 'boxed', ''narrow'
        },
        body: {
            allowedScroll: true
        }
    }),
    actions: {
        setWindowScroll(state){
            this.body.allowedScroll = state
        },
        setLanguage(language) {
            this.app.language = language;
            localStorage.setItem("it-connect:language", language);
        },
        isVietNamese() {
            return this.app.language === "VN";
        },
        setHeroTitleName(name) {
            this.heroTitleName = name;
        },
        setBreadcrumb(path) {
            this.breadcrumb.path = path;
        },
        getBrandAsset(path) {
            return this.app.assetURL + "/assets/media/brand" + path;
        },
        getOtherAsset(path) {
            return this.app.assetURL + "/assets/media/other" + path;
        },
        signOut(message) {
            localStorage.removeItem("authToken");
            const router = useRouter();
            router.push(`/auth/signin?msg=${message || "Phiên đăng nhập đã hết hạn"}`);
        },
        async alert({ title, text, icon, translate = true }) {
            let confirmButtonText = "Đồng ý"
            if(translate){
                confirmButtonText = translate && this.isVietNamese() ? "Đồng ý" : "Ok"
            }
            return await Swal.fire({
                title,
                text,
                icon: icon || "success",
                confirmButtonText,
            });
        },
        async confirm({ title, text, icon, callback, translate = true }) {
            let confirmButtonText = "Đồng ý"
            let cancelButtonText = "Hủy"
            if(text==undefined) text = "Hành động này không thể hoàn tác"
            if(translate){
                confirmButtonText = translate && this.isVietNamese() ? "Đồng ý" : "Ok"
                cancelButtonText = translate && this.isVietNamese() ? "Hủy" : "Cancel"
                if(text==undefined) text = this.isVietNamese() ? "Hành động này không thể hoàn tác" : "This action cannot be reversed"
            }
            const confirmation = await Swal.fire({
                title,
                text,
                icon: icon || "warning",
                showCancelButton: true,
                confirmButtonText,
                cancelButtonText,
            });

            if (confirmation.isConfirmed) callback();
        },
        // Sets the layout, useful for setting different layouts (under layouts/variations/)
        setLayout(payload) {
            this.layout.header = payload.header;
            this.layout.sidebar = payload.sidebar;
            this.layout.sideOverlay = payload.sideOverlay;
            this.layout.footer = payload.footer;
        },
        formatDate(stringDate) {
            const date = new Date(stringDate);
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
            const year = date.getFullYear();

            return `${day}/${month}/${year}`;
        },
        formatDateTime(stringDate) {
            const date = new Date(stringDate);
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            const seconds = String(date.getSeconds()).padStart(2, "0");

            return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
        },
        YYYYmmddFormat(dateString) {
            if (!dateString) return null;
            const [day, month, year] = dateString.split("-"); // Tách ngày, tháng, năm
            return `${year}-${month}-${day}`; // Trả về định dạng mới
        },
        truncateText(text, numberOfLimitLetter) {
            try {
                if (text == null || text == undefined) return text;
                return text.length > numberOfLimitLetter ? `${text.slice(0, numberOfLimitLetter)}...` : text;
            } catch (error) {
                console.log(error);
                return text;
            }
        },
        isMP4(source) {
            if (source) {
                return source.endsWith(".mp4");
            } else {
                return false;
            }
        },
        parseMetadataImage(metadata) {
            try {
                const metaObj = JSON.parse(metadata);

                if (metaObj.Files?.length) {
                    let imagePath = metaObj.Files[0].replace(/\\/g, "/");
                    return this.app.baseURL + "/" + imagePath;
                }
                return "";
            } catch (error) {
                console.error("Error parsing metadata:", error);
                return "";
            }
        },
        parseMetadataVideo(metadata) {
            try {
                const metaObj = JSON.parse(metadata);

                let path = "";
                switch (metaObj.Video?.type) {
                    case "file":
                        path = this.app.baseURL + "/" + metaObj.Video.file.replace(/\\/g, "/");
                        break;
                    case "link":
                        path = metaObj.Video.url;
                        break;
                    default:
                        console.log("Missing video type in response");
                        return null;
                }
                return path;
            } catch (error) {
                console.error("Error parsing metadata:", error);
                return "";
            }
        },
        downloadFile(fileData, fileName){
            // Tạo URL cho file blob
            const url = window.URL.createObjectURL(new Blob([fileData]));
                    
            // Tạo thẻ <a> để tải file
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName); // Tên file khi tải xuống

            // Thêm thẻ <a> vào document và click vào nó để tải file
            document.body.appendChild(link);
            link.click();

            // Xóa thẻ <a> sau khi tải xong
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url); // Giải phóng URL blob
        },
        getCurrentDateObject() {
            const date = new Date();
        
            const padZero = (num) => num.toString().padStart(2, "0"); // Hàm để thêm số 0 vào trước nếu cần
        
            return {
                day: padZero(date.getDate()),
                month: padZero(date.getMonth() + 1),
                year: date.getFullYear(),
            };
        },
        // Sets sidebar visibility (open, close, toggle)
        sidebar(payload) {
            if (window.innerWidth > 991) {
                if (payload.mode === "open") {
                    this.settings.sidebarVisibleDesktop = true;
                } else if (payload.mode === "close") {
                    this.settings.sidebarVisibleDesktop = false;
                } else if (payload.mode === "toggle") {
                    this.settings.sidebarVisibleDesktop = !this.settings.sidebarVisibleDesktop;
                }
            } else {
                if (payload.mode === "open") {
                    this.settings.sidebarVisibleMobile = true;
                } else if (payload.mode === "close") {
                    this.settings.sidebarVisibleMobile = false;
                } else if (payload.mode === "toggle") {
                    this.settings.sidebarVisibleMobile = !this.settings.sidebarVisibleMobile;
                }
            }
        },
        // Sets sidebar mini mode (on, off, toggle)
        sidebarMini(payload) {
            if (window.innerWidth > 991) {
                if (payload.mode === "on") {
                    this.settings.sidebarMini = true;
                } else if (payload.mode === "off") {
                    this.settings.sidebarMini = false;
                } else if (payload.mode === "toggle") {
                    this.settings.sidebarMini = !this.settings.sidebarMini;
                }
            }
        },
        // Sets sidebar position (left, right, toggle)
        sidebarPosition(payload) {
            if (payload.mode === "left") {
                this.settings.sidebarLeft = true;
            } else if (payload.mode === "right") {
                this.settings.sidebarLeft = false;
            } else if (payload.mode === "toggle") {
                this.settings.sidebarLeft = !this.settings.sidebarLeft;
            }
        },
        // Sets sidebar style (dark, light, toggle)
        sidebarStyle(payload) {
            if (payload.mode === "dark") {
                this.settings.sidebarDark = true;
            } else if (payload.mode === "light") {
                this.settings.sidebarDark = false;
            } else if (payload.mode === "toggle") {
                this.settings.sidebarDark = !this.settings.sidebarDark;
            }
        },
        // Sets side overlay visibility (open, close, toggle)
        sideOverlay(payload) {
            if (payload.mode === "open") {
                this.settings.sideOverlayVisible = true;
            } else if (payload.mode === "close") {
                this.settings.sideOverlayVisible = false;
            } else if (payload.mode === "toggle") {
                this.settings.sideOverlayVisible = !this.settings.sideOverlayVisible;
            }
        },
        // Sets side overlay hover mode (on, off, toggle)
        sideOverlayHover(payload) {
            if (payload.mode === "on") {
                this.settings.sideOverlayHoverable = true;
            } else if (payload.mode === "off") {
                this.settings.sideOverlayHoverable = false;
            } else if (payload.mode === "toggle") {
                this.settings.sideOverlayHoverable = !this.settings.sideOverlayHoverable;
            }
        },
        // Sets page overlay visibility (on, off, toggle)
        pageOverlay(payload) {
            if (payload.mode === "on") {
                this.settings.pageOverlay = true;
            } else if (payload.mode === "off") {
                this.settings.pageOverlay = false;
            } else if (payload.mode === "toggle") {
                this.settings.pageOverlay = !this.settings.pageOverlay;
            }
        },
        // Sets header mode (fixed, static, toggle)
        header(payload) {
            if (payload.mode === "fixed") {
                this.settings.headerFixed = true;
            } else if (payload.mode === "static") {
                this.settings.headerFixed = false;
            } else if (payload.mode === "toggle") {
                this.settings.headerFixed = !this.settings.headerFixed;
            }
        },
        // Sets header style (dark, light, toggle)
        headerStyle(payload) {
            if (payload.mode === "dark") {
                this.settings.headerDark = true;
            } else if (payload.mode === "light") {
                this.settings.headerDark = false;
            } else if (payload.mode === "toggle") {
                this.settings.headerDark = !this.settings.headerDark;
            }
        },
        // Sets header search visibility (on, off, toggle)
        headerSearch(payload) {
            if (payload.mode === "on") {
                this.settings.headerSearch = true;
            } else if (payload.mode === "off") {
                this.settings.headerSearch = false;
            } else if (payload.mode === "toggle") {
                this.settings.headerSearch = !this.settings.headerSearch;
            }
        },
        // Sets header loader visibility (on, off, toggle)
        headerLoader(payload) {
            if (payload.mode === "on") {
                this.settings.headerLoader = true;
            } else if (payload.mode === "off") {
                this.settings.headerLoader = false;
            } else if (payload.mode === "toggle") {
                this.settings.headerLoader = !this.settings.headerLoader;
            }
        },
        // Sets page loader visibility (on, off, toggle)
        pageLoader(payload) {
            if (payload.mode === "on") {
                this.settings.pageLoader = true;
            } else if (payload.mode === "off") {
                this.settings.pageLoader = false;
            } else if (payload.mode === "toggle") {
                this.settings.pageLoader = !this.settings.pageLoader;
            }
        },
        // Sets main content mode (full, boxed, narrow)
        mainContent(payload) {
            if (payload.mode === "full") {
                this.settings.mainContent = "";
            } else if (payload.mode === "boxed") {
                this.settings.mainContent = "boxed";
            } else if (payload.mode === "narrow") {
                this.settings.mainContent = "narrow";
            }
        },
        // Dark Mode
        darkMode(payload) {
            if (payload.mode === "on") {
                // this.settings.darkMode = true;
            } else if (payload.mode === "off") {
                this.settings.darkMode = false;
            } else if (payload.mode === "toggle") {
                this.settings.darkMode = !this.settings.darkMode;
            }
        },
        // Dark Mode System based
        darkModeSystem(payload) {
            if (payload.mode === "on") {
                this.settings.darkModeSystem = true;

                // Check system preference
                if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
                    this.settings.darkMode = true;
                } else {
                    this.settings.darkMode = false;
                }
            } else if (payload.mode === "off") {
                this.settings.darkModeSystem = false;
            }
        },
        // Sets active color theme
        setColorTheme(payload) {
            // Matches all classes which start with 'theme-'
            let regx = new RegExp("\\btheme-[^ ]*[ ]?\\b", "g");

            // Set new theme
            this.settings.colorTheme = payload.theme || "";

            // Remove all classes which start with 'theme-' from body element
            document.body.className = document.body.className.replace(regx, "");

            // If theme is set, add the theme class to body element
            if (payload.theme) {
                document.body.classList.add("theme-" + payload.theme);
            }
        },
        // Sets side transitions
        setSideTransitions(payload) {
            this.settings.sideTransitions = payload.transitions;
        },
    },
});
