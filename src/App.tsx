import { Routes, Route, useRouteError, Link } from "react-router-dom";
import { RootLayout } from "@/components/RootLayout";
import { LandingLayout } from "@/components/LandingLayout";
import HomePage from "@/routes/index";
import RandomVariantHome from "@/routes/home-random";
import IntakePage from "@/routes/intake";
import CourseDetailPage from "@/routes/course-detail";
import CoursesPage from "@/routes/courses";
import CurriculumPage from "@/routes/curriculum";
import ModuleDetailPage from "@/routes/module-detail";
import CpaConsultationPage from "@/routes/cpa-consultation";
import ReferPage from "@/routes/refer";
import ReferLandingPage from "@/routes/refer-landing";
import AboutPage from "@/routes/about";
import ContactPage from "@/routes/contact";
import SuccessPage from "@/routes/success";
import CancelPage from "@/routes/cancel";
import AdminPage from "@/routes/admin";
import PrivacyPage from "@/routes/privacy";
import TermsPage from "@/routes/terms";
import RefundPolicyPage from "@/routes/refund-policy";
import AccessibilityPage from "@/routes/accessibility";
import LandingV1 from "@/routes/lp/v1";
import LandingV2 from "@/routes/lp/v2";
import LandingV3 from "@/routes/lp/v3";
import LandingV4 from "@/routes/lp/v4";
import LandingV5 from "@/routes/lp/v5";

function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-[6rem]! font-bold! text-navy! leading-none!">404</h1>
        <h2 className="mt-4">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link to="/" className="btn-gold hover:btn-gold-hover">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export function RouteErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1>This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => location.reload()} className="btn-gold hover:btn-gold-hover">
            Try again
          </button>
          <a href="/" className="btn-outline hover:btn-outline-hover">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="home-classic" element={<HomePage />} />
        <Route path="intake" element={<IntakePage />} />
        <Route path="curriculum" element={<CurriculumPage />} />
        <Route path="modules/:slug" element={<ModuleDetailPage />} />
        <Route path="cpa-consultation" element={<CpaConsultationPage />} />
        <Route path="refer" element={<ReferPage />} />
        <Route path="refer/:code" element={<ReferLandingPage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/:slug" element={<CourseDetailPage />} />
        {/* /enroll routes into the same flow with a preselected course. */}
        <Route path="enroll" element={<IntakePage />} />
        <Route path="success" element={<SuccessPage />} />
        <Route path="cancel" element={<CancelPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="privacy-policy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="terms-of-service" element={<TermsPage />} />
        <Route path="refund-policy" element={<RefundPolicyPage />} />
        <Route path="accessibility" element={<AccessibilityPage />} />
        <Route path="accessibility-statement" element={<AccessibilityPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route element={<LandingLayout />}>
        <Route index element={<RandomVariantHome />} />
        <Route path="lp/v1" element={<LandingV1 />} />
        <Route path="lp/v2" element={<LandingV2 />} />
        <Route path="lp/v3" element={<LandingV3 />} />
        <Route path="lp/v4" element={<LandingV4 />} />
        <Route path="lp/v5" element={<LandingV5 />} />
      </Route>
    </Routes>
  );
}
