import { createRouter, createWebHistory } from "vue-router";
import NProgress from "nprogress/nprogress.js";
import De from "../views/De.vue";
import { msalEntity } from "../config/msalConfig";

// Import components
const WelcomeAdmin = () => import("@/views/one-ui/WelcomeAdmin.vue");
const Home = () => import("@/views/it-connect/Home.vue");
const RequestSupport = () => import("@/views/it-connect/RequestSupport.vue");
const Categories = () => import("@/views/it-connect/Categories.vue");
const Videos = () => import("@/views/it-connect/Videos.vue");
const Search = () => import("@/views/it-connect/Search.vue");
const Blog = () => import("@/views/it-connect/blog/BlogView.vue");
const Detail = () => import("@/views/it-connect/blog/DetailView.vue");
const Analysis = () => import("@/views/one-ui/monitor/Analysis.vue");
const BlogDetailsReport = () => import("@/views/one-ui/monitor/report/BlogDetailsReport.vue");
const TopBlogReport = () => import("@/views/one-ui/monitor/report/TopBlogReport.vue");
const AccessUrlReport = () => import("@/views/one-ui/monitor/report/AccessUrlReport.vue");

const DisabledCommentView = () => import("@/views/one-ui/comment/DisabledCommentView.vue");
const CommentView = () => import("@/views/one-ui/comment/CommentView.vue");
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
        path: "/de",
        component: AdminLayout,
        children: [
            {
                path: "",
                component: De,
            },
        ],
    },
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
        meta: { requiresAuth: true },
        component: AdminLayout,
        children: [
            {
                path: "",
                name: "index",
                component: WelcomeAdmin,
            },
            {
                path: "dashboard",
                name: "Dashboard",
                children: [
                    {
                        path: "analysis",
                        name: "Analysis",
                        component: Analysis,
                    },
                    {
                        path: "report",
                        name: "Report",
                        children: [
                            {
                                path: "BlogDetails",
                                name: "BlogDetailsReport",
                                component: BlogDetailsReport,
                            },
                            {
                                path: "TopBlogs",
                                name: "TopBlogReport",
                                component: TopBlogReport,
                            },
                            {
                                path: "AccessURL",
                                name: "AccessUrlReport",
                                component: AccessUrlReport,
                            },
                        ],
                    },
                ],
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
                ],
            },
            {
                path: "comment",
                children: [
                    {
                        path: "available",
                        name: "CommentView",
                        component: CommentView,
                    },
                    {
                        path: "disabled",
                        name: "DisabledCommentView",
                        component: DisabledCommentView,
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
            },
        ],
    },
    {
        path: "/",
        component: ContentLayout,
        children: [
            {
                path: "support",
                name: "RequestSupport",
                component: RequestSupport,
            },
            {
                path: "categories",
                name: "ListCategories",
                component: Categories,
            },
            {
                path: "videos",
                name: "ListVideos",
                component: Videos,
            },
            {
                path: "search",
                name: "ListResult",
                component: Search,
            },
            {
                path: "blog",
                children: [
                    {
                        path: "",
                        name: "Blog",
                        component: Blog,
                    },
                    {
                        path: "detail/:postSlug",
                        name: "Detail",
                        component: Detail,
                        props: true,
                    },
                    {
                        path: "search",
                        name: "BlogSearch",
                        component: Search,
                    },
                ],
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory("/FE/"),
    linkActiveClass: "active",
    scrollBehavior() {
        return { left: 0, top: 0 };
    },
    routes,
});

// NProgress configuration
NProgress.configure({ showSpinner: false });

router.beforeResolve((to, from, next) => {
    if (to.name) {
        NProgress.start();
    }

    next();
});
// Navigation Guard để kiểm tra trạng thái đăng nhập
router.beforeEach((to, from, next) => {
    const account = msalEntity.getActiveAccount(); // Kiểm tra user đã đăng nhập chưa

    // const token = localStorage.getItem("authToken");

    // if (to.meta.requiresAuth && token == null) {
    //     if (to.meta.requiresAuth && !account) {
    //         // Nếu route yêu cầu đăng nhập nhưng không có account → Chuyển hướng đến login
    //         next("/auth/signin");
    //     } else {
    //         next();
    //     }
    // } else {
    //     next();
    // }

    if (to.meta.requiresAuth && !account) {
        // Nếu route yêu cầu đăng nhập nhưng không có account → Chuyển hướng đến login
        next("/auth/signin");
    } else {
        next();
    }
});
router.afterEach(() => {
    NProgress.done();
});

export default router;
