import { createRouter, createWebHistory } from "vue-router";
import NProgress from "nprogress/nprogress.js";

// Import components
const WelcomeAdmin = () => import("@/views/one-ui/WelcomeAdmin.vue");
const Home = () => import("@/views/it-connect/Home.vue");
const Categories = () => import("@/views/it-connect/Categories.vue");
const Videos = () => import("@/views/it-connect/Videos.vue");
const Search = () => import("@/views/it-connect/Search.vue");
const Blog = () => import("@/views/it-connect/blog/BlogView.vue");
const Detail = () => import("@/views/it-connect/blog/DetailView.vue");
const BlogSimulate = () => import("@/views/one-ui/blog/BlogSimulate.vue");

const BlogAdmin = () => import("@/views/one-ui/blog/BlogAdmin.vue");
const BlogCreate = () => import("@/views/one-ui/blog/CreateBlog.vue");
const BlogEdit = () => import("@/views/one-ui/blog/EditBlog.vue");
const BlogViewDetail = () => import("@/views/one-ui/blog/BlogViewDetail.vue");
const CategoryAdmin = () => import("@/views/one-ui/category/Category.vue");
const CategoryCreate = () => import("@/views/one-ui/category/CreateCategory.vue");
const CategoryEdit = () => import("@/views/one-ui/category/EditCategory.vue");
const AccountAdmin = () => import("@/views/one-ui/account/AccountMain.vue");
const AccountCreate = () => import("@/views/one-ui/account/CreateAccount.vue");
const AccountEdit = () => import("@/views/one-ui/account/EditAccount.vue");
const AuthSignIn = () => import("@/views/one-ui/auth/SignIn.vue");
const AccountAdminManager = () => import("@/views/one-ui/accountmanager/AccountManager.vue");
const AccountManagerCreate = () => import("@/views/one-ui/accountmanager/CreateAccountManager.vue");
const AccountManagerEdit = () => import("@/views/one-ui/accountmanager/EditAccountManager.vue");
const AddAccountManager = () => import("@/views/one-ui/accountmanager/AssignUserToGroup.vue");

// Layouts
const MainLayout = () => import("@/layouts/variations/it-connect/MainLayout.vue");
const AdminLayout = () => import("@/layouts/variations/one-ui/AdminLayout.vue");
const LayoutSimple = () => import("@/layouts/variations/one-ui/Simple.vue");
const ContentLayout = () => import("@/layouts/variations/it-connect/ContentLayout.vue");

// Routes
const routes = [
    {
        path: "/auth",
        component: LayoutSimple,
        children: [
            {
                path: "signin",
                name: "AuthSignIn",
                component: AuthSignIn,
            },
        ],
    },
    {
        path: "/administrator",
        name: "AdminPage",
        component: AdminLayout,
        children: [
            {
                path: "",
                name: "index",
                component: WelcomeAdmin,
            },
            {
                path: "blog",
                children: [
                    {
                        path: "",
                        name: "AdminBlog",
                        component: BlogAdmin,
                    },
                    {
                        path: "create",
                        name: "AdminBlogCreate",
                        component: BlogCreate,
                    },
                    {
                        path: "edit/:id",
                        name: "AdminBlogEdit",
                        component: BlogEdit,
                    },
                    {
                        path: "viewdetail/:id",
                        name: "AdminBlogViewDetail",
                        component: BlogViewDetail,
                    },
                    {
                        path: "simulate",
                        name: "AdminBlogSimulate",
                        component: BlogSimulate,
                    },
                ],
            },
            {
                path: "category",
                children: [
                    {
                        path: "",
                        name: "AdminCategory",
                        component: CategoryAdmin,
                    },
                    {
                        path: "create",
                        name: "AdminCategoryCreate",
                        component: CategoryCreate,
                    },
                    {
                        path: "edit/:code",
                        name: "AdminCategoryEdit",
                        component: CategoryEdit,
                        props: true,
                    },
                ],
            },
            {
                path: "accountmanager",
                children: [
                    {
                        path: "",
                        name: "AdminAccountManager",
                        component: AccountAdminManager,
                    },
                    {
                        path: "create",
                        name: "AdminAccountManagerCreate",
                        component: AccountManagerCreate,
                    },
                    {
                        path: "edit/:id",
                        name: "AdminAccountManagerEdit",
                        component: AccountManagerEdit,
                        props: true,
                    },
                    {
                        path: "addaccount",
                        name: "AdminAccountManagerAddAccount",
                        component: AddAccountManager,
                        props: true,
                    },
                ],
            },
            {
                path: "account",
                children: [
                    {
                        path: "",
                        name: "AdminAccount",
                        component: AccountAdmin,
                    },
                    {
                        path: "create",
                        name: "AdminAccountCreate",
                        component: AccountCreate,
                    },
                    {
                        path: "edit/:id",
                        name: "AdminAccountEdit",
                        component: AccountEdit,
                        props: true,
                    },
                ],
            },
        ],
    },

    {
        path: "/",
        component: MainLayout,
        children: [
            {
                path: "",
                name: "HomePage",
                component: Home,
                meta: { breadcrumb: "Home" },
            },
        ],
    },
    {
        path: "/",
        component: ContentLayout,
        children: [
            {
                path: "categories",
                name: "ListCategories",
                component: Categories,
                meta: {
                    breadcrumb: "Categories",
                    heroTitles: {
                        website: ["Kiến thức CNTT", "Dành cho Sinh viên"],
                        mobile: ["Kiến thức CNTT", "Dành cho Sinh viên"],
                    },
                },
            },
            {
                path: "videos",
                name: "ListVideos",
                component: Videos,
                meta: {
                    breadcrumb: "Videos",
                    heroTitles: {
                        website: ["Video Clips Công Nghệ Thông Tin"],
                        mobile: ["Video Clips Công Nghệ Thông Tin"],
                    },
                },
            },
            {
                path: "search",
                name: "ListResult",
                component: Search,
                meta: {
                    breadcrumb: "Search",
                    heroTitles: {
                        website: [],
                        mobile: ["Kết quả tìm kiếm"],
                    },
                },
            },
            {
                path: "blog",
                children: [
                    {
                        path: "",
                        name: "Blog",
                        component: Blog,
                        meta: {
                            breadcrumb: "Blog",
                            heroTitles: {
                                website: ["Kiến thức Công Nghệ Thông Tin", "Dành cho Sinh viên"],
                                mobile: ["Kiến thức CNTT", "Dành cho Sinh viên"],
                            },
                        },
                    },
                    {
                        path: "detail/:postSlug",
                        name: "Detail",
                        component: Detail,
                        props: true,
                        meta: {
                            breadcrumb: "Blog Detail",
                            heroTitles: {
                                website: [],
                                mobile: [],
                            },
                        },
                    },
                    {
                        path: "search",
                        name: "BlogSearch",
                        component: Search,
                        meta: {
                            breadcrumb: "Blog Search",
                            heroTitles: {
                                website: [],
                                mobile: [],
                            },
                        },
                    },
                ],
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    linkActiveClass: "active",
    scrollBehavior() {
        return { left: 0, top: 0 };
    },
    routes,
});

// NProgress configuration
NProgress.configure({ showSpinner: false });

// Session timeout setup
const SESSION_TIMEOUT_MINUTES = 1000;
const SESSION_TIMEOUT_MS = SESSION_TIMEOUT_MINUTES * 60 * 1000;

let sessionTimeout;

const resetSessionTimeout = () => {
    clearTimeout(sessionTimeout);
    sessionTimeout = setTimeout(() => {
        localStorage.removeItem("authToken");
        router.push({ name: "AuthSignIn" });
        alert("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
    }, SESSION_TIMEOUT_MS);
};

// Start/reset session timeout on each interaction
window.addEventListener("mousemove", resetSessionTimeout);
window.addEventListener("keydown", resetSessionTimeout);
window.addEventListener("click", resetSessionTimeout);
resetSessionTimeout();

router.beforeResolve((to, from, next) => {
    if (to.name) {
        NProgress.start();
    }

    // Kiểm tra xác thực
    const isAuthenticated = !!localStorage.getItem("authToken");

    // Nếu người dùng truy cập trang quản trị nhưng chưa đăng nhập
    if (to.path.startsWith("/administrator") && !isAuthenticated) {
        return next({ name: "AuthSignIn" });
    }

    next();
});

router.afterEach(() => {
    NProgress.done();
});

export default router;
