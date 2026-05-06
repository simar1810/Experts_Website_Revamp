import InvalidPartner from "@/features/experts-landing/components/invalid-partner";
import { PartnerConfigService } from "../services/PartnerConfigService";
import { PartnerLandingPresenter } from "../presenters/PartnerLandingPresenter";
import PartnerHeaderFallback from "../components/PartnerHeaderFallback";
import PartnerHeroSection from "../components/PartnerHeroSection";
import TopExpertsSection from "../components/TopExpertsSection";
import TopProductsSection from "../components/TopProductsSection";
import PartnerCtaSection from "../components/PartnerCtaSection";
import PartnerFooterFallback from "../components/PartnerFooterFallback";

/**
 * Root partner landing page rendered on tenant root URL.
 */
export default async function PartnerLandingPage({ partner }) {
  const configService = new PartnerConfigService({ partner });
  const { partner: partnerConfig, message } = await configService.fetchPublicConfig();

  if (message === "Partner not found") {
    return <InvalidPartner />;
  }

  const vm = PartnerLandingPresenter.toViewModel(partnerConfig);

  return (
    <main
      style={{
        "--brand-primary": vm.primaryColor,
        "--brand-secondary": vm.secondaryColor,
      }}
      className="bg-[#FBFBFB] font-lato"
    >
      {vm.headerHtml ? (
        <div dangerouslySetInnerHTML={{ __html: vm.headerHtml }} />
      ) : (
        <PartnerHeaderFallback brand={vm} />
      )}

      <PartnerHeroSection />
      {vm.showExperts ? <TopExpertsSection partner={partner} /> : null}

      {/* Divider */}
      <div className="mx-auto my-8 w-full max-w-6xl px-4 sm:px-6">
        <div
          style={{ backgroundColor: "#E4463B", height: "1px", width: "100%" }}
          className="rounded"
        />
      </div>

      {vm.showPrograms ? <TopProductsSection partner={partner} /> : null}
      <PartnerCtaSection />

      {vm.footerHtml ? (
        <div dangerouslySetInnerHTML={{ __html: vm.footerHtml }} />
      ) : (
        <PartnerFooterFallback brand={vm} />
      )}
    </main>
  );
}
